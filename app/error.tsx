"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-earth-cream flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-8xl mb-6">🌿</div>
        <h1 className="text-4xl md:text-5xl font-display text-forest mb-4">
          Something Went Wrong
        </h1>
        <p className="text-xl text-forest-light mb-8 max-w-md mx-auto">
          We hit an unexpected issue. Please try again or head back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="btn btn-primary"
          >
            Try Again
          </button>
          <Link href="/" className="btn bg-white border border-border hover:bg-gray-50 text-forest">
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
