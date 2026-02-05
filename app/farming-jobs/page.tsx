import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { JobCard } from "@/components/JobCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Sprout, ArrowRight } from "lucide-react";
import { getUrl } from "@/lib/metadata";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Farming Jobs | Farm Hand & Agricultural Positions | PlayInDirtJobs",
  description: "Browse farming jobs across America. Find farm hand positions, agricultural careers, and sustainable farming opportunities. From organic farms to large-scale agriculture.",
  openGraph: {
    title: "Farming Jobs | Farm Hand & Agricultural Positions",
    description: "Discover farming jobs, farm hand positions, and agricultural careers from farms across America.",
    url: getUrl("farming-jobs"),
  },
  alternates: {
    canonical: getUrl("farming-jobs"),
  },
};

export default async function FarmingJobsPage() {
  const jobs = await db.job.findMany({
    where: {
      active: true,
      expiresAt: { gte: new Date() },
      OR: [
        { categories: { has: "farm-hand" } },
        { categories: { has: "farm-manager" } },
        { categories: { has: "harvest-worker" } },
        { title: { contains: "farm", mode: "insensitive" } },
      ],
    },
    take: 20,
    orderBy: [
      { featured: "desc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <>
      <main className="min-h-screen bg-earth-cream">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-earth-sand border-b border-border py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Farming Jobs" }
              ]} />

              <div className="flex items-start gap-4 mb-6">
                <Sprout className="w-12 h-12 text-primary flex-shrink-0" />
                <div>
                  <h1 className="text-4xl md:text-5xl font-display text-forest mb-4">
                    Farming Jobs
                  </h1>
                  <p className="text-xl text-forest-light leading-relaxed">
                    Discover farming careers across America. From organic vegetable farms to large-scale grain operations,
                    find farm hand positions, agricultural management roles, and sustainable farming opportunities.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-soft">
                <h2 className="text-lg font-semibold text-forest mb-3">Popular Farming Careers:</h2>
                <div className="flex flex-wrap gap-2">
                  <Link href="/" className="px-3 py-1.5 bg-primary/10 text-primary rounded hover:bg-primary/20 transition text-sm">
                    Farm Hand Jobs
                  </Link>
                  <Link href="/" className="px-3 py-1.5 bg-primary/10 text-primary rounded hover:bg-primary/20 transition text-sm">
                    Farm Manager Positions
                  </Link>
                  <Link href="/organic-farm-jobs" className="px-3 py-1.5 bg-primary/10 text-primary rounded hover:bg-primary/20 transition text-sm">
                    Organic Farming
                  </Link>
                  <Link href="/" className="px-3 py-1.5 bg-primary/10 text-primary rounded hover:bg-primary/20 transition text-sm">
                    Harvest Worker Jobs
                  </Link>
                  <Link href="/farm-apprenticeships" className="px-3 py-1.5 bg-primary/10 text-primary rounded hover:bg-primary/20 transition text-sm">
                    Farm Apprenticeships
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-display text-forest mb-6">
            {jobs.length} Farming Jobs Available
          </h2>

          {jobs.length > 0 ? (
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
          ) : (
            <div className="text-center py-12">
              <p className="text-forest-light mb-6">No farming jobs available right now. Check back soon!</p>
              <Link href="/" className="btn btn-primary">
                Browse All Jobs
              </Link>
            </div>
          )}
        </section>

        {/* SEO Content */}
        <section className="bg-white border-t border-border py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-display text-forest mb-4">About Farming Jobs</h2>
            <div className="prose prose-green max-w-none text-forest-light space-y-4">
              <p>
                Farming jobs offer rewarding careers working with the land, growing food, and contributing to sustainable agriculture.
                Whether you&apos;re looking for seasonal farm work, year-round positions, or farm management roles, PlayInDirtJobs connects
                you with opportunities across organic farms, conventional agriculture, and regenerative farming operations.
              </p>
              <p>
                Farm hand positions typically include planting, cultivating, harvesting crops, equipment operation, and general farm
                maintenance. Many farms offer benefits like housing, meals, and hands-on agricultural education. Salaries vary based
                on experience, location, and farm type, with many positions offering $30,000-$50,000 annually plus benefits.
              </p>
              <p>
                <strong>Types of Farming Jobs:</strong> Farm hands, tractor operators, irrigation specialists, farm managers,
                livestock handlers, greenhouse workers, organic farm positions, and agricultural technicians.
              </p>
            </div>
          </div>
        </section>

        {/* Related Categories */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-display text-forest mb-6">Related Job Categories</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
            <Link href="/gardening-jobs" className="card p-6 hover:border-primary/50 transition group">
              <h3 className="font-semibold text-forest mb-2 group-hover:text-primary flex items-center justify-between">
                Gardening Jobs
                <ArrowRight className="w-4 h-4" />
              </h3>
              <p className="text-sm text-forest-light">Professional gardener and horticulture positions</p>
            </Link>
            <Link href="/ranch-jobs" className="card p-6 hover:border-primary/50 transition group">
              <h3 className="font-semibold text-forest mb-2 group-hover:text-primary flex items-center justify-between">
                Ranch Jobs
                <ArrowRight className="w-4 h-4" />
              </h3>
              <p className="text-sm text-forest-light">Ranch hand and livestock management careers</p>
            </Link>
            <Link href="/organic-farm-jobs" className="card p-6 hover:border-primary/50 transition group">
              <h3 className="font-semibold text-forest mb-2 group-hover:text-primary flex items-center justify-between">
                Organic Farm Jobs
                <ArrowRight className="w-4 h-4" />
              </h3>
              <p className="text-sm text-forest-light">Certified organic farming opportunities</p>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
