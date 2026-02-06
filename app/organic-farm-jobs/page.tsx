import { Metadata } from "next";
import { db } from "@/lib/db";
import { JobCard } from "@/components/JobCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getUrl } from "@/lib/metadata";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Organic Farm Jobs | Certified Organic Farming Careers | PlayInDirtJobs",
  description: "Find organic farm jobs and certified organic farming positions. Browse sustainable agriculture careers on organic farms nationwide. Join the organic farming movement today!",
  openGraph: {
    title: "Organic Farm Jobs | Certified Organic Farming Careers",
    description: "Find organic farm jobs and certified organic farming positions nationwide.",
    url: getUrl("organic-farm-jobs"),
    siteName: 'PlayInDirtJobs',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/images/PlayInDirtX.png', width: 1200, height: 630, alt: 'Organic Farm Jobs on PlayInDirtJobs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Organic Farm Jobs | Certified Organic Farming Careers',
    description: 'Find organic farm jobs and certified organic farming positions nationwide.',
    images: ['/images/PlayInDirtX.png'],
  },
  alternates: { canonical: getUrl("organic-farm-jobs") },
};

export default async function OrganicFarmJobsPage() {
  const jobs = await db.job.findMany({
    where: {
      active: true,
      expiresAt: { gte: new Date() },
      farmType: { has: "organic" },
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
            { label: "Organic Farm Jobs" }
          ]} />
          <h1 className="text-4xl md:text-5xl font-display text-forest mb-4">Organic Farm Jobs</h1>
          <p className="text-xl text-forest-light">Certified organic farming positions and sustainable agriculture careers on organic farms across America.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-display text-forest mb-6">{jobs.length} Organic Farm Jobs Available</h2>
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
