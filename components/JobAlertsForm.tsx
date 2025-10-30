"use client";

import { useState } from "react";
import { Loader2, CheckCircle, Mail, Sparkles } from "lucide-react";
import { JOB_CATEGORIES } from "@/lib/constants";

export default function JobAlertsForm() {
  const [email, setEmail] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === JOB_CATEGORIES.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(JOB_CATEGORIES.map((cat) => cat.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          categories:
            selectedCategories.length > 0 ? selectedCategories : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail("");
        setSelectedCategories([]);
        setShowCategories(false);
      } else {
        setError(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        id="subscribe-form"
        className="card text-center max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-accent-yellow/5 border-2 border-primary/20 p-8 md:p-10"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-forest mb-3">
          You&apos;re All Set! 🎉
        </h3>
        <p className="text-lg text-forest-light mb-4">
          Check your inbox to confirm your subscription. You&apos;ll start receiving
          job alerts for sustainable agriculture opportunities that match your
          interests.
        </p>
        <p className="text-sm text-forest-light">
          Don&apos;t see our email? Check your spam folder and mark us as &quot;not spam&quot;
          to ensure you receive future alerts.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-primary hover:text-primary-dark font-medium transition-colors"
        >
          Subscribe with another email
        </button>
      </div>
    );
  }

  return (
    <div id="subscribe-form" className="card max-w-2xl mx-auto p-8 md:p-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-forest mb-3">
          Subscribe to Job Alerts
        </h2>
        <p className="text-forest-light">
          Get notified when new sustainable agriculture jobs are posted
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-forest mb-2"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            className="input w-full"
            disabled={loading}
          />
        </div>

        {/* Category Selection Toggle */}
        <div className="border-t border-earth-border pt-6">
          <button
            type="button"
            onClick={() => setShowCategories(!showCategories)}
            className="w-full flex items-center justify-between text-left group"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-medium text-forest">
                  Customize Your Alerts (Optional)
                </span>
              </div>
              <p className="text-sm text-forest-light">
                {showCategories
                  ? "Select specific job categories you&apos;re interested in"
                  : "Get alerts for specific job categories"}
              </p>
            </div>
            <div className="text-primary group-hover:text-primary-dark transition-colors">
              {showCategories ? (
                <span className="text-sm font-medium">Hide</span>
              ) : (
                <span className="text-sm font-medium">Customize</span>
              )}
            </div>
          </button>

          {showCategories && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-forest-light">
                  Select categories to receive alerts for:
                </p>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  {selectedCategories.length === JOB_CATEGORIES.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {JOB_CATEGORIES.map((category) => {
                  const isSelected = selectedCategories.includes(
                    category.id
                  );
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleCategoryToggle(category.id)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-earth-border hover:border-primary/50 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{category.emoji}</span>
                        <span
                          className={`text-sm font-medium ${
                            isSelected ? "text-primary" : "text-forest"
                          }`}
                        >
                          {category.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedCategories.length > 0 && (
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <p className="text-sm text-forest">
                    <span className="font-medium">
                      {selectedCategories.length} categories selected
                    </span>
                    {" · "}You&apos;ll receive alerts for{" "}
                    {selectedCategories
                      .map(
                        (cat) =>
                          JOB_CATEGORIES.find((c) => c.id === cat)?.label
                      )
                      .join(", ")}
                  </p>
                </div>
              )}

              {selectedCategories.length === 0 && (
                <div className="bg-accent-yellow/10 rounded-lg p-4 border border-accent-yellow/30">
                  <p className="text-sm text-forest-light">
                    No categories selected. You&apos;ll receive alerts for{" "}
                    <span className="font-medium text-forest">
                      all job postings
                    </span>
                    .
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Subscribing...
            </>
          ) : (
            <>
              <Mail className="w-5 h-5" />
              Subscribe to Job Alerts
            </>
          )}
        </button>

        <p className="text-xs text-center text-forest-light">
          By subscribing, you agree to receive job alerts via email. You can
          unsubscribe anytime with one click. We respect your privacy and never
          share your email.
        </p>
      </form>
    </div>
  );
}
