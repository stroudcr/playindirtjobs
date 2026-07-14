import type { Metadata } from "next";

import { readUnsubscribeToken } from "@/lib/outreach";

export const metadata: Metadata = {
  title: "Employer outreach preferences | PlayInDirtJobs",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; done?: string }>;
}) {
  const params = await searchParams;
  const email = params.token ? readUnsubscribeToken(params.token) : null;
  const done = params.done === "1";

  return (
    <main className="min-h-screen bg-earth-cream py-16">
      <div className="container mx-auto max-w-xl px-4">
        <div className="card p-7 text-center sm:p-10">
          <h1 className="text-3xl font-display text-forest">Employer outreach preferences</h1>
          {done ? (
            <p className="mt-4 text-forest-light">You will not receive further employer outreach from PlayInDirtJobs. Transactional messages about purchases or listings are unaffected.</p>
          ) : email && params.token ? (
            <>
              <p className="mt-4 text-forest-light">Stop employer outreach to <strong>{email}</strong>?</p>
              <form method="post" action="/api/outreach/unsubscribe" className="mt-6">
                <input type="hidden" name="token" value={params.token} />
                <button className="btn btn-primary justify-center" type="submit">Unsubscribe</button>
              </form>
            </>
          ) : (
            <p className="mt-4 text-forest-light">This unsubscribe link is invalid. Contact us if you still need help.</p>
          )}
        </div>
      </div>
    </main>
  );
}
