import { PrismaClient } from "@prisma/client";
import { isGoogleIndexingConfigured, notifyGoogleAboutJobs } from "../lib/google-indexing";

const prisma = new PrismaClient();

async function main() {
  if (!isGoogleIndexingConfigured()) {
    throw new Error(
      "Google Indexing API credentials are not configured. Set GOOGLE_INDEXING_CLIENT_EMAIL and GOOGLE_INDEXING_PRIVATE_KEY."
    );
  }

  const jobs = await prisma.job.findMany({
    where: {
      active: true,
      expiresAt: { gte: new Date() },
    },
    select: { slug: true },
    orderBy: { updatedAt: "desc" },
  });

  const results = await notifyGoogleAboutJobs(
    jobs.map((job) => job.slug),
    "URL_UPDATED"
  );
  const sent = results.filter((result) => result.sent).length;

  console.log(`Google indexing notifications sent: ${sent}/${jobs.length}`);

  if (sent !== jobs.length) {
    throw new Error("One or more Google indexing notifications failed.");
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
