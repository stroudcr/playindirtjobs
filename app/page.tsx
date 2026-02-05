import Image from "next/image";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { HomeClient } from "@/components/HomeClient";
import { US_STATES_WITHOUT_DC, getStateSlug } from "@/lib/constants";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getJobs(filters: {
  search: string;
  categories: string[];
  jobTypes: string[];
  farmTypes: string[];
  benefits: string[];
  sortBy: string;
}) {
  const where: any = {
    active: true,
    expiresAt: { gt: new Date() },
  };

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { company: { contains: filters.search, mode: "insensitive" } },
      { location: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.categories.length > 0) {
    where.categories = { hasSome: filters.categories };
  }

  if (filters.jobTypes.length > 0) {
    where.jobType = { hasSome: filters.jobTypes };
  }

  if (filters.farmTypes.length > 0) {
    where.farmType = { hasSome: filters.farmTypes };
  }

  if (filters.benefits.length > 0) {
    where.benefits = { hasSome: filters.benefits };
  }

  let orderBy: any = { createdAt: "desc" };
  if (filters.sortBy === "highest-paid") {
    orderBy = { salaryMax: "desc" };
  } else if (filters.sortBy === "most-viewed") {
    orderBy = { views: "desc" };
  }

  const jobs = await db.job.findMany({
    where,
    orderBy: [
      { featured: "desc" },
      orderBy,
    ],
    select: {
      id: true,
      slug: true,
      title: true,
      company: true,
      location: true,
      salaryMin: true,
      salaryMax: true,
      categories: true,
      jobType: true,
      featured: true,
      createdAt: true,
    },
    take: 50,
  });

  return jobs;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const filters = {
    search: (typeof params.search === "string" ? params.search : "") || "",
    categories: (typeof params.categories === "string" ? params.categories.split(",").filter(Boolean) : []),
    jobTypes: (typeof params.jobTypes === "string" ? params.jobTypes.split(",").filter(Boolean) : []),
    farmTypes: (typeof params.farmTypes === "string" ? params.farmTypes.split(",").filter(Boolean) : []),
    benefits: (typeof params.benefits === "string" ? params.benefits.split(",").filter(Boolean) : []),
    sortBy: (typeof params.sortBy === "string" ? params.sortBy : "latest") || "latest",
  };

  const jobs = await getJobs(filters);

  // Serialize dates for client component
  const serializedJobs = jobs.map(job => ({
    ...job,
    salaryMin: job.salaryMin ?? undefined,
    salaryMax: job.salaryMax ?? undefined,
    createdAt: job.createdAt,
  }));

  return (
    <main className="min-h-screen bg-earth-cream">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-earth-cream to-accent-yellow/10 border-b border-border">
        <div className="container mx-auto px-4 py-6 md:py-12">
          <div className="max-w-3xl mx-auto text-center mb-4 md:mb-8">
            <div className="flex justify-center mb-4 md:mb-6">
              <Image
                src="/images/PlayInDirtLogo.PNG"
                alt="PlayInDirtJobs - Farm, Garden & Ranch Jobs"
                width={800}
                height={800}
                className="h-64 sm:h-96 md:h-128 lg:h-192 w-auto max-w-full"
                priority
              />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-forest mb-3 md:mb-4">
              Find Farming, Gardening & Ranch Jobs
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-forest-light mb-6 md:mb-8 px-4">
              Discover sustainable agriculture careers, organic farming positions, and ranch work opportunities across America.
              <span className="hidden sm:inline"> Build a sustainable future, one job at a time.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - Interactive client component */}
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }>
        <HomeClient initialJobs={serializedJobs} initialFilters={filters} />
      </Suspense>

      {/* Browse by Category Section */}
      <section className="bg-forest/5 border-y border-border py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-forest mb-8 text-center">Browse Jobs by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            <a href="/farming-jobs" className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="text-4xl mb-3">🌾</div>
              <h3 className="font-semibold text-forest mb-1">Farming Jobs</h3>
              <p className="text-sm text-forest-light">General farm work</p>
            </a>
            <a href="/gardening-jobs" className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="font-semibold text-forest mb-1">Gardening Jobs</h3>
              <p className="text-sm text-forest-light">Horticulture careers</p>
            </a>
            <a href="/ranch-jobs" className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="text-4xl mb-3">🐄</div>
              <h3 className="font-semibold text-forest mb-1">Ranch Jobs</h3>
              <p className="text-sm text-forest-light">Livestock & cattle</p>
            </a>
            <a href="/organic-farm-jobs" className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="text-4xl mb-3">🌿</div>
              <h3 className="font-semibold text-forest mb-1">Organic Farms</h3>
              <p className="text-sm text-forest-light">Certified organic</p>
            </a>
            <a href="/farm-apprenticeships" className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-semibold text-forest mb-1">Apprenticeships</h3>
              <p className="text-sm text-forest-light">Learn & earn</p>
            </a>
          </div>
        </div>
      </section>

      {/* SEO Content Footer */}
      <section className="bg-earth-cream py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold text-forest mb-4">Popular Job Searches</h3>
              <ul className="space-y-2 text-forest-light">
                <li><a href="/farming-jobs" className="hover:text-primary">Farming Jobs</a></li>
                <li><a href="/gardening-jobs" className="hover:text-primary">Gardening Jobs</a></li>
                <li><a href="/ranch-jobs" className="hover:text-primary">Ranch Hand Jobs</a></li>
                <li><a href="/organic-farm-jobs" className="hover:text-primary">Organic Farm Jobs</a></li>
                <li><a href="/farm-apprenticeships" className="hover:text-primary">Farm Apprenticeships</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-forest mb-4">Job Types</h3>
              <ul className="space-y-2 text-forest-light">
                <li>Full-time Farm Jobs</li>
                <li>Part-time Agriculture Work</li>
                <li>Seasonal Harvest Jobs</li>
                <li>Farm Internships</li>
                <li>Remote Agriculture Positions</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-forest mb-4">About PlayInDirtJobs</h3>
              <p className="text-forest-light leading-relaxed">
                PlayInDirtJobs is the premier job board connecting agriculture professionals with sustainable farming, gardening, and ranching opportunities nationwide. Whether you&apos;re seeking organic farm positions, ranch hand work, or agricultural apprenticeships, we help you build a meaningful career in sustainable agriculture.
              </p>
            </div>
          </div>

          {/* Browse by State Section */}
          <div className="border-t border-border pt-8 mt-8">
            <h3 className="text-xl font-bold text-forest mb-4">Browse Farm Jobs by State</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {US_STATES_WITHOUT_DC.map((state) => {
                const slug = getStateSlug(state.code);
                return (
                  <a
                    key={state.code}
                    href={`/${slug}-jobs`}
                    className="text-sm text-forest-light hover:text-primary hover:underline"
                  >
                    {state.name}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border pt-8 mt-8">
            <h2 className="text-2xl font-bold text-forest mb-4">Find Your Dream Agriculture Career</h2>
            <p className="text-forest-light leading-relaxed mb-4">
              The agriculture industry offers diverse career paths from hands-on farming and gardening to ranch management and sustainable agriculture leadership. PlayInDirtJobs features the most comprehensive collection of farming jobs, gardening positions, and ranch work opportunities in the United States.
            </p>
            <p className="text-forest-light leading-relaxed">
              Our platform serves organic farms, regenerative agriculture operations, livestock ranches, nurseries, vineyards, and community gardens. Browse full-time, part-time, seasonal, and apprenticeship positions. Start your sustainable agriculture career today.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
