import { Metadata } from "next";
import { getCachedPublicJobs } from "@/lib/public-jobs";
import { JobCard } from "@/components/JobCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmployerCTA } from "@/components/EmployerCTA";
import { getUrl } from "@/lib/metadata";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Farm Apprenticeships & Training | PlayInDirtJobs",
  description: "Find farm apprenticeships and agricultural training programs in organic farming, regenerative agriculture, livestock, crops, and market gardening.",
  openGraph: {
    title: "Farm Apprenticeships & Training | PlayInDirtJobs",
    description: "Find farm apprenticeships and agricultural training programs in organic farming, regenerative agriculture, livestock, crops, and market gardening.",
    url: getUrl("farm-apprenticeships"),
    siteName: 'PlayInDirtJobs',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/images/PlayInDirtX.png', width: 1200, height: 630, alt: 'Farm Apprenticeships on PlayInDirtJobs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farm Apprenticeships & Training | PlayInDirtJobs',
    description: 'Find farm apprenticeships and agricultural training programs in organic farming, regenerative agriculture, livestock, crops, and market gardening.',
    images: ['/images/PlayInDirtX.png'],
  },
  alternates: { canonical: getUrl("farm-apprenticeships") },
};

export default async function FarmApprenticeshipsPage() {
  const jobs = await getCachedPublicJobs("farm-apprenticeships", {
    where: {
      active: true,
      expiresAt: { gte: new Date() },
      jobType: { has: "apprenticeship" },
    },
    take: 20,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Farm Apprenticeships",
    "description": "Find farm apprenticeships and agricultural training programs in organic farming, regenerative agriculture, livestock, crops, and market gardening.",
    "url": getUrl("farm-apprenticeships"),
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
      <EmployerCTA source="farm_apprenticeships" />
    </main>
    </>
  );
}
