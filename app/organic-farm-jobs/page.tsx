import { Metadata } from "next";
import { getCachedPublicJobs } from "@/lib/public-jobs";
import { JobCard } from "@/components/JobCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmployerCTA } from "@/components/EmployerCTA";
import { getUrl } from "@/lib/metadata";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Organic Farm Jobs | Sustainable Ag Work | PlayInDirtJobs",
  description: "Find organic farm jobs nationwide, including certified organic, regenerative, harvest, greenhouse, and sustainable agriculture roles.",
  openGraph: {
    title: "Organic Farm Jobs | Sustainable Ag Work | PlayInDirtJobs",
    description: "Find organic farm jobs nationwide, including certified organic, regenerative, harvest, greenhouse, and sustainable agriculture roles.",
    url: getUrl("organic-farm-jobs"),
    siteName: 'PlayInDirtJobs',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/images/PlayInDirtX.png', width: 1200, height: 630, alt: 'Organic Farm Jobs on PlayInDirtJobs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Organic Farm Jobs | Sustainable Ag Work | PlayInDirtJobs',
    description: 'Find organic farm jobs nationwide, including certified organic, regenerative, harvest, greenhouse, and sustainable agriculture roles.',
    images: ['/images/PlayInDirtX.png'],
  },
  alternates: { canonical: getUrl("organic-farm-jobs") },
};

export default async function OrganicFarmJobsPage() {
  const jobs = await getCachedPublicJobs("organic-farm-jobs", {
    where: {
      active: true,
      expiresAt: { gte: new Date() },
      farmType: { has: "organic" },
    },
    take: 20,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Organic Farm Jobs",
    "description": "Find organic farm jobs nationwide, including certified organic, regenerative, harvest, greenhouse, and sustainable agriculture roles.",
    "url": getUrl("organic-farm-jobs"),
    "isPartOf": { "@type": "WebSite", "name": "PlayInDirtJobs" }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
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
      <EmployerCTA source="organic_farm_jobs" />
    </main>
    </>
  );
}
