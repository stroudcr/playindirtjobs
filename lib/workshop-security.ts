import "server-only";
import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";

export function workshopToken(request: NextRequest) {
  const token =
    request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
  return /^[A-Za-z0-9_-]{43}$/.test(token) ? token : null;
}
export async function managedWorkshop(request: NextRequest, id: string) {
  const token = workshopToken(request);
  if (!token) return null;
  const workshop = await db.workshop.findUnique({ where: { id } });
  if (
    !workshop ||
    workshop.editToken.length !== token.length ||
    !timingSafeEqual(Buffer.from(token), Buffer.from(workshop.editToken))
  )
    return null;
  return workshop;
}
export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  return (
    origin === new URL(request.url).origin ||
    Boolean(configured && origin === new URL(configured).origin)
  );
}

// A bounded per-instance guard supplements draft ownership and payment checks.
const limits = new Map<string, { count: number; until: number }>();
export function allowWorkshopRequest(
  request: NextRequest,
  action: string,
  maximum = 15,
) {
  const key = `${action}:${request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local"}`;
  const now = Date.now();
  if (limits.size > 2000)
    for (const [key, value] of limits)
      if (value.until < now) limits.delete(key);
  const current = limits.get(key);
  if (!current || current.until < now) {
    limits.set(key, { count: 1, until: now + 3600000 });
    return true;
  }
  current.count++;
  return current.count <= maximum;
}
