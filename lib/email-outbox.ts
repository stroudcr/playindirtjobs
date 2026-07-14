import "server-only";

import { db } from "@/lib/db";
import {
  sendEmployerMessageEmail,
  sendJobConfirmationEmail,
  sendOutreachEmail,
  sendReceiptEmail,
} from "@/lib/email";

type Payload = Record<string, unknown>;

function objectPayload(value: unknown): Payload {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Email outbox payload is invalid.");
  }
  return value as Payload;
}

function text(payload: Payload, key: string) {
  const value = payload[key];
  if (typeof value !== "string" || !value) throw new Error(`Missing email payload field: ${key}`);
  return value;
}

function number(payload: Payload, key: string) {
  const value = payload[key];
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`Missing email payload field: ${key}`);
  return value;
}

async function deliver(template: string, recipient: string, rawPayload: unknown) {
  const payload = objectPayload(rawPayload);
  if (template === "JOB_CONFIRMATION") {
    await sendJobConfirmationEmail(recipient, {
      id: text(payload, "id"),
      title: text(payload, "title"),
      company: text(payload, "company"),
      slug: text(payload, "slug"),
      editToken: text(payload, "editToken"),
    });
    return;
  }

  if (template === "PAYMENT_RECEIPT") {
    await sendReceiptEmail(recipient, {
      jobTitle: text(payload, "jobTitle"),
      company: text(payload, "company"),
      plan: text(payload, "plan"),
      amount: number(payload, "amount"),
      transactionId: text(payload, "transactionId"),
      date: new Date(text(payload, "date")),
    });
    return;
  }

  if (template === "OUTREACH") {
    await sendOutreachEmail({
      to: recipient,
      subject: text(payload, "subject"),
      message: text(payload, "message"),
      unsubscribeUrl: text(payload, "unsubscribeUrl"),
    });
    return;
  }

  if (["DRAFT_RECOVERY", "EXPIRY_REMINDER", "APPLICATION_CONTACT_REQUIRED"].includes(template)) {
    await sendEmployerMessageEmail({
      to: recipient,
      subject: text(payload, "subject"),
      heading: text(payload, "heading"),
      message: text(payload, "message"),
      actionLabel: typeof payload.actionLabel === "string" ? payload.actionLabel : undefined,
      actionUrl: typeof payload.actionUrl === "string" ? payload.actionUrl : undefined,
    });
    return;
  }

  throw new Error(`Unknown email outbox template: ${template}`);
}

export async function processEmailOutboxItem(id: string) {
  const now = new Date();
  const claimed = await db.emailOutbox.updateMany({
    where: {
      id,
      status: { in: ["PENDING", "FAILED"] },
      nextAttemptAt: { lte: now },
    },
    data: {
      status: "PROCESSING",
      attempts: { increment: 1 },
    },
  });
  if (claimed.count === 0) return false;

  const item = await db.emailOutbox.findUnique({ where: { id } });
  if (!item) return false;

  const suppressed = await db.suppressionEntry.findUnique({
    where: { email: item.recipient.trim().toLowerCase() },
    select: { id: true },
  });
  if (suppressed && item.template === "OUTREACH") {
    const payload = objectPayload(item.payload);
    const outreachMessageId = typeof payload.outreachMessageId === "string" ? payload.outreachMessageId : undefined;
    await db.$transaction([
      db.emailOutbox.update({
        where: { id },
        data: { status: "FAILED", attempts: 10, lastError: "Recipient is suppressed." },
      }),
      ...(outreachMessageId
        ? [db.outreachMessage.update({ where: { id: outreachMessageId }, data: { status: "CANCELED", lastError: "Recipient is suppressed." } })]
        : []),
    ]);
    return false;
  }

  try {
    await deliver(item.template, item.recipient, item.payload);
    await db.emailOutbox.update({
      where: { id },
      data: { status: "SENT", sentAt: new Date(), lastError: null },
    });
    const payload = objectPayload(item.payload);
    if (typeof payload.outreachMessageId === "string") {
      await db.outreachMessage.update({
        where: { id: payload.outreachMessageId },
        data: { status: "SENT", sentAt: new Date(), lastError: null },
      });
    }
    return true;
  } catch (error) {
    const attempts = item.attempts;
    const delayMinutes = Math.min(24 * 60, 2 ** Math.min(attempts, 10));
    await db.emailOutbox.update({
      where: { id },
      data: {
        status: "FAILED",
        lastError: error instanceof Error ? error.message.slice(0, 4_000) : "Unknown email delivery error",
        nextAttemptAt: new Date(Date.now() + delayMinutes * 60_000),
      },
    });
    const payload = objectPayload(item.payload);
    if (typeof payload.outreachMessageId === "string") {
      await db.outreachMessage.update({
        where: { id: payload.outreachMessageId },
        data: { status: "FAILED", lastError: error instanceof Error ? error.message.slice(0, 4_000) : "Unknown email delivery error" },
      }).catch(() => undefined);
    }
    throw error;
  }
}

export async function processPendingEmailOutbox(limit = 25) {
  const now = new Date();
  await db.emailOutbox.updateMany({
    where: {
      status: "PROCESSING",
      updatedAt: { lt: new Date(now.getTime() - 15 * 60_000) },
      attempts: { lt: 10 },
    },
    data: {
      status: "FAILED",
      nextAttemptAt: now,
      lastError: "Recovered an interrupted delivery attempt.",
    },
  });

  const items = await db.emailOutbox.findMany({
    where: {
      status: { in: ["PENDING", "FAILED"] },
      nextAttemptAt: { lte: now },
      attempts: { lt: 10 },
    },
    select: { id: true },
    orderBy: { nextAttemptAt: "asc" },
    take: limit,
  });

  const results = await Promise.allSettled(items.map((item) => processEmailOutboxItem(item.id)));
  return {
    attempted: results.length,
    sent: results.filter((result) => result.status === "fulfilled" && result.value).length,
    failed: results.filter((result) => result.status === "rejected").length,
  };
}
