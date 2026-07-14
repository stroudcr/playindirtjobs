"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Mail, ShieldCheck } from "lucide-react";

type RequestResponse = {
  message?: string;
  error?: string;
};

export function EmployerLoginForm({
  token,
  returnTo,
}: {
  token?: string;
  returnTo: string;
}) {
  const router = useRouter();
  const consumed = useRef(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(Boolean(token));
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || consumed.current) return;
    consumed.current = true;

    const consume = async () => {
      try {
        const response = await fetch("/api/auth/magic-link/consume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const body = (await response.json()) as {
          error?: string;
          redirectTo?: string;
        };
        if (!response.ok || !body.redirectTo) {
          throw new Error(body.error || "This sign-in link is invalid or expired.");
        }

        router.replace(body.redirectTo);
        router.refresh();
      } catch (consumeError) {
        setError(
          consumeError instanceof Error
            ? consumeError.message
            : "Unable to sign in right now."
        );
        setLoading(false);
      }
    };

    void consume();
  }, [router, token]);

  const requestLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/auth/magic-link/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, returnTo }),
      });
      const body = (await response.json()) as RequestResponse;
      if (!response.ok) {
        throw new Error(body.error || "Unable to send a sign-in link.");
      }

      setNotice(
        body.message || "Check your inbox for a secure sign-in link."
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to send a sign-in link."
      );
    } finally {
      setLoading(false);
    }
  };

  if (token && loading) {
    return (
      <div className="card p-8 text-center" aria-live="polite">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
        <h1 className="mt-5 font-display text-3xl text-forest">Signing you in</h1>
        <p className="mt-3 text-forest-light">Verifying your secure link…</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-border bg-earth-sand px-6 py-7 sm:px-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="mt-5 font-display text-3xl text-forest sm:text-4xl">
          Employer sign in
        </h1>
        <p className="mt-3 leading-relaxed text-forest-light">
          We’ll email you a one-time link. No password to remember.
        </p>
      </div>

      <form onSubmit={requestLink} className="space-y-5 px-6 py-7 sm:px-8">
        {error ? (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        ) : null}
        {notice ? (
          <div
            role="status"
            className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{notice}</span>
          </div>
        ) : null}

        <div>
          <label htmlFor="employer-email" className="text-sm font-semibold text-forest">
            Work email
          </label>
          <div className="relative mt-2">
            <Mail
              className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-earth-brown"
              aria-hidden="true"
            />
            <input
              id="employer-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input pl-10"
              placeholder="you@yourfarm.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Email me a secure link
        </button>
        <p className="text-xs leading-relaxed text-earth-brown">
          The link expires after 15 minutes and can be used once.
        </p>
      </form>
    </div>
  );
}
