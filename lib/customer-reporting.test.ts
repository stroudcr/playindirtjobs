import { describe, expect, it } from "vitest";

import {
  reconcilePaidCustomerActivity,
  type LegacyPaidJobRecord,
  type PaidPurchaseRecord,
} from "@/lib/customer-reporting";

const now = new Date("2026-08-31T12:00:00.000Z");

function purchase(overrides: Partial<PaidPurchaseRecord> = {}): PaidPurchaseRecord {
  return {
    id: "purchase-1",
    status: "PAID",
    jobId: "job-1",
    employerId: "employer-1",
    employerEmail: "Owner@Farm.example",
    amount: 1_500,
    currency: "usd",
    stripePaymentIntentId: "pi_1",
    paidAt: now,
    createdAt: now,
    ...overrides,
  };
}

function legacyJob(overrides: Partial<LegacyPaidJobRecord> = {}): LegacyPaidJobRecord {
  return {
    id: "legacy-job-1",
    employerId: null,
    managementEmail: "legacy@farm.example",
    companyEmail: null,
    stripePaymentId: "pi_legacy_1",
    publishedAt: now,
    createdAt: now,
    ...overrides,
  };
}

describe("reconcilePaidCustomerActivity", () => {
  it("merges overlapping normalized and legacy records without double counting", () => {
    const report = reconcilePaidCustomerActivity(
      [purchase()],
      [
        legacyJob({
          id: "job-1",
          stripePaymentId: "pi_1",
          managementEmail: "owner@farm.example",
        }),
        legacyJob({ managementEmail: "owner@farm.example" }),
      ]
    );

    expect(report).toEqual({
      paidPostings: 2,
      normalizedPaidPostings: 1,
      legacyPaidPostings: 1,
      payingEmployers: 1,
      knownRevenueByCurrency: { USD: 1_500 },
      legacyRevenueUnknown: 1,
    });
  });

  it("deduplicates repeated legacy payment ids and excludes free normalized promotions", () => {
    const report = reconcilePaidCustomerActivity(
      [purchase({ amount: 0 })],
      [
        legacyJob({ id: "job-1", stripePaymentId: "pi_1" }),
        legacyJob(),
        legacyJob({ id: "legacy-job-2", stripePaymentId: "pi_legacy_1" }),
      ]
    );

    expect(report.paidPostings).toBe(1);
    expect(report.normalizedPaidPostings).toBe(0);
    expect(report.legacyPaidPostings).toBe(1);
    expect(report.legacyRevenueUnknown).toBe(1);
  });

  it("does not reclassify a refunded normalized purchase as a legacy paid sale", () => {
    const report = reconcilePaidCustomerActivity(
      [purchase({ status: "REFUNDED" })],
      [
        legacyJob({
          id: "job-1",
          stripePaymentId: "pi_1",
          managementEmail: "owner@farm.example",
        }),
      ]
    );

    expect(report.paidPostings).toBe(0);
    expect(report.payingEmployers).toBe(0);
    expect(report.knownRevenueByCurrency).toEqual({});
    expect(report.legacyRevenueUnknown).toBe(0);
  });

  it("applies the reporting window while using historical identities for reconciliation", () => {
    const old = new Date("2026-01-01T00:00:00.000Z");
    const report = reconcilePaidCustomerActivity(
      [
        purchase({ id: "purchase-old", jobId: "job-old", paidAt: old, createdAt: old }),
        purchase({ id: "purchase-new", jobId: "job-new", stripePaymentIntentId: "pi_2" }),
      ],
      [],
      { since: new Date("2026-08-01T00:00:00.000Z") }
    );

    expect(report.paidPostings).toBe(1);
    expect(report.payingEmployers).toBe(1);
    expect(report.knownRevenueByCurrency).toEqual({ USD: 1_500 });
  });
});
