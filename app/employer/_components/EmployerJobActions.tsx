"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Copy,
  Edit3,
  ExternalLink,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";

export function EmployerJobActions({
  jobId,
  slug,
  active,
  closed,
  expired,
}: {
  jobId: string;
  slug: string;
  active: boolean;
  closed: boolean;
  expired: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [closing, setClosing] = useState(false);
  const [hireSource, setHireSource] = useState<
    "playindirtjobs" | "elsewhere" | "not_sure"
  >("not_sure");
  const [error, setError] = useState<string | null>(null);

  const createDraft = (kind: "duplicate" | "renew") => {
    startTransition(async () => {
      setError(null);
      try {
        const response = await fetch(
          `/api/employer/jobs/${encodeURIComponent(jobId)}/${kind}`,
          { method: "POST" }
        );
        const body = (await response.json()) as { error?: string; url?: string };
        if (!response.ok || !body.url) {
          throw new Error(body.error || "Unable to create a posting draft.");
        }
        window.location.assign(body.url);
      } catch (draftError) {
        setError(
          draftError instanceof Error
            ? draftError.message
            : "Unable to create a posting draft."
        );
      }
    });
  };

  const changeStatus = (
    action: "deactivate" | "close",
    selectedHireSource?: typeof hireSource
  ) => {
    startTransition(async () => {
      setError(null);
      try {
        const response = await fetch(
          `/api/employer/jobs/${encodeURIComponent(jobId)}/status`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              action === "close"
                ? {
                    action,
                    closeReason: "filled",
                    hireSource: selectedHireSource,
                  }
                : { action }
            ),
          }
        );
        const body = (await response.json()) as { error?: string };
        if (!response.ok) throw new Error(body.error || "Unable to update listing.");
        setClosing(false);
        router.refresh();
      } catch (statusError) {
        setError(
          statusError instanceof Error
            ? statusError.message
            : "Unable to update listing."
        );
      }
    });
  };

  return (
    <div className="mt-5 border-t border-border pt-5">
      {error ? <p role="alert" className="mb-3 text-sm text-red-700">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Link href={`/employer/jobs/${jobId}/edit`} className="btn btn-outline px-3 py-2 text-sm">
          <Edit3 className="h-4 w-4" aria-hidden="true" /> Edit
        </Link>
        {active && !expired ? (
          <Link href={`/jobs/${slug}`} target="_blank" className="btn btn-outline px-3 py-2 text-sm">
            <ExternalLink className="h-4 w-4" aria-hidden="true" /> View
          </Link>
        ) : null}
        <button type="button" disabled={pending} onClick={() => createDraft("duplicate")} className="btn btn-outline px-3 py-2 text-sm">
          <Copy className="h-4 w-4" aria-hidden="true" /> Duplicate
        </button>
        <button type="button" disabled={pending} onClick={() => createDraft("renew")} className="btn btn-outline px-3 py-2 text-sm">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Renew
        </button>
        {active ? (
          <button type="button" disabled={pending} onClick={() => changeStatus("deactivate")} className="btn btn-outline px-3 py-2 text-sm">
            <XCircle className="h-4 w-4" aria-hidden="true" /> Deactivate
          </button>
        ) : null}
        {!closed ? (
          <button type="button" disabled={pending} onClick={() => setClosing((value) => !value)} className="btn border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 hover:bg-amber-100">
            Close as filled
          </button>
        ) : null}
      </div>

      {closing ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <label htmlFor={`hire-source-${jobId}`} className="text-sm font-semibold text-amber-950">
            Did you hire someone through PlayInDirtJobs?
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <select
              id={`hire-source-${jobId}`}
              value={hireSource}
              onChange={(event) => setHireSource(event.target.value as typeof hireSource)}
              className="input"
            >
              <option value="playindirtjobs">Yes</option>
              <option value="elsewhere">No, hired elsewhere</option>
              <option value="not_sure">Not sure / prefer not to say</option>
            </select>
            <button type="button" disabled={pending} onClick={() => changeStatus("close", hireSource)} className="btn bg-amber-700 text-white hover:bg-amber-800 sm:shrink-0">
              Confirm close
            </button>
            <button type="button" disabled={pending} onClick={() => setClosing(false)} className="btn btn-outline sm:shrink-0">Cancel</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
