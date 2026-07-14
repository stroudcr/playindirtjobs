import { NextResponse } from "next/server";
import { revokeCurrentSession } from "@/lib/auth";

export async function POST() {
  try {
    await revokeCurrentSession();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Employer logout failed", error);
    return NextResponse.json(
      { error: "Unable to sign out right now." },
      { status: 500 }
    );
  }
}
