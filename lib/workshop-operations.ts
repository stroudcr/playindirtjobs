import "server-only";
import { db } from "@/lib/db";
import { workshopMessage } from "@/lib/workshop-payments";
export async function prepareWorkshopReports() {
  const now = new Date();
  const expired = await db.workshop.updateMany({
    where: {
      status: { in: ["PUBLISHED", "SOLD_OUT"] },
      expiresAt: { lte: now },
    },
    data: { status: "EXPIRED" },
  });
  const workshops = await db.workshop.findMany({
    where: {
      managementEmail: { not: null },
      publishedAt: { not: null },
      expiresAt: { gte: new Date(now.getTime() - 8 * 86400000) },
      status: { notIn: ["DRAFT", "REJECTED"] },
    },
    take: 100,
  });
  let reports = 0;
  for (const workshop of workshops) {
    const days = Math.floor(
      (now.getTime() - workshop.publishedAt!.getTime()) / 86400000,
    );
    const ended = workshop.expiresAt! <= now;
    if (days < 7 && !ended) continue;
    const key = `${workshop.id}:workshop-report:${ended ? "final" : Math.floor(days / 7)}`;
    if (
      await db.emailOutbox.findUnique({
        where: { deduplicationKey: key },
        select: { id: true },
      })
    )
      continue;
    const counts = await db.workshopEvent.groupBy({
      by: ["eventName"],
      where: {
        workshopId: workshop.id,
        createdAt: { gte: workshop.publishedAt! },
      },
      _count: { _all: true },
    });
    const count = (event: string) =>
      counts.find((item) => item.eventName === event)?._count._all ?? 0;
    await db.emailOutbox.upsert({
      where: { deduplicationKey: key },
      update: {},
      create: {
        recipient: workshop.managementEmail!,
        template: "WORKSHOP_MESSAGE",
        deduplicationKey: key,
        payload: workshopMessage(
          ended
            ? "Your workshop promotion has ended"
            : "Your workshop listing activity",
          `Since publication, “${workshop.title}” has received ${count("workshop_detail_view")} course-page views and ${count("workshop_registration_click")} registration-link clicks. These are deduplicated visitor-session actions, not confirmed enrollments.${ended ? " Promotion has ended. You can reuse the details for a new $15 listing; there is no automatic renewal." : " You can check your listing or mark it full using the link below."}`,
          workshop.editToken,
        ),
      },
    });
    reports++;
  }
  return { expired: expired.count, reports };
}
