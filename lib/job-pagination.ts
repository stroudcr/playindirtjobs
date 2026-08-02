export const PUBLIC_JOBS_PAGE_SIZE = 50;
const MAX_PUBLIC_JOB_OFFSET = 10_000;

export function normalizePublicJobOffset(value: string | null) {
  if (!value) return 0;

  const offset = Number(value);
  if (!Number.isSafeInteger(offset) || offset < 0) return 0;

  return Math.min(offset, MAX_PUBLIC_JOB_OFFSET);
}
