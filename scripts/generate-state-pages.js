const fs = require('fs');
const path = require('path');

const US_STATES_WITHOUT_DC = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" }
];

const STATE_PAGE_TEMPLATE = (stateCode, stateName, stateSlug) => `import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { JobCard } from "@/components/JobCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MapPin, ArrowRight } from "lucide-react";
import { getUrl } from "@/lib/metadata";
import { getStateContent } from "@/lib/state-content";

export const dynamic = 'force-dynamic';

const STATE_CODE = '${stateCode}';
const stateContent = getStateContent(STATE_CODE)!;

export const metadata: Metadata = {
  title: stateContent.metaTitle,
  description: stateContent.metaDescription,
  openGraph: {
    title: stateContent.metaTitle,
    description: stateContent.metaDescription,
    url: getUrl("${stateSlug}-jobs"),
    siteName: 'PlayInDirtJobs',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: stateContent.metaTitle,
    description: stateContent.metaDescription,
  },
  alternates: {
    canonical: getUrl("${stateSlug}-jobs"),
  },
};

export default async function ${stateName.replace(/\s+/g, '')}JobsPage() {
  const jobs = await db.job.findMany({
    where: {
      active: true,
      expiresAt: { gte: new Date() },
      OR: [
        { state: { equals: STATE_CODE, mode: "insensitive" } },
        { state: { equals: stateContent.name, mode: "insensitive" } },
      ],
    },
    take: 50,
    orderBy: [
      { featured: "desc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <>
      <main className="min-h-screen bg-earth-cream">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-earth-cream to-accent-yellow/10 border-b border-border py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Jobs", href: "/" },
                { label: \`\${stateContent.name} Jobs\` }
              ]} />

              <div className="flex items-start gap-4 mb-6">
                <MapPin className="w-12 h-12 text-primary flex-shrink-0" />
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4">
                    Farm Jobs in {stateContent.name}
                  </h1>
                  <p className="text-xl text-forest-light leading-relaxed">
                    {stateContent.heroDescription}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-soft">
                <h2 className="text-lg font-semibold text-forest mb-3">Major Cities with Farm Jobs:</h2>
                <div className="flex flex-wrap gap-2">
                  {stateContent.majorCities.slice(0, 6).map((city) => (
                    <span key={city} className="px-3 py-1.5 bg-primary/10 text-primary rounded text-sm">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-forest mb-6">
            {jobs.length} Farm Job{jobs.length !== 1 ? 's' : ''} in {stateContent.name}
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
              <p className="text-forest-light mb-6">No farm jobs available in {stateContent.name} right now. Check back soon!</p>
              <Link href="/" className="btn btn-primary">
                Browse All Jobs
              </Link>
            </div>
          )}
        </section>

        {/* SEO Content - Introduction */}
        <section className="bg-white border-t border-border py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-forest mb-4">Farm Jobs in {stateContent.name}</h2>
            <div className="prose prose-green max-w-none text-forest-light space-y-4">
              <p>{stateContent.content.introduction}</p>
            </div>
          </div>
        </section>

        {/* Why Work Section */}
        <section className="container mx-auto px-4 py-12 max-w-4xl">
          <h2 className="text-2xl font-bold text-forest mb-4">Why Work on {stateContent.name} Farms?</h2>
          <div className="prose prose-green max-w-none text-forest-light space-y-4">
            <p>{stateContent.content.whyWork}</p>
          </div>
        </section>

        {/* Types of Farms Section */}
        <section className="bg-white border-t border-border py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-forest mb-4">Types of Farms in {stateContent.name}</h2>
            <div className="prose prose-green max-w-none text-forest-light space-y-4">
              <p>{stateContent.content.typesOfFarms}</p>
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="container mx-auto px-4 py-12 max-w-4xl">
          <h2 className="text-2xl font-bold text-forest mb-4">Getting Started with Farm Work in {stateContent.name}</h2>
          <div className="prose prose-green max-w-none text-forest-light space-y-4">
            <p>{stateContent.content.gettingStarted}</p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white border-t border-border py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-forest mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {stateContent.faqs.map((faq, index) => (
                <div key={index} className="border-b border-border pb-6 last:border-0">
                  <h3 className="text-lg font-semibold text-forest mb-2">{faq.question}</h3>
                  <p className="text-forest-light">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related States */}
        {stateContent.relatedStates.length > 0 && (
          <section className="container mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-forest mb-6">Farm Jobs in Nearby States</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
              {stateContent.relatedStates.slice(0, 6).map((stateCode) => {
                const relatedState = getStateContent(stateCode);
                if (!relatedState) return null;
                const slug = relatedState.name.toLowerCase().replace(/\\s+/g, '-');
                return (
                  <Link key={stateCode} href={\`/\${slug}-jobs\`} className="card p-6 hover:border-primary/50 transition group">
                    <h3 className="font-semibold text-forest mb-2 group-hover:text-primary flex items-center justify-between">
                      {relatedState.name} Farm Jobs
                      <ArrowRight className="w-4 h-4" />
                    </h3>
                    <p className="text-sm text-forest-light">Browse agricultural positions in {relatedState.name}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Related Categories */}
        <section className="bg-white border-t border-border py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-forest mb-6">Browse by Job Category</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/farming-jobs" className="card p-6 hover:border-primary/50 transition group">
                <h3 className="font-semibold text-forest mb-2 group-hover:text-primary flex items-center justify-between">
                  Farming Jobs
                  <ArrowRight className="w-4 h-4" />
                </h3>
                <p className="text-sm text-forest-light">Farm hand and crop production positions</p>
              </Link>
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
            </div>
          </div>
        </section>
      </main>

      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": getUrl()
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Jobs",
                "item": getUrl()
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": \`\${stateContent.name} Farm Jobs\`,
                "item": getUrl("${stateSlug}-jobs")
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": stateContent.faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </>
  );
}
`;

const appDir = path.join(process.cwd(), 'app');
let created = 0;
let skipped = 0;

console.log('🚀 Generating state job pages...\\n');

US_STATES_WITHOUT_DC.forEach((state) => {
  const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
  const dirPath = path.join(appDir, `${stateSlug}-jobs`);
  const filePath = path.join(dirPath, 'page.tsx');

  // Skip if already exists
  if (fs.existsSync(filePath)) {
    console.log(`⏭️  Skipping ${state.name} (already exists)`);
    skipped++;
    return;
  }

  // Create directory
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Write file
  const content = STATE_PAGE_TEMPLATE(state.code, state.name, stateSlug);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Created ${state.name} jobs page: ${stateSlug}-jobs/page.tsx`);
  created++;
});

console.log(`\\n📊 Summary:`);
console.log(`   Created: ${created} pages`);
console.log(`   Skipped: ${skipped} pages`);
console.log(`   Total: ${US_STATES_WITHOUT_DC.length} states`);
console.log('\\n✨ Done!');
