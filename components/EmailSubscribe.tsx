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
      <div className="card p-6 bg-primary/5 border-primary">
        <div className="flex items-center gap-3 text-primary">
          <CheckCircle className="w-6 h-6" />
          <div>
            <p className="font-semibold">Successfully subscribed!</p>
            <p className="text-sm text-forest-light">
              You&apos;ll receive job alerts in your inbox.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold text-forest">Get Job Alerts</h3>
      </div>

      <p className="text-forest-light mb-4">
        Subscribe to receive new farming, gardening, and ranching jobs in your inbox.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="input"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full justify-center"
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

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      <p className="text-xs text-forest-light mt-3">
        No spam, unsubscribe anytime. We respect your privacy.
      </p>
    </div>
  );
}
