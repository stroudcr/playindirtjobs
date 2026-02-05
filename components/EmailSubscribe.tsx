"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";

export function EmailSubscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
        <div className="flex items-center gap-2 sm:gap-3 text-primary">
          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm sm:text-base">Successfully subscribed!</p>
            <p className="text-xs sm:text-sm text-forest-light">
              You&apos;ll receive job alerts in your inbox.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <h3 className="text-lg sm:text-xl font-display text-forest">Get Job Alerts</h3>
      </div>

      <p className="text-sm sm:text-base text-forest-light mb-3 sm:mb-4">
        Subscribe to receive new farming, gardening, and ranching jobs in your inbox.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="input text-sm sm:text-base"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full justify-center text-sm sm:text-base"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </button>

        {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
      </form>

      <p className="text-xs text-forest-light mt-3">
        No spam, unsubscribe anytime. We respect your privacy.
      </p>
    </div>
  );
}
