import { NextRequest, NextResponse } from "next/server";
import { importWorkshop } from "@/lib/workshop-import";
import { publicWebUrl } from "@/lib/workshop-validation";
import { allowWorkshopRequest, isSameOrigin } from "@/lib/workshop-security";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { error: "Please submit from PlayInDirtJobs." },
      { status: 403 },
    );
  if (!allowWorkshopRequest(request, "import", 10))
    return NextResponse.json(
      { error: "Import limit reached. You can still enter details manually." },
      { status: 429 },
    );
  const body = await request.json().catch(() => null);
  const parsed = publicWebUrl.safeParse(body?.url);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Enter a public course page URL." },
      { status: 400 },
    );
  try {
    return NextResponse.json(await importWorkshop(parsed.data));
  } catch {
    return NextResponse.json(
      {
        error:
          "This page could not be imported. You can enter the course details below.",
      },
      { status: 422 },
    );
  }
}
