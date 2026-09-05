import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createWorkshopCheckout } from "@/lib/workshop-payments";
import { allowWorkshopRequest, isSameOrigin } from "@/lib/workshop-security";
import {
  workshopSchema,
  validateUpcomingWorkshop,
} from "@/lib/workshop-validation";
export const runtime = "nodejs";
const schema = z.object({
  requestId: z.string().uuid(),
  token: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
  workshop: workshopSchema,
  reviewed: z.literal(true),
});
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { error: "Please submit from PlayInDirtJobs." },
      { status: 403 },
    );
  if (!allowWorkshopRequest(request, "checkout", 30))
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 },
    );
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ?? "Check your workshop details.",
      },
      { status: 400 },
    );
  try {
    validateUpcomingWorkshop(parsed.data.workshop);
    const result = await createWorkshopCheckout(
      parsed.data.workshop,
      parsed.data.requestId,
      parsed.data.token,
    );
    return NextResponse.json(result, {
      status: result.error ? 409 : 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error(
      "Workshop checkout failed",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      {
        error:
          "Checkout could not start. Your draft is saved; please try again.",
      },
      { status: 503 },
    );
  }
}
