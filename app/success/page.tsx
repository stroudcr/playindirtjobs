"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jobId = searchParams.get("job_id");

    if (jobId) {
      // Poll for job activation (webhooks can take a moment)
      const checkJob = async () => {
        try {
          const response = await fetch(`/api/jobs/${jobId}`);
          const data = await response.json();

          if (data.job) {
            setJob(data.job);
            setLoading(false);
          } else {
            // If job not active yet, check again in 2 seconds
            setTimeout(checkJob, 2000);
          }
        } catch (error) {
          console.error("Error fetching job:", error);
          setLoading(false);
        }
      };

      checkJob();
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <main className="min-h-screen bg-earth-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-forest-light">Processing your payment...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-earth-cream flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />

        <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4">
          Job Posted Successfully! 🌱
        </h1>

        <p className="text-xl text-forest-light mb-8">
          Your job posting is now live and visible to job seekers.
        </p>

        <div className="card p-8 mb-8 text-left">
          <h2 className="text-2xl font-bold text-forest mb-4">What&apos;s next?</h2>
          <ul className="space-y-3 text-forest-light">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">📧</span>
              <span>
                Check your email for a confirmation and a magic link to manage your posting
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">👀</span>
              <span>
                Your job will appear in search results and be visible for 60 days
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✏️</span>
              <span>
                Use the magic link in your email to edit or deactivate your listing anytime
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">📊</span>
              <span>
                Track views and engagement from your management dashboard
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {job && (
            <Link href={`/jobs/${job.slug}`} className="btn btn-primary">
              View Your Posting
            </Link>
          )}
          <Link href="/" className="btn bg-white border border-border hover:bg-gray-50 text-forest">
            Browse All Jobs
          </Link>
        </div>

        <div className="mt-12 p-6 bg-accent-yellow/10 rounded-lg border border-accent-yellow/30">
          <p className="text-sm text-forest-light">
            Thank you for supporting agriculture and helping connect people with meaningful farm work!
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-earth-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
