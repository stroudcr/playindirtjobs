import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getStateCode } from "@/lib/constants";
import { type PublicWorkshop, workshopIsOpen } from "@/lib/workshop-types";

export const PUBLIC_WORKSHOP_SELECT = {
  id: true,
  slug: true,
  title: true,
  organization: true,
  instructor: true,
  summary: true,
  description: true,
  outcomes: true,
  audience: true,
  prerequisites: true,
  topic: true,
  format: true,
  level: true,
  city: true,
  state: true,
  venue: true,
  address: true,
  postalCode: true,
  startAt: true,
  endAt: true,
  timeZone: true,
  scheduleNotes: true,
  registrationClosesAt: true,
  tuitionCents: true,
  priceNotes: true,
  registrationUrl: true,
  organizerWebsite: true,
  status: true,
  origin: true,
  verifiedAt: true,
  expiresAt: true,
  updatedAt: true,
} satisfies Prisma.WorkshopSelect;
type PublicRow = Prisma.WorkshopGetPayload<{
  select: typeof PUBLIC_WORKSHOP_SELECT;
}>;
export function publicWorkshop(row: PublicRow): PublicWorkshop {
  return {
    ...row,
    startAt: row.startAt?.toISOString() ?? null,
    endAt: row.endAt?.toISOString() ?? null,
    registrationClosesAt: row.registrationClosesAt?.toISOString() ?? null,
    verifiedAt: row.verifiedAt?.toISOString() ?? null,
    expiresAt: row.expiresAt?.toISOString() ?? null,
    updatedAt: row.updatedAt.toISOString(),
  };
}
const activeRows = unstable_cache(
  async () =>
    (
      await db.workshop.findMany({
        where: { status: "PUBLISHED", expiresAt: { gt: new Date() } },
        select: PUBLIC_WORKSHOP_SELECT,
        orderBy: [
          { startAt: { sort: "asc", nulls: "last" } },
          { title: "asc" },
        ],
        take: 500,
      })
    ).map(publicWorkshop),
  ["public-workshops-v2"],
  { revalidate: 300, tags: ["public-workshops"] },
);
export const getWorkshops = cache(async () =>
  (await activeRows()).filter((workshop) => workshopIsOpen(workshop)),
);
export const getWorkshop = cache(async (slug: string) => {
  const row = await db.workshop.findFirst({
    where: { slug, publishedAt: { not: null } },
    select: PUBLIC_WORKSHOP_SELECT,
  });
  return row ? publicWorkshop(row) : null;
});
export async function relatedWorkshops({
  state,
  topics,
  exclude,
  limit = 2,
}: {
  state?: string;
  topics?: string[];
  exclude?: string;
  limit?: number;
} = {}) {
  const rows = await getWorkshops();
  const stateCode = state ? getStateCode(state).toUpperCase() : null;
  return rows
    .filter(
      (workshop) =>
        workshop.id !== exclude &&
        (!topics?.length || topics.includes(workshop.topic)) &&
        (workshop.format !== "in-person" ||
          (stateCode && workshop.state === stateCode)),
    )
    .sort(
      (a, b) =>
        Number(b.state === stateCode) - Number(a.state === stateCode) ||
        // Rotate equal candidates daily without random rendering or hydration mismatch.
        rotation(a.id) - rotation(b.id),
    )
    .slice(0, limit);
}
function rotation(id: string) {
  let hash = Math.floor(Date.now() / 86400000);
  for (const character of id)
    hash = (Math.imul(hash, 31) + character.charCodeAt(0)) | 0;
  return hash >>> 0;
}
