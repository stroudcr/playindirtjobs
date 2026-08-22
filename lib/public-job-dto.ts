import type { Prisma } from "@prisma/client";

export type ISODateString = string;

export type PublicJobDto<T> =
  T extends Date ? ISODateString
    : T extends readonly (infer Item)[] ? PublicJobDto<Item>[]
      : T extends object ? { [Key in keyof T]: PublicJobDto<T[Key]> }
        : T;

export const PUBLIC_JOB_CARD_SELECT = {
  id: true,
  slug: true,
  title: true,
  company: true,
  location: true,
  salaryMin: true,
  salaryMax: true,
  salaryType: true,
  categories: true,
  jobType: true,
  featured: true,
  createdAt: true,
} satisfies Prisma.JobSelect;

export type PublicJobCardDto = PublicJobDto<
  Prisma.JobGetPayload<{ select: typeof PUBLIC_JOB_CARD_SELECT }>
>;

function serializePublicJobValue(value: unknown): unknown {
  if (value instanceof Date) {
    if (!Number.isFinite(value.getTime())) {
      throw new TypeError("Public job data contains an invalid date");
    }

    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(serializePublicJobValue);
  }

  if (value && typeof value === "object") {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      throw new TypeError("Public job data contains a non-serializable value");
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        serializePublicJobValue(nestedValue),
      ])
    );
  }

  return value;
}

export function toPublicJobDto<T>(job: T): PublicJobDto<T> {
  return serializePublicJobValue(job) as PublicJobDto<T>;
}

export function toPublicJobDtos<T>(jobs: readonly T[]): PublicJobDto<T>[] {
  return jobs.map(toPublicJobDto);
}

export function isISODateString(value: unknown): value is ISODateString {
  if (typeof value !== "string") return false;

  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString() === value;
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value));
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isPublicJobCardDto(value: unknown): value is PublicJobCardDto {
  if (!value || typeof value !== "object") return false;

  const job = value as Record<string, unknown>;
  return (
    typeof job.id === "string" &&
    typeof job.slug === "string" &&
    typeof job.title === "string" &&
    typeof job.company === "string" &&
    typeof job.location === "string" &&
    isNullableNumber(job.salaryMin) &&
    isNullableNumber(job.salaryMax) &&
    (job.salaryType === null || typeof job.salaryType === "string") &&
    isStringArray(job.categories) &&
    isStringArray(job.jobType) &&
    typeof job.featured === "boolean" &&
    isISODateString(job.createdAt)
  );
}
