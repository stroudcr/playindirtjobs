import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { readUnsubscribeToken } from "@/lib/outreach";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const token = form.get("token");
  const email = typeof token === "string" ? readUnsubscribeToken(token) : null;
  if (!email) return NextResponse.json({ error: "Invalid unsubscribe link." }, { status: 400 });

  await db.$transaction([
    db.suppressionEntry.upsert({
      where: { email },
      update: { reason: "recipient_request", source: "email_unsubscribe" },
      create: { email, reason: "recipient_request", source: "email_unsubscribe" },
    }),
    db.employerLead.updateMany({ where: { email }, data: { status: "UNSUBSCRIBED" } }),
    db.outreachMessage.updateMany({
      where: { recipient: email, status: { in: ["DRAFT", "APPROVED", "SCHEDULED"] } },
      data: { status: "CANCELED", lastError: "Recipient unsubscribed." },
    }),
  ]);

  return NextResponse.redirect(new URL("/unsubscribe?done=1", request.url), 303);
}
