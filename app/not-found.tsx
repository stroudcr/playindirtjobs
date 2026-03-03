import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-earth-cream flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-8xl mb-6">🌾</div>
        <h1 className="text-4xl md:text-5xl font-display text-forest mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-forest-light mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find what you&apos;re looking for. It may have been moved or no longer exists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn btn-primary">
            Browse Jobs
          </Link>
          <Link href="/post-job" className="btn bg-white border border-border hover:bg-gray-50 text-forest">
            Post a Job
          </Link>
        </div>
      </div>
    </main>
  );
}
