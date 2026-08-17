export const PUBLIC_JOBS_PAGE_SIZE = 50;
const MAX_PUBLIC_JOB_OFFSET = 10_000;
const MAX_PUBLIC_JOBS_PAGE = Math.floor(MAX_PUBLIC_JOB_OFFSET / PUBLIC_JOBS_PAGE_SIZE) + 1;

export function normalizePublicJobsPage(value: string | undefined) {
  if (!value) return 1;

  const page = Number(value);
  if (!Number.isSafeInteger(page) || page < 1) return 1;

  return Math.min(page, MAX_PUBLIC_JOBS_PAGE);
}

export function getPublicJobsPageOffset(page: number) {
  return (Math.max(1, page) - 1) * PUBLIC_JOBS_PAGE_SIZE;
}

export function normalizePublicJobOffset(value: string | null) {
  if (!value) return 0;

  const offset = Number(value);
  if (!Number.isSafeInteger(offset) || offset < 0) return 0;

  return Math.min(offset, MAX_PUBLIC_JOB_OFFSET);
}
