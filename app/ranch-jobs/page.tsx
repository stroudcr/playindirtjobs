import { Metadata } from "next";
import { db } from "@/lib/db";
import { JobCard } from "@/components/JobCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Beef } from "lucide-react";
import { getUrl } from "@/lib/metadata";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Ranch Jobs | Ranch Hand & Livestock Positions | PlayInDirtJobs",
  description: "Find ranch jobs and ranch hand positions across America. Browse cattle ranch work, livestock management careers, and ranching opportunities. Apply to top ranches today!",
  openGraph: {
    title: "Ranch Jobs | Ranch Hand & Livestock Positions",
    description: "Find ranch jobs and ranch hand positions across America.",
    url: getUrl("ranch-jobs"),
  },
  alternates: { canonical: getUrl("ranch-jobs") },
};

export default async function RanchJobsPage() {
  const jobs = await db.job.findMany({
    where: {
      active: true,
      expiresAt: { gte: new Date() },
      OR: [
        { categories: { has: "ranch-hand" } },
        { categories: { has: "livestock-care" } },
        { title: { contains: "ranch", mode: "insensitive" } },
      ],
    },
    take: 20,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <main className="min-h-screen bg-earth-cream">
      <section className="bg-gradient-to-br from-accent-blue/10 via-earth-cream to-accent-yellow/10 border-b border-border py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Ranch Jobs" }
          ]} />
          <div className="flex items-start gap-4 mb-6">
            <Beef className="w-12 h-12 text-accent-blue flex-shrink-0" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4">Ranch Jobs</h1>
              <p className="text-xl text-forest-light">Ranch hand positions, livestock management careers, and cattle ranch opportunities across America.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-forest mb-6">{jobs.length} Ranch Jobs Available</h2>
        <div className="grid gap-4 max-w-4xl">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={{
                ...job,
                salaryMin: job.salaryMin ?? undefined,
                salaryMax: job.salaryMax ?? undefined,
                salaryType: job.salaryType ?? undefined,
                createdAt: new Date(job.createdAt),
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
