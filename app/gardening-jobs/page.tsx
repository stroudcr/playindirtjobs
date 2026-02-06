import { Metadata } from "next";
import { db } from "@/lib/db";
import { JobCard } from "@/components/JobCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Leaf } from "lucide-react";
import { getUrl } from "@/lib/metadata";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Gardening Jobs | Professional Gardener Careers | PlayInDirtJobs",
  description: "Find gardening jobs and professional gardener positions. Browse horticulture careers, landscape gardening, greenhouse work, and nursery jobs. Apply to gardening opportunities nationwide.",
  openGraph: {
    title: "Gardening Jobs | Professional Gardener Careers",
    description: "Find gardening jobs and professional gardener positions nationwide.",
    url: getUrl("gardening-jobs"),
    siteName: 'PlayInDirtJobs',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/images/PlayInDirtX.png', width: 1200, height: 630, alt: 'Gardening Jobs on PlayInDirtJobs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gardening Jobs | Professional Gardener Careers',
    description: 'Find gardening jobs and professional gardener positions nationwide.',
    images: ['/images/PlayInDirtX.png'],
  },
  alternates: { canonical: getUrl("gardening-jobs") },
};

export default async function GardeningJobsPage() {
  const jobs = await db.job.findMany({
    where: {
      active: true,
      expiresAt: { gte: new Date() },
      OR: [
        { categories: { has: "gardener" } },
        { categories: { has: "nursery-worker" } },
        { title: { contains: "garden", mode: "insensitive" } },
      ],
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
            { label: "Gardening Jobs" }
          ]} />
          <div className="flex items-start gap-4 mb-6">
            <Leaf className="w-12 h-12 text-secondary flex-shrink-0" />
            <div>
              <h1 className="text-4xl md:text-5xl font-display text-forest mb-4">Gardening Jobs</h1>
              <p className="text-xl text-forest-light">Professional gardener positions, horticulture careers, greenhouse work, and nursery jobs nationwide.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-display text-forest mb-6">{jobs.length} Gardening Jobs Available</h2>
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
