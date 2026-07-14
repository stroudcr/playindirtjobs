import { after, NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { AuthenticationError, requireAdminMutation } from "@/lib/auth";
import { db } from "@/lib/db";
import { processEmailOutboxItem } from "@/lib/email-outbox";
import { unsubscribeUrl } from "@/lib/outreach";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdminMutation();
    const { id } = await params;
    const message = await db.outreachMessage.findUnique({ where: { id } });
    if (!message || message.status !== "DRAFT") {
      return NextResponse.json({ error: "Only a draft message can be approved." }, { status: 409 });
    }
    const suppressed = await db.suppressionEntry.findUnique({ where: { email: message.recipient } });
    if (suppressed) return NextResponse.json({ error: "This recipient has opted out." }, { status: 409 });
    const rawPayload = message.payload && typeof message.payload === "object" && !Array.isArray(message.payload)
      ? (message.payload as Record<string, unknown>)
      : {};
    const body = typeof rawPayload.message === "string" ? rawPayload.message : "";
    if (!body) return NextResponse.json({ error: "The approved draft has no message body." }, { status: 400 });

    const outbox = await db.$transaction(async (tx) => {
      const approved = await tx.outreachMessage.updateMany({
        where: { id: message.id, status: "DRAFT" },
        data: { status: "APPROVED", approvedAt: new Date(), approvedById: session.employer.id },
      });
      if (approved.count !== 1) throw new Error("Message approval raced with another request.");
      return tx.emailOutbox.create({
        data: {
          template: "OUTREACH",
          recipient: message.recipient,
          deduplicationKey: `${message.id}:outreach-send`,
          payload: {
            subject: message.subject,
            message: body,
            unsubscribeUrl: unsubscribeUrl(message.recipient),
            outreachMessageId: message.id,
          } as Prisma.InputJsonValue,
        },
      });
    });

    after(() => processEmailOutboxItem(outbox.id));
    return NextResponse.json({ approved: true });
  } catch (error) {
    if (error instanceof AuthenticationError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Outreach approval failed", error);
    return NextResponse.json({ error: "Unable to approve outreach." }, { status: 500 });
  }
}
