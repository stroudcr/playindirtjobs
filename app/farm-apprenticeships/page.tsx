import { Metadata } from "next";
import { db } from "@/lib/db";
import { JobCard } from "@/components/JobCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Farm Apprenticeships | Agricultural Training Programs | PlayInDirtJobs",
  description: "Find farm apprenticeship programs and agricultural training opportunities. Learn sustainable farming, organic agriculture, and regenerative practices. Start your farming career today!",
  alternates: { canonical: "https://playindirtjobs.com/farm-apprenticeships" },
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
      <section className="bg-gradient-to-br from-secondary/10 via-earth-cream to-primary/10 border-b border-border py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Farm Apprenticeships" }
          ]} />
          <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4">Farm Apprenticeships</h1>
          <p className="text-xl text-forest-light">Hands-on farm apprenticeship programs and agricultural training opportunities. Learn sustainable farming while you work.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-forest mb-6">{jobs.length} Farm Apprenticeship Programs Available</h2>
        <div className="grid gap-4 max-w-4xl">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={{
                ...job,
                salaryMin: job.salaryMin ?? undefined,
                salaryMax: job.salaryMax ?? undefined,
                createdAt: new Date(job.createdAt),
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
