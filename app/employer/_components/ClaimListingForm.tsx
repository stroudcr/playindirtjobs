"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

export function ClaimListingForm({
  jobId,
  workEmail,
}: {
  jobId: string;
  workEmail: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: string;
    message: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitClaim = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const body = (await response.json()) as {
        error?: string;
        message?: string;
        claim?: { status: string };
      };
      if (!response.ok || !body.claim) {
        throw new Error(body.error || "Unable to submit this claim.");
      }

      setResult({
        status: body.claim.status,
        message: body.message || "Your claim was submitted.",
      });
      if (body.claim.status === "APPROVED") router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit this claim."
      );
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
        <div className="flex gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" aria-hidden="true" />
          <div>
            <h2 className="font-semibold">
              {result.status === "APPROVED" ? "Listing claimed" : "Claim received"}
            </h2>
            <p className="mt-1 text-sm leading-relaxed">{result.message}</p>
            <Link href="/employer" className="mt-4 inline-flex font-semibold underline">
              Open employer workspace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}
      <div className="rounded-lg border border-border bg-earth-sand p-4">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-forest">Verified work email</p>
            <p className="mt-1 break-all text-sm text-forest-light">{workEmail}</p>
          </div>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-forest-light">
        If this email’s company domain exactly matches the listing’s company website or application website, access is granted immediately. Otherwise an administrator reviews the claim.
      </p>
      <button
        type="button"
        onClick={submitClaim}
        disabled={loading}
        className="btn btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        Claim this listing
      </button>
    </div>
  );
}
