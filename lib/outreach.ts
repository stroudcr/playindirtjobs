import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { normalizeEmail } from "@/lib/auth";

function outreachSecret() {
  const secret = process.env.OUTREACH_UNSUBSCRIBE_SECRET || process.env.CRON_SECRET;
  if (!secret || secret.length < 24) throw new Error("OUTREACH_UNSUBSCRIBE_SECRET must be configured.");
  return secret;
}

function signature(encodedEmail: string) {
  return createHmac("sha256", outreachSecret()).update(encodedEmail).digest("base64url");
}

export function createUnsubscribeToken(email: string) {
  const encodedEmail = Buffer.from(normalizeEmail(email), "utf8").toString("base64url");
  return `${encodedEmail}.${signature(encodedEmail)}`;
}

export function readUnsubscribeToken(token: string) {
  const [encodedEmail, provided] = token.split(".");
  if (!encodedEmail || !provided) return null;
  const expected = signature(encodedEmail);
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) return null;
  try {
    return normalizeEmail(Buffer.from(encodedEmail, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function unsubscribeUrl(email: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return new URL(`/unsubscribe?token=${encodeURIComponent(createUnsubscribeToken(email))}`, base).toString();
}
