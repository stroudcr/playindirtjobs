import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-earth-cream flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-8xl mb-6">🌾</div>
        <h1 className="text-4xl font-bold text-forest mb-4">Job Not Found</h1>
        <p className="text-xl text-forest-light mb-8">
          This job posting doesn&apos;t exist or has expired.
        </p>
        <Link href="/" className="btn btn-primary">
          Browse All Jobs
        </Link>
      </div>
    </main>
  );
}
