"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export function EmployerLeadForm({ source = "employers_hub" }: { source?: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    setMessage(null);
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/employer-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          source,
          marketingOptIn: form.get("marketingOptIn") === "on",
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send your inquiry.");
      setSuccess(true);
      setMessage(result.message);
      formElement.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send your inquiry.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-lg border border-border bg-white p-5 text-left shadow-soft sm:p-6">
      <h3 className="text-xl font-display text-forest">Several roles or a partnership?</h3>
      <p className="mt-2 text-sm text-forest-light">Tell us what you are planning. This does not add you to marketing unless you choose it below.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label>
          <span className="sr-only">Your name</span>
          <input name="name" className="input" placeholder="Your name" minLength={2} maxLength={120} required />
        </label>
        <label>
          <span className="sr-only">Organization</span>
          <input name="company" className="input" placeholder="Organization" minLength={2} maxLength={160} required />
        </label>
        <label className="sm:col-span-2">
          <span className="sr-only">Work email</span>
          <input name="email" type="email" className="input" placeholder="Work email" maxLength={320} required />
        </label>
        <label className="sm:col-span-2">
          <span className="sr-only">Hiring plans</span>
          <textarea name="need" className="input min-h-24" placeholder="Roles, timing, locations, or partnership idea" minLength={5} maxLength={2_000} required />
        </label>
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      </div>
      <label className="mt-4 flex items-start gap-3 text-xs leading-relaxed text-forest-light">
        <input name="marketingOptIn" type="checkbox" className="mt-0.5 h-4 w-4 accent-primary" />
        Email me occasional employer hiring guidance. I can unsubscribe at any time.
      </label>
      <button disabled={busy || success} className="btn btn-primary mt-4 w-full justify-center disabled:opacity-60" type="submit">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : success ? <CheckCircle2 className="h-4 w-4" /> : null}
        {busy ? "Sending…" : success ? "Inquiry received" : "Send inquiry"}
      </button>
      {message ? <p className={`mt-3 text-sm ${success ? "text-primary" : "text-red-700"}`} aria-live="polite">{message}</p> : null}
    </form>
  );
}
