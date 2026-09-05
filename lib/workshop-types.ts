export const WORKSHOP_FEE_CENTS = 1500;
export const WORKSHOP_DAYS = 60;
export const WORKSHOP_TOPICS = [
  {
    value: "growing",
    label: "Growing & market gardening",
    short: "Growing",
    jobs: ["farm-hand", "gardener", "farm-manager", "harvest"],
  },
  {
    value: "greenhouse",
    label: "Greenhouse & nursery",
    short: "Greenhouse",
    jobs: ["greenhouse", "nursery", "horticulture", "gardener"],
  },
  {
    value: "livestock",
    label: "Livestock & grazing",
    short: "Livestock",
    jobs: ["ranch-hand", "animal-care", "dairy", "ranch-manager"],
  },
  {
    value: "soil",
    label: "Soil & regenerative practices",
    short: "Soil & ecology",
    jobs: ["farm-hand", "gardener", "farm-manager", "organic"],
  },
  {
    value: "equipment",
    label: "Equipment & farm safety",
    short: "Farm safety",
    jobs: ["equipment-operator", "tractor-operator", "farm-hand", "ranch-hand"],
  },
] as const;
export const WORKSHOP_FORMATS = [
  { value: "in-person", label: "In person" },
  { value: "live-online", label: "Live online" },
  { value: "self-paced", label: "Self-paced online" },
] as const;
export const WORKSHOP_LEVELS = [
  "Beginner",
  "All levels",
  "Experienced",
] as const;
export type WorkshopTopic = (typeof WORKSHOP_TOPICS)[number]["value"];
export type WorkshopFormat = (typeof WORKSHOP_FORMATS)[number]["value"];

// Deliberately excludes management emails, tokens, orders and private review notes.
export interface PublicWorkshop {
  id: string;
  slug: string;
  title: string;
  organization: string;
  instructor: string;
  summary: string;
  description: string;
  outcomes: string[];
  audience: string;
  prerequisites: string;
  topic: string;
  format: string;
  level: string;
  city: string;
  state: string;
  venue: string;
  address: string;
  postalCode: string;
  startAt: string | null;
  endAt: string | null;
  timeZone: string;
  scheduleNotes: string;
  registrationClosesAt: string | null;
  tuitionCents: number;
  priceNotes: string;
  registrationUrl: string;
  organizerWebsite: string;
  status: string;
  origin: string;
  verifiedAt: string | null;
  expiresAt: string | null;
  updatedAt: string;
}

export function workshopTopic(value: string) {
  return (
    WORKSHOP_TOPICS.find((topic) => topic.value === value) ?? WORKSHOP_TOPICS[0]
  );
}
export function workshopFormat(value: string) {
  return (
    WORKSHOP_FORMATS.find((format) => format.value === value)?.label ?? value
  );
}
export function workshopPrice(workshop: Pick<PublicWorkshop, "tuitionCents">) {
  return workshop.tuitionCents === 0
    ? "Free"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: workshop.tuitionCents % 100 ? 2 : 0,
        maximumFractionDigits: 2,
      }).format(workshop.tuitionCents / 100);
}
export function workshopDate(
  workshop: Pick<PublicWorkshop, "startAt" | "format" | "timeZone">,
) {
  if (workshop.format === "self-paced" || !workshop.startAt)
    return "Start anytime";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: workshop.timeZone,
  }).format(new Date(workshop.startAt));
}
export function workshopLocation(
  workshop: Pick<PublicWorkshop, "format" | "city" | "state">,
) {
  return workshop.format === "in-person"
    ? `${workshop.city}, ${workshop.state}`
    : "Online · join from anywhere";
}
export function workshopIsOpen(
  workshop: Pick<
    PublicWorkshop,
    "status" | "expiresAt" | "startAt" | "registrationClosesAt"
  >,
  now = new Date(),
) {
  return (
    workshop.status === "PUBLISHED" &&
    Boolean(workshop.expiresAt && new Date(workshop.expiresAt) > now) &&
    (!workshop.startAt || new Date(workshop.startAt) > now) &&
    (!workshop.registrationClosesAt ||
      new Date(workshop.registrationClosesAt) > now)
  );
}
export function workshopExpiration(
  publishedAt: Date,
  startAt?: Date | null,
  closesAt?: Date | null,
) {
  return new Date(
    Math.min(
      publishedAt.getTime() + WORKSHOP_DAYS * 86400000,
      startAt?.getTime() ?? Infinity,
      closesAt?.getTime() ?? Infinity,
    ),
  );
}
export function topicsForJob(categories: string[]) {
  return WORKSHOP_TOPICS.filter((topic) =>
    topic.jobs.some((job) =>
      categories.some((category) => category.includes(job)),
    ),
  ).map((topic) => topic.value);
}
