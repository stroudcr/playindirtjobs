import { Metadata } from "next";
import { db } from "@/lib/db";
import { JobCard } from "@/components/JobCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getUrl } from "@/lib/metadata";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Farm Apprenticeships | Agricultural Training Programs | PlayInDirtJobs",
  description: "Find farm apprenticeship programs and agricultural training opportunities. Learn sustainable farming, organic agriculture, and regenerative practices. Start your farming career today!",
  openGraph: {
    title: "Farm Apprenticeships | Agricultural Training Programs",
    description: "Find farm apprenticeship programs and agricultural training opportunities nationwide.",
    url: getUrl("farm-apprenticeships"),
  },
  alternates: { canonical: getUrl("farm-apprenticeships") },
};

export default async function FarmApprenticeshipsPage() {
  const jobs = await db.job.findMany({
    where: {
      active: true,
      expiresAt: { gte: new Date() },
      jobType: { has: "apprenticeship" },
    },
    take: 20,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <main className="min-h-screen bg-earth-cream">
      <section className="bg-gradient-to-b from-white to-earth-sand border-b border-border py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Farm Apprenticeships" }
          ]} />
          <h1 className="text-4xl md:text-5xl font-display text-forest mb-4">Farm Apprenticeships</h1>
          <p className="text-xl text-forest-light">Hands-on farm apprenticeship programs and agricultural training opportunities. Learn sustainable farming while you work.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-display text-forest mb-6">{jobs.length} Farm Apprenticeship Programs Available</h2>
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
