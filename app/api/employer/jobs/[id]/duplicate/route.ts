import { NextResponse } from "next/server";

import { createJobBasedDraft } from "@/app/api/employer/_lib/create-job-draft";
import {
  AuthenticationError,
  requireEmployerMutation,
} from "@/lib/auth";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const [{ id }, session] = await Promise.all([
      params,
      requireEmployerMutation(),
    ]);
    const response = await createJobBasedDraft({
      jobId: id,
      employerId: session.employer.id,
      employerEmail: session.employer.email,
      kind: "duplicate",
    });

    return response ?? NextResponse.json({ error: "Job not found." }, { status: 404 });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Unable to duplicate employer job:", error);
    return NextResponse.json({ error: "Unable to duplicate this job." }, { status: 500 });
  }
}
