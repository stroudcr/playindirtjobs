"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen bg-earth-cream px-5 py-20 text-center">
      <h1 className="font-display text-4xl text-forest">
        We couldn’t load the workshops.
      </h1>
      <p className="mt-4 text-forest-light">Please try again in a moment.</p>
      <button className="btn btn-primary mt-6" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
