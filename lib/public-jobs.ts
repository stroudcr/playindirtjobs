import "server-only";

import { unstable_cache } from "next/cache";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

const TRANSIENT_PRISMA_CODES = new Set(["P1001", "P2024"]);
export const PUBLIC_JOBS_REVALIDATE_SECONDS = 300;

type UnknownPrismaError = {
  code?: unknown;
  errorCode?: unknown;
  message?: unknown;
};

function getPrismaErrorCode(error: unknown) {
  const prismaError = error as UnknownPrismaError | null;
  const code = prismaError?.code ?? prismaError?.errorCode;
  return typeof code === "string" ? code : undefined;
}

export function isTransientPrismaReadError(error: unknown) {
  const code = getPrismaErrorCode(error);
  if (code && TRANSIENT_PRISMA_CODES.has(code)) return true;

  const message = (error as UnknownPrismaError | null)?.message;
  if (typeof message !== "string") return false;

  return (
    message.includes("Can't reach database server") ||
    message.includes("Timed out fetching a new connection from the connection pool")
  );
}

export function logTransientPrismaReadError(context: string, error: unknown) {
  const message = (error as UnknownPrismaError | null)?.message;

  console.error("[public-db-read] transient Prisma read failure", {
    context,
    code: getPrismaErrorCode(error),
    message: typeof message === "string" ? message : undefined,
  });
}

async function runPublicJobFindMany<T extends Prisma.JobFindManyArgs>(
  args: T
): Promise<Prisma.JobGetPayload<T>[]> {
  const jobs = await db.job.findMany(args as Prisma.JobFindManyArgs);
  return jobs as Prisma.JobGetPayload<T>[];
}

async function runPublicJobCount(args: Prisma.JobCountArgs) {
  return db.job.count(args);
}

export async function findPublicJobs<T extends Prisma.JobFindManyArgs>(
  context: string,
  args: T
): Promise<Prisma.JobGetPayload<T>[]> {
  try {
    return await runPublicJobFindMany(args);
  } catch (error) {
    if (isTransientPrismaReadError(error)) {
      logTransientPrismaReadError(context, error);
      return [];
    }

    throw error;
  }
}

export async function countPublicJobs(
  context: string,
  args: Prisma.JobCountArgs
) {
  try {
    return await runPublicJobCount(args);
  } catch (error) {
    if (isTransientPrismaReadError(error)) {
      logTransientPrismaReadError(context, error);
      return 0;
    }

    throw error;
  }
}

export function getCachedPublicJobs<T extends Prisma.JobFindManyArgs>(
  context: string,
  args: T,
  revalidate = PUBLIC_JOBS_REVALIDATE_SECONDS
) {
  const getJobs = unstable_cache(
    () => runPublicJobFindMany(args),
    ["public-jobs", context],
    {
      revalidate,
      tags: ["public-jobs"],
    }
  );

  return getJobs().catch((error) => {
    if (isTransientPrismaReadError(error)) {
      logTransientPrismaReadError(context, error);
      return [] as Prisma.JobGetPayload<T>[];
    }

    throw error;
  });
}

export function getCachedPublicJobCount(
  context: string,
  args: Prisma.JobCountArgs,
  revalidate = PUBLIC_JOBS_REVALIDATE_SECONDS
) {
  const getCount = unstable_cache(
    () => runPublicJobCount(args),
    ["public-job-count", context],
    {
      revalidate,
      tags: ["public-jobs"],
    }
  );

  return getCount().catch((error) => {
    if (isTransientPrismaReadError(error)) {
      logTransientPrismaReadError(context, error);
      return 0;
    }

    throw error;
  });
}
