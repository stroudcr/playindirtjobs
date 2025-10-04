"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, DollarSign, Briefcase, ArrowLeft, Loader2 } from "lucide-react";
import { formatSalary } from "@/lib/utils";
import { JOB_CATEGORIES, FARM_TYPES, BENEFITS, PRICING } from "@/lib/constants";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function PreviewJobPage() {
  const router = useRouter();
  const [jobData, setJobData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "featured">("basic");

  useEffect(() => {
    const draft = sessionStorage.getItem("jobDraft");
    if (!draft) {
      router.push("/post-job");
      return;
    }
    setJobData(JSON.parse(draft));
  }, [router]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobData,
          plan: selectedPlan,
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!jobData) {
    return (
      <div className="min-h-screen bg-earth-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const categoryEmojis = jobData.categories
    .map((cat: string) => JOB_CATEGORIES.find(c => c.id === cat)?.emoji)
    .filter(Boolean)
    .join(" ");

  return (
    <main className="min-h-screen bg-earth-cream py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <button
          onClick={() => router.push("/post-job")}
          className="inline-flex items-center gap-2 text-forest-light hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to edit
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Preview */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-forest mb-6">Preview Your Job Posting</h1>

            <div className="card p-6 mb-6">
              {selectedPlan === "featured" && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white text-sm font-semibold rounded">
                    ⭐ Featured Job
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-forest mb-2">
                    {jobData.title}
                  </h2>
                  <p className="text-xl text-forest-light font-medium">
                    {jobData.company}
                  </p>
                </div>
                <div className="text-5xl">{categoryEmojis}</div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-forest-light">
                  <MapPin className="w-5 h-5" />
                  <span>{jobData.location}</span>
                </div>

                <div className="flex items-center gap-2 text-forest-light">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-semibold text-primary">
                    {formatSalary(jobData.salaryMin, jobData.salaryMax, jobData.salaryType)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-forest-light">
                  <Briefcase className="w-5 h-5" />
                  <span className="capitalize">
                    {jobData.jobType.join(", ").replace(/-/g, " ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-6 mb-6">
              <h3 className="text-2xl font-bold text-forest mb-4">About this job</h3>
              <div className="prose prose-green max-w-none text-forest-light whitespace-pre-wrap">
                {jobData.description}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-bold text-forest mb-4">Tags & Categories</h3>
              <div className="flex flex-wrap gap-2">
                {jobData.categories.map((cat: string) => {
                  const category = JOB_CATEGORIES.find(c => c.id === cat);
                  return category ? (
                    <span
                      key={cat}
                      className="px-3 py-1.5 bg-primary/10 text-primary font-medium rounded-lg text-sm"
                    >
                      {category.emoji} {category.label}
                    </span>
                  ) : null;
                })}
                {jobData.farmType.map((type: string) => {
                  const farmType = FARM_TYPES.find(f => f.id === type);
                  return farmType ? (
                    <span
                      key={type}
                      className="px-3 py-1.5 bg-secondary/10 text-secondary font-medium rounded-lg text-sm"
                    >
                      {farmType.emoji} {farmType.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <h2 className="text-2xl font-bold text-forest mb-4">Select Your Plan</h2>

              <div className="space-y-4 mb-6">
                <label
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPlan === "basic"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value="basic"
                    checked={selectedPlan === "basic"}
                    onChange={() => setSelectedPlan("basic")}
                    className="sr-only"
                  />
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-forest">Basic</h3>
                    <span className="text-2xl font-bold text-primary">$99</span>
                  </div>
                  <ul className="text-sm text-forest-light space-y-1">
                    <li>✓ 60-day listing</li>
                    <li>✓ Appears in search results</li>
                    <li>✓ Email notifications</li>
                  </ul>
                </label>

                <label
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPlan === "featured"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value="featured"
                    checked={selectedPlan === "featured"}
                    onChange={() => setSelectedPlan("featured")}
                    className="sr-only"
                  />
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-forest">Featured</h3>
                      <span className="text-xs text-accent-yellow font-semibold">⭐ RECOMMENDED</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">$249</span>
                  </div>
                  <ul className="text-sm text-forest-light space-y-1">
                    <li>✓ Everything in Basic</li>
                    <li>✓ Featured badge</li>
                    <li>✓ Top of search results</li>
                    <li>✓ Highlighted design</li>
                    <li>✓ 3x more visibility</li>
                  </ul>
                </label>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn btn-primary w-full justify-center mb-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue to Payment →
                  </>
                )}
              </button>

              <div className="card p-4 bg-accent-yellow/10 border-accent-yellow">
                <p className="text-sm text-forest-light">
                  💳 Secure payment powered by Stripe
                  <br />
                  📧 Manage your listing via email link
                  <br />
                  🌱 Support sustainable agriculture jobs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
