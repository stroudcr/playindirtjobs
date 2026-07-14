"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

type CheckoutState = "loading" | "invalid" | "pending" | "processing" | "published" | "recovery" | "canceled" | "refunded";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState<CheckoutState>(sessionId ? "loading" : "invalid");
  const [jobSlug, setJobSlug] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!sessionId) return;
    let canceled = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const check = async () => {
      attempts += 1;
      try {
        const response = await fetch(`/api/checkout/status?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" });
        const body = await response.json();
        if (canceled) return;
        const nextState = body.state as CheckoutState;
        setState(nextState);
        setMessage(body.message || "");
        if (nextState === "published") {
          setJobSlug(body.job?.slug || null);
          return;
        }
        if (["invalid", "recovery", "canceled", "refunded"].includes(nextState)) return;
        if (attempts < 20) {
          timer = setTimeout(check, 1_500);
        } else {
          setState("recovery");
          setMessage("Your payment is still being reconciled. Your draft and payment record are safe.");
        }
      } catch {
        if (attempts < 20) timer = setTimeout(check, 1_500);
        else {
          setState("recovery");
          setMessage("We could not confirm publication yet. Your payment record and draft are safe.");
        }
      }
    };
    void check();
    return () => {
      canceled = true;
      if (timer) clearTimeout(timer);
    };
  }, [sessionId]);

  const waiting = ["loading", "pending", "processing"].includes(state);
  const published = state === "published";

  return (
    <main className="flex min-h-screen items-center bg-earth-cream py-12">
      <div className="container mx-auto max-w-2xl px-4 text-center">
        {waiting ? <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" /> : published ? <CheckCircle className="mx-auto h-20 w-20 text-primary" /> : <AlertTriangle className="mx-auto h-16 w-16 text-amber-600" />}
        <h1 className="mt-6 text-4xl font-display text-forest sm:text-5xl">
          {published ? "Your job is live" : waiting ? "Confirming your posting" : state === "invalid" ? "Checkout confirmation missing" : "Your posting needs attention"}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-forest-light" aria-live="polite">
          {published
            ? "Payment is confirmed and the listing is visible to job seekers. We’re sending your receipt and management link now."
            : message || (state === "processing" ? "Payment is confirmed. We’re publishing your listing now." : "Waiting for Stripe to confirm payment.")}
        </p>

        <div className="card mt-8 p-6 text-left sm:p-8">
          <h2 className="text-xl font-display text-forest">What happens next</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-forest-light">
            <li>• Your private management email is never shown on the public listing.</li>
            <li>• The listing remains active for 60 days and does not renew automatically.</li>
            <li>• Your employer workspace reports job views and application-link clicks.</li>
          </ul>
        </div>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {published && jobSlug ? <Link href={`/jobs/${jobSlug}`} className="btn btn-primary justify-center">View live posting</Link> : null}
          <Link href={published ? "/employer" : "/post-job"} className="btn btn-outline justify-center">
            {published ? "Open employer workspace" : "Return to your draft"}
          </Link>
        </div>
        {!published && !waiting ? <p className="mt-5 text-sm text-forest-light">If Stripe charged the payment, do not submit it again. The recovery record lets us safely retry publication.</p> : null}
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-earth-cream" />}>
      <SuccessContent />
    </Suspense>
  );
}
