"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";

export function AdminClaimReview({ claimId }: { claimId: string }) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const review = (decision: "approve" | "reject") => {
    startTransition(async () => {
      setError(null);
      try {
        const response = await fetch(`/api/claims/${encodeURIComponent(claimId)}/review`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ decision, notes }),
        });
        const body = (await response.json()) as { error?: string };
        if (!response.ok) throw new Error(body.error || "Unable to review claim.");
        router.refresh();
      } catch (reviewError) {
        setError(reviewError instanceof Error ? reviewError.message : "Unable to review claim.");
      }
    });
  };

  return (
    <div className="mt-5 space-y-3 border-t border-border pt-5">
      <label htmlFor={`claim-notes-${claimId}`} className="text-sm font-semibold text-forest">
        Review notes
      </label>
      <textarea
        id={`claim-notes-${claimId}`}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        maxLength={2_000}
        rows={3}
        className="input h-auto resize-y"
        placeholder="Evidence checked or reason for rejection"
      />
      {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => review("approve")}
          className="btn btn-primary"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Approve
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => review("reject")}
          className="btn border border-red-200 bg-red-50 text-red-800 hover:bg-red-100"
        >
          <X className="h-4 w-4" />
          Reject
        </button>
      </div>
    </div>
  );
}
