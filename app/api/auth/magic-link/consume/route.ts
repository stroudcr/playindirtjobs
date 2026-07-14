import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  AuthenticationError,
  consumeMagicLinkToken,
} from "@/lib/auth";

const consumeSchema = z.object({
  token: z.string().min(32).max(256),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = consumeSchema.safeParse(
      await request.json().catch(() => null)
    );
    if (!parsed.success) {
      return NextResponse.json(
        { error: "This sign-in link is invalid or expired." },
        { status: 400 }
      );
    }

    const session = await consumeMagicLinkToken(parsed.data.token);
    return NextResponse.json({
      employer: session.employer,
      redirectTo: session.returnTo,
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Magic-link consumption failed", error);
    return NextResponse.json(
      { error: "Unable to sign in right now." },
      { status: 500 }
    );
  }
}
