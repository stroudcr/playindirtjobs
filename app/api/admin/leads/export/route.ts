import { NextResponse } from "next/server";

import { AuthenticationError, requireAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

function csvCell(value: unknown) {
  let text = value == null ? "" : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  try {
    await requireAdminSession();
    const leads = await db.employerLead.findMany({ orderBy: { createdAt: "desc" }, take: 5_000 });
    const lines = [
      ["id", "email", "name", "company", "source", "sourceUrl", "status", "notes", "nextActionAt", "createdAt"],
      ...leads.map((lead) => [lead.id, lead.email, lead.name, lead.company, lead.source, lead.sourceUrl, lead.status, lead.notes, lead.nextActionAt?.toISOString(), lead.createdAt.toISOString()]),
    ].map((row) => row.map(csvCell).join(","));
    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="employer-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof AuthenticationError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Unable to export leads." }, { status: 500 });
  }
}
