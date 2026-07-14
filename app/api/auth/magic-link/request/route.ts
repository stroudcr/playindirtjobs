import { EmployerRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createMagicLink,
  isAdminEmail,
  issueMagicLinkToken,
  normalizeEmail,
  safeReturnTo,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { sendEmployerMagicLinkEmail } from "@/lib/email";

const requestSchema = z.object({
  email: z.string().trim().email().max(320),
  returnTo: z.string().max(2048).optional(),
});

const GENERIC_RESPONSE = {
  message: "If that email can sign in, a secure link is on its way.",
};

export async function POST(request: NextRequest) {
  try {
    const parsed = requestSchema.safeParse(
      await request.json().catch(() => null)
    );
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const role = isAdminEmail(email)
      ? EmployerRole.ADMIN
      : EmployerRole.EMPLOYER;
    const returnTo = safeReturnTo(parsed.data.returnTo);
    const employer = await db.employer.upsert({
      where: { email },
      create: { email, role },
      update: { role },
      select: { id: true },
    });

    const recentToken = await db.authToken.findFirst({
      where: {
        employerId: employer.id,
        purpose: "SIGN_IN",
        usedAt: null,
        expiresAt: { gt: new Date() },
        createdAt: { gte: new Date(Date.now() - 60 * 1000) },
      },
      select: { id: true },
    });

    if (recentToken) {
      return NextResponse.json(GENERIC_RESPONSE, { status: 202 });
    }

    const token = await issueMagicLinkToken(employer.id, returnTo);
    try {
      await sendEmployerMagicLinkEmail(
        email,
        createMagicLink(token.rawToken)
      );
    } catch (error) {
      await db.authToken.deleteMany({ where: { tokenHash: token.tokenHash } });
      console.error("Unable to send employer magic link", error);
    }

    return NextResponse.json(GENERIC_RESPONSE, { status: 202 });
  } catch (error) {
    console.error("Magic-link request failed", error);
    return NextResponse.json(
      { error: "Unable to request a sign-in link right now." },
      { status: 500 }
    );
  }
}
