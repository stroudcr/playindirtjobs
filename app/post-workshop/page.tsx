import type { Metadata } from "next";
import Link from "next/link";
import { WorkshopWizard } from "@/components/WorkshopWizard";
export const metadata: Metadata = {
  title: "List a Workshop for $15 | PlayInDirtJobs",
  description:
    "Promote your farm, garden or ranch workshop. One-time $15 listing, up to 60 days, simple URL import and email management. No account required.",
  robots: { index: false, follow: true },
};
export default function PostWorkshopPage() {
  return (
    <main className="min-h-screen bg-earth-cream px-4 py-9 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <Link href="/workshops" className="text-sm font-medium text-primary">
          ← Workshops &amp; training
        </Link>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.17em] text-secondary-dark">
          Teach something useful
        </p>
        <h1 className="mt-3 font-display text-4xl text-forest sm:text-5xl">
          Make room for new learners.
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-forest-light">
          A dedicated workshop page and relevant placements across
          PlayInDirtJobs. <strong>$15, one time.</strong> Up to 60 days, ending
          sooner when registration closes. Reviewed before publication, normally
          within one business day.
        </p>
        <div className="mt-9">
          <WorkshopWizard />
        </div>
      </div>
    </main>
  );
}
