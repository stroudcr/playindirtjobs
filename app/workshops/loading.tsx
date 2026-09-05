export default function Loading() {
  return (
    <main className="min-h-screen bg-earth-cream px-5 py-20">
      <div className="container mx-auto animate-pulse">
        <div className="h-10 w-3/4 rounded bg-forest/10" />
        <p className="mt-6 text-forest-light" role="status">
          Finding your next learning opportunity…
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-forest/5" />
          ))}
        </div>
      </div>
    </main>
  );
}
