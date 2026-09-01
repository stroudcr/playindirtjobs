export type PaidPurchaseRecord = {
  id: string;
  status: string;
  jobId: string | null;
  employerId: string | null;
  employerEmail: string | null;
  amount: number;
  currency: string;
  stripePaymentIntentId: string | null;
  paidAt: Date | null;
  createdAt: Date;
};

export type LegacyPaidJobRecord = {
  id: string;
  employerId: string | null;
  managementEmail: string | null;
  companyEmail: string | null;
  stripePaymentId: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

export type ReconciledCustomerReport = {
  paidPostings: number;
  normalizedPaidPostings: number;
  legacyPaidPostings: number;
  payingEmployers: number;
  knownRevenueByCurrency: Record<string, number>;
  legacyRevenueUnknown: number;
};

type PaidTransaction = {
  key: string;
  source: "normalized" | "legacy";
  date: Date;
  identityTokens: string[];
  amount: number | null;
  currency: string | null;
};

function normalizedEmail(value: string | null) {
  const email = value?.trim().toLowerCase();
  return email && email.includes("@") ? email : null;
}

function normalizedId(value: string | null) {
  const id = value?.trim();
  return id || null;
}

function unique(values: Array<string | null>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

function purchaseIdentity(record: PaidPurchaseRecord) {
  const tokens = unique([
    normalizedId(record.employerId) ? `employer:${normalizedId(record.employerId)}` : null,
    normalizedEmail(record.employerEmail) ? `email:${normalizedEmail(record.employerEmail)}` : null,
    normalizedId(record.jobId) ? `job:${normalizedId(record.jobId)}` : null,
  ]);
  return tokens.length ? tokens : [`purchase:${record.id}`];
}

function legacyIdentity(record: LegacyPaidJobRecord) {
  const tokens = unique([
    normalizedId(record.employerId) ? `employer:${normalizedId(record.employerId)}` : null,
    normalizedEmail(record.managementEmail) ? `email:${normalizedEmail(record.managementEmail)}` : null,
    normalizedEmail(record.companyEmail) ? `email:${normalizedEmail(record.companyEmail)}` : null,
    normalizedId(record.id) ? `job:${normalizedId(record.id)}` : null,
  ]);
  return tokens.length ? tokens : [`legacy-job:${record.id}`];
}

class IdentityGroups {
  private readonly parents = new Map<string, string>();

  private root(token: string): string {
    const parent = this.parents.get(token);
    if (!parent) {
      this.parents.set(token, token);
      return token;
    }
    if (parent === token) return token;
    const root = this.root(parent);
    this.parents.set(token, root);
    return root;
  }

  union(tokens: string[]) {
    if (!tokens.length) return;
    const root = this.root(tokens[0]);
    for (const token of tokens.slice(1)) this.parents.set(this.root(token), root);
  }

  identity(token: string) {
    return this.root(token);
  }
}

export function reconcilePaidCustomerActivity(
  purchases: PaidPurchaseRecord[],
  legacyJobs: LegacyPaidJobRecord[],
  options: { since?: Date } = {}
): ReconciledCustomerReport {
  const paidPurchases = purchases.filter((purchase) => purchase.status === "PAID");
  const purchaseJobIds = new Set(
    purchases.map((purchase) => normalizedId(purchase.jobId)).filter(Boolean)
  );
  const purchasePaymentIds = new Set(
    purchases
      .map((purchase) => normalizedId(purchase.stripePaymentIntentId))
      .filter(Boolean)
  );
  const transactions: PaidTransaction[] = paidPurchases
    .filter((purchase) => purchase.amount > 0)
    .map((purchase) => ({
      key: `purchase:${purchase.id}`,
      source: "normalized" as const,
      date: purchase.paidAt ?? purchase.createdAt,
      identityTokens: purchaseIdentity(purchase),
      amount: purchase.amount,
      currency: /^[A-Za-z]{3}$/.test(purchase.currency.trim())
        ? purchase.currency.trim().toUpperCase()
        : "UNKNOWN",
    }));

  const normalizedByJob = new Map<string, PaidTransaction>();
  const normalizedByPayment = new Map<string, PaidTransaction>();
  for (const transaction of transactions) {
    const purchase = paidPurchases.find((candidate) => `purchase:${candidate.id}` === transaction.key);
    const jobId = purchase ? normalizedId(purchase.jobId) : null;
    const paymentId = purchase ? normalizedId(purchase.stripePaymentIntentId) : null;
    if (jobId && !normalizedByJob.has(jobId)) normalizedByJob.set(jobId, transaction);
    if (paymentId) normalizedByPayment.set(paymentId, transaction);
  }

  const legacyByPayment = new Map<string, PaidTransaction>();
  for (const legacyJob of legacyJobs) {
    const paymentId = normalizedId(legacyJob.stripePaymentId);
    if (!paymentId) continue;
    const jobId = normalizedId(legacyJob.id);
    const identityTokens = legacyIdentity(legacyJob);
    const overlapsNormalized =
      (jobId ? purchaseJobIds.has(jobId) : false) || purchasePaymentIds.has(paymentId);

    if (overlapsNormalized) {
      const matchingTransaction =
        normalizedByPayment.get(paymentId) ?? (jobId ? normalizedByJob.get(jobId) : undefined);
      if (matchingTransaction) {
        matchingTransaction.identityTokens = unique([
          ...matchingTransaction.identityTokens,
          ...identityTokens,
        ]);
      }
      continue;
    }

    const duplicate = legacyByPayment.get(paymentId);
    if (duplicate) {
      duplicate.identityTokens = unique([...duplicate.identityTokens, ...identityTokens]);
      continue;
    }

    const transaction: PaidTransaction = {
      key: `legacy-payment:${paymentId}`,
      source: "legacy",
      date: legacyJob.publishedAt ?? legacyJob.createdAt,
      identityTokens,
      amount: null,
      currency: null,
    };
    legacyByPayment.set(paymentId, transaction);
    transactions.push(transaction);
  }

  const identities = new IdentityGroups();
  for (const transaction of transactions) identities.union(transaction.identityTokens);

  const since = options.since?.getTime();
  const inPeriod = transactions.filter(
    (transaction) => since === undefined || transaction.date.getTime() >= since
  );
  const customers = new Set(
    inPeriod.map((transaction) => identities.identity(transaction.identityTokens[0]))
  );
  const knownRevenueByCurrency: Record<string, number> = {};
  for (const transaction of inPeriod) {
    if (transaction.amount === null || transaction.currency === null) continue;
    knownRevenueByCurrency[transaction.currency] =
      (knownRevenueByCurrency[transaction.currency] ?? 0) + transaction.amount;
  }

  const normalizedPaidPostings = inPeriod.filter(
    (transaction) => transaction.source === "normalized"
  ).length;
  const legacyPaidPostings = inPeriod.length - normalizedPaidPostings;
  return {
    paidPostings: inPeriod.length,
    normalizedPaidPostings,
    legacyPaidPostings,
    payingEmployers: customers.size,
    knownRevenueByCurrency,
    legacyRevenueUnknown: legacyPaidPostings,
  };
}

export function formatKnownRevenue(revenueByCurrency: Record<string, number>) {
  const entries = Object.entries(revenueByCurrency).sort(([left], [right]) =>
    left.localeCompare(right)
  );
  if (!entries.length) return "$0.00";

  return entries
    .map(([currency, cents]) => {
      if (currency === "UNKNOWN") return `Unknown ${(cents / 100).toFixed(2)}`;
      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
        }).format(cents / 100);
      } catch {
        return `${currency} ${(cents / 100).toFixed(2)}`;
      }
    })
    .join(" + ");
}
