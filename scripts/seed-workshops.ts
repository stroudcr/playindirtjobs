import { PrismaClient } from "@prisma/client";
import { randomBytes } from "node:crypto";
import { workshopSeeds } from "../prisma/workshop-seed-data";
import { workshopExpiration } from "../lib/workshop-types";
const db = new PrismaClient();
async function main() {
  if (
    workshopSeeds.length !== 10 ||
    new Set(workshopSeeds.map((item) => item.sourceUrl)).size !== 10
  )
    throw new Error("Expected ten distinct verified courses.");
  let created = 0;
  for (const seed of workshopSeeds) {
    if (
      await db.workshop.findUnique({
        where: { slug: seed.slug },
        select: { id: true },
      })
    )
      continue;
    const now = new Date(),
      startAt = seed.startAt ? new Date(seed.startAt) : null;
    if (startAt && startAt <= now)
      throw new Error(`Reverify expired seed before running: ${seed.slug}`);
    await db.workshop.create({
      data: {
        ...seed,
        startAt,
        endAt: seed.endAt ? new Date(seed.endAt) : null,
        registrationClosesAt: seed.registrationClosesAt
          ? new Date(seed.registrationClosesAt)
          : null,
        origin: "GIFTED",
        status: "PUBLISHED",
        managementEmail: null,
        editToken: randomBytes(32).toString("base64url"),
        verifiedAt: new Date("2026-09-05T12:00:00Z"),
        publishedAt: now,
        promotionEndsAt: new Date(now.getTime() + 60 * 86400000),
        expiresAt: workshopExpiration(
          now,
          startAt,
          seed.registrationClosesAt
            ? new Date(seed.registrationClosesAt)
            : null,
        ),
      },
    });
    created++;
  }
  console.log(
    JSON.stringify({
      created,
      existing: workshopSeeds.length - created,
      listingFeeCharged: 0,
      emailsSent: 0,
    }),
  );
}
main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
