import type { JobOrigin, Prisma } from "@prisma/client";

export const GOOGLE_JOB_POSTING_ELIGIBILITY_WHERE = {
  OR: [
    { origin: "EMPLOYER" },
    { employerId: { not: null } },
  ],
} satisfies Prisma.JobWhereInput;

export function isGoogleJobPostingEligible(job: {
  origin: JobOrigin;
  employerId: string | null;
}) {
  return job.origin === "EMPLOYER" || Boolean(job.employerId);
}
