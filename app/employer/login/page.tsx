import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { EmployerLoginForm } from "@/app/employer/_components/EmployerLoginForm";
import { getCurrentEmployerSession, safeReturnTo } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Employer sign in | PlayInDirtJobs",
  description: "Securely sign in to manage your PlayInDirtJobs listings.",
  robots: { index: false, follow: false },
};

export default async function EmployerLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : undefined;
  const returnTo = safeReturnTo(
    typeof params.returnTo === "string" ? params.returnTo : undefined
  );
  const session = token ? null : await getCurrentEmployerSession();

  if (session) redirect(returnTo);

  return (
    <main className="min-h-[75vh] bg-earth-cream px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-lg">
        <Link
          href="/employers"
          className="mb-5 inline-flex text-sm font-semibold text-primary hover:text-primary-dark"
        >
          ← Employer information
        </Link>
        <EmployerLoginForm token={token} returnTo={returnTo} />
      </div>
    </main>
  );
}
