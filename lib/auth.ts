import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { EmployerRole, type Employer } from "@prisma/client";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const EMPLOYER_SESSION_COOKIE = "pidj_employer_session";

const AUTH_TOKEN_TTL_MS = 15 * 60 * 1000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const SESSION_ROTATION_INTERVAL_MS = 24 * 60 * 60 * 1000;
const PREVIOUS_TOKEN_GRACE_MS = 2 * 60 * 1000;

export type EmployerSession = {
  sessionId: string;
  expiresAt: Date;
  employer: Pick<
    Employer,
    "id" | "email" | "role" | "name" | "company" | "emailVerifiedAt"
  >;
};

export type ConsumedMagicLink = EmployerSession & { returnTo: string };

export class AuthenticationError extends Error {
  readonly status: 401 | 403;

  constructor(message = "Authentication required", status: 401 | 403 = 401) {
    super(message);
    this.name = "AuthenticationError";
    this.status = status;
  }
}

export function normalizeEmail(email: string) {
  return email.normalize("NFKC").trim().toLowerCase();
}

export function generateOpaqueToken() {
  return randomBytes(32).toString("base64url");
}

export function hashOpaqueToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function isAdminEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(/[\s,;]+/)
    .map(normalizeEmail)
    .filter(Boolean);

  return new Set(allowlist).has(normalizedEmail);
}

export function getAppOrigin() {
  const configured =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = new URL(configured);

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("NEXT_PUBLIC_APP_URL must use http or https");
  }

  return url.origin;
}

export function createMagicLink(rawToken: string) {
  const url = new URL("/employer/login", getAppOrigin());
  url.searchParams.set("token", rawToken);
  return url.toString();
}

export function safeReturnTo(value: unknown, fallback = "/employer") {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return fallback;
  }

  try {
    const origin = getAppOrigin();
    const url = new URL(value, origin);
    if (url.origin !== origin) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
  };
}

async function setSessionCookie(rawToken: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(
    EMPLOYER_SESSION_COOKIE,
    rawToken,
    sessionCookieOptions(expiresAt)
  );
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(EMPLOYER_SESSION_COOKIE, "", {
    ...sessionCookieOptions(new Date(0)),
    maxAge: 0,
  });
}

export async function issueMagicLinkToken(
  employerId: string,
  returnTo = "/employer"
) {
  const rawToken = generateOpaqueToken();
  const tokenHash = hashOpaqueToken(rawToken);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + AUTH_TOKEN_TTL_MS);

  await db.authToken.create({
    data: {
      employerId,
      tokenHash,
      purpose: "SIGN_IN",
      returnTo: safeReturnTo(returnTo),
      expiresAt,
    },
  });

  return { rawToken, tokenHash, expiresAt };
}

export async function consumeMagicLinkToken(
  rawToken: string
): Promise<ConsumedMagicLink> {
  const tokenHash = hashOpaqueToken(rawToken);
  const rawSessionToken = generateOpaqueToken();
  const sessionTokenHash = hashOpaqueToken(rawSessionToken);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);

  const result = await db.$transaction(async (tx) => {
    const token = await tx.authToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        employerId: true,
        returnTo: true,
        expiresAt: true,
        usedAt: true,
      },
    });

    if (!token || token.usedAt || token.expiresAt <= now) {
      throw new AuthenticationError("This sign-in link is invalid or expired");
    }

    const claimed = await tx.authToken.updateMany({
      where: {
        id: token.id,
        usedAt: null,
        expiresAt: { gt: now },
      },
      data: { usedAt: now },
    });

    if (claimed.count !== 1) {
      throw new AuthenticationError("This sign-in link has already been used");
    }

    const existingEmployer = await tx.employer.findUniqueOrThrow({
      where: { id: token.employerId },
      select: { email: true },
    });
    const role = isAdminEmail(existingEmployer.email)
      ? EmployerRole.ADMIN
      : EmployerRole.EMPLOYER;

    const employer = await tx.employer.update({
      where: { id: token.employerId },
      data: { emailVerifiedAt: now, role },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        company: true,
        emailVerifiedAt: true,
      },
    });

    const session = await tx.authSession.create({
      data: {
        employerId: token.employerId,
        tokenHash: sessionTokenHash,
        expiresAt,
      },
      select: { id: true, expiresAt: true },
    });

    return { session, employer, returnTo: token.returnTo };
  });

  await setSessionCookie(rawSessionToken, result.session.expiresAt);

  return {
    sessionId: result.session.id,
    expiresAt: result.session.expiresAt,
    employer: result.employer,
    returnTo: safeReturnTo(result.returnTo),
  };
}

export async function getCurrentEmployerSession(options?: {
  rotate?: boolean;
}): Promise<EmployerSession | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(EMPLOYER_SESSION_COOKIE)?.value;
  if (!rawToken) return null;

  const tokenHash = hashOpaqueToken(rawToken);
  const now = new Date();
  const session = await db.authSession.findFirst({
    where: {
      expiresAt: { gt: now },
      OR: [
        { tokenHash },
        {
          previousTokenHash: tokenHash,
          previousTokenExpiresAt: { gt: now },
        },
      ],
    },
    include: {
      employer: {
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          company: true,
          emailVerifiedAt: true,
        },
      },
    },
  });

  if (!session) return null;

  let expiresAt = session.expiresAt;
  const isCurrentToken = session.tokenHash === tokenHash;
  const shouldRotate =
    options?.rotate === true &&
    isCurrentToken &&
    session.rotatedAt.getTime() <= now.getTime() - SESSION_ROTATION_INTERVAL_MS;

  if (shouldRotate) {
    const replacementToken = generateOpaqueToken();
    const replacementHash = hashOpaqueToken(replacementToken);
    const replacementExpiry = new Date(now.getTime() + SESSION_TTL_MS);
    const graceExpiry = new Date(now.getTime() + PREVIOUS_TOKEN_GRACE_MS);
    const rotated = await db.authSession.updateMany({
      where: { id: session.id, tokenHash },
      data: {
        tokenHash: replacementHash,
        previousTokenHash: tokenHash,
        previousTokenExpiresAt: graceExpiry,
        expiresAt: replacementExpiry,
        lastUsedAt: now,
        rotatedAt: now,
      },
    });

    if (rotated.count === 1) {
      expiresAt = replacementExpiry;
      await setSessionCookie(replacementToken, replacementExpiry);
    }
  } else if (options?.rotate === true && isCurrentToken) {
    await db.authSession.updateMany({
      where: {
        id: session.id,
        tokenHash,
        lastUsedAt: {
          lt: new Date(now.getTime() - 5 * 60 * 1000),
        },
      },
      data: { lastUsedAt: now },
    });
  }

  return {
    sessionId: session.id,
    expiresAt,
    employer: session.employer,
  };
}

export async function requireEmployerSession(options?: {
  rotate?: boolean;
}) {
  const session = await getCurrentEmployerSession(options);
  if (!session) throw new AuthenticationError();
  return session;
}

export async function requireEmployerMutation() {
  return requireEmployerSession({ rotate: true });
}

export async function requireAdminSession(options?: { rotate?: boolean }) {
  const session = await requireEmployerSession(options);
  if (
    session.employer.role !== EmployerRole.ADMIN ||
    !isAdminEmail(session.employer.email)
  ) {
    throw new AuthenticationError("Administrator access required", 403);
  }
  return session;
}

export async function requireAdminMutation() {
  return requireAdminSession({ rotate: true });
}

export function assertEmployerOwnership(
  session: EmployerSession,
  employerId: string
) {
  if (
    session.employer.id !== employerId &&
    (session.employer.role !== EmployerRole.ADMIN ||
      !isAdminEmail(session.employer.email))
  ) {
    throw new AuthenticationError("You cannot manage this resource", 403);
  }
}

export async function revokeCurrentSession() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(EMPLOYER_SESSION_COOKIE)?.value;

  if (rawToken) {
    const tokenHash = hashOpaqueToken(rawToken);
    await db.authSession.deleteMany({
      where: {
        OR: [{ tokenHash }, { previousTokenHash: tokenHash }],
      },
    });
  }

  await clearSessionCookie();
}
