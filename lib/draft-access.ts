import "server-only";

import { createHash, randomBytes } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export const DRAFT_ACCESS_COOKIE = "pidj_posting_draft";
const DRAFT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function hashOpaqueToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
export function createDraftAccess() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashOpaqueToken(token) };
}

export function setDraftAccessCookie(response: NextResponse, draftId: string, token: string) {
  response.cookies.set(DRAFT_ACCESS_COOKIE, `${draftId}.${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: DRAFT_COOKIE_MAX_AGE,
    path: "/",
  });
}

function readDraftCookie(request: NextRequest) {
  const value = request.cookies.get(DRAFT_ACCESS_COOKIE)?.value;
  if (!value) return null;
  const separator = value.indexOf(".");
  if (separator < 1) return null;
  return {
    draftId: value.slice(0, separator),
    token: value.slice(separator + 1),
  };
}

export async function getAccessibleDraft(request: NextRequest, requestedId?: string) {
  const access = readDraftCookie(request);
  if (!access || (requestedId && access.draftId !== requestedId)) return null;

  return db.jobDraft.findFirst({
    where: {
      id: access.draftId,
      accessTokenHash: hashOpaqueToken(access.token),
      expiresAt: { gt: new Date() },
      status: { in: ["DRAFT", "CHECKOUT"] },
    },
  });
}
