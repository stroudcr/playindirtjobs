type JobDates = {
  createdAt: Date;
  expiresAt: Date;
};

type SerializedJobDates = {
  createdAt: string;
  expiresAt: string;
};

export function serializeJobDatesForCache<T extends JobDates>(
  job: T
): Omit<T, keyof JobDates> & SerializedJobDates {
  return {
    ...job,
    createdAt: job.createdAt.toISOString(),
    expiresAt: job.expiresAt.toISOString(),
  };
}

export function restoreJobDatesFromCache<T extends SerializedJobDates>(
  job: T
): Omit<T, keyof SerializedJobDates> & JobDates {
  return {
    ...job,
    createdAt: new Date(job.createdAt),
    expiresAt: new Date(job.expiresAt),
  };
}
