import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Heart, Users, Sprout, MapPin, Clock, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About PlayInDirtJobs | Connecting America's Agricultural Community",
  description: "Learn about PlayInDirtJobs, the premier job board connecting passionate workers with sustainable farming, gardening, and ranching opportunities across America. Honoring agricultural heritage since 2025.",
  keywords: [
    "about playindirtjobs",
    "agricultural job board",
    "farm job platform",
    "sustainable agriculture careers",
    "farming heritage",
    "ranch work opportunities",
  ],
  openGraph: {
    title: "About PlayInDirtJobs | America's Agriculture Job Board",
    description: "Connecting passionate workers with meaningful agricultural careers across America. Honoring the historical prominence of farming and ranching.",
    url: "https://playindirtjobs.com/about",
  },
  alternates: {
    canonical: "https://playindirtjobs.com/about",
  },
};

export default function AboutPage() {
  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About PlayInDirtJobs",
    "description": "PlayInDirtJobs connects job seekers with sustainable farming, gardening, and ranching opportunities across America.",
    "url": "https://playindirtjobs.com/about",
    "mainEntity": {
      "@type": "Organization",
      "@id": "https://playindirtjobs.com/#organization"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />

      <main className="min-h-screen bg-earth-cream">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-earth-sand border-b border-border py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "About" }
              ]} />

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-forest mb-6 mt-6">
                Honoring America&apos;s Agricultural Heritage
              </h1>
              <p className="text-xl md:text-2xl text-forest-light leading-relaxed mb-8">
                We connect passionate workers with farms, gardens, and ranches that need them. We help those who love the work find the right place to grow.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="container mx-auto px-4 -mt-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-soft overflow-hidden">
              <div className="relative w-full h-64 md:h-96">
                <Image
                  src="/images/about1.jpg"
                  alt="Agricultural workers in the field"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8 md:p-12 bg-white">
              <h2 className="text-3xl md:text-4xl font-display text-forest mb-6 text-center">
                Our Mission
              </h2>
              <p className="text-lg md:text-xl text-forest-light leading-relaxed text-center max-w-3xl mx-auto">
                PlayInDirtJobs exists to strengthen American agriculture by connecting dedicated workers with meaningful farming, gardening, and ranching careers. We honor the stewardship of the land and the people who tend it, building bridges between those seeking purposeful work and the farms that sustain our communities.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="container mx-auto px-4 pb-12 md:pb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display text-forest mb-6">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-forest-light space-y-6">
              <p>
                For generations, agriculture has been the backbone of America. From the family farms that built this nation to the regenerative operations shaping its future, farming and ranching have always held a place of prominence in American life. Yet despite this rich heritage, a disconnect has grown between passionate individuals seeking agricultural careers and the farms desperately needing skilled, committed workers.
              </p>
              <p>
                PlayInDirtJobs was created to bridge that gap. We recognized that across the country, organic farms, permaculture gardens, family ranches, and sustainable agriculture operations were struggling to find dedicated team members. At the same time, thousands of people—from experienced farm hands to eager apprentices—were searching for opportunities to work the land and contribute to a more sustainable food system.
              </p>
              <p>
                We believe that working in agriculture is more than just a job. Whether you&apos;re planting seedlings in a nursery, managing livestock on a ranch, harvesting vegetables for a CSA, or tending vines in a vineyard, you&apos;re participating in something essential and timeless. Our platform celebrates this work and the people who do it.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-white border-y border-border py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display text-forest mb-10 text-center">
                What We Stand For
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {/* Value 1 */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-display text-forest mb-3">
                    Supporting American Agriculture
                  </h3>
                  <p className="text-forest-light leading-relaxed">
                    We honor the historical prominence of farming and ranching in America. From small family operations to large-scale sustainable farms, we support the diverse tapestry of agricultural work that feeds our nation.
                  </p>
                </div>

                {/* Value 2 */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-display text-forest mb-3">
                    Connecting Passionate Workers
                  </h3>
                  <p className="text-forest-light leading-relaxed">
                    We help those who love agricultural work find the right place to grow—matching dedicated individuals with farms, gardens, and ranches where their skills and passion will thrive.
                  </p>
                </div>

                {/* Value 3 */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Sprout className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-display text-forest mb-3">
                    Building a Sustainable Future
                  </h3>
                  <p className="text-forest-light leading-relaxed">
                    We champion organic farming, regenerative agriculture, permaculture, and sustainable ranching practices that nurture the land for generations to come.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image 2 */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-soft overflow-hidden">
              <div className="relative w-full h-64 md:h-96">
                <Image
                  src="/images/about2.jpg"
                  alt="Farm landscape and harvest scene"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
              <div className="p-6 bg-forest/5 text-center">
                <p className="text-lg text-forest italic">
                  &ldquo;The best job is the one where you can&apos;t wait to get your hands dirty.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Help */}
        <section className="container mx-auto px-4 pb-12 md:pb-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display text-forest mb-10 text-center">
              How We Help
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* For Job Seekers */}
              <div className="card p-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-display text-forest mb-4">
                  For Job Seekers
                </h3>
                <ul className="space-y-3 text-forest-light">
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>Browse hundreds of farming, gardening, and ranching jobs across America—completely free</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>Filter by job type, farm type, benefits, and location to find your perfect match</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>Receive email alerts for new opportunities in your areas of interest</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>Discover positions offering housing, meals, learning opportunities, and more</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>Connect directly with farms committed to sustainable practices</span>
                  </li>
                </ul>
                <Link href="/" className="btn btn-primary mt-6 inline-block">
                  Browse Jobs
                </Link>
              </div>

              {/* For Employers */}
              <div className="card p-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-display text-forest mb-4">
                  For Employers
                </h3>
                <ul className="space-y-3 text-forest-light">
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>Post your job in minutes with our simple, streamlined process</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>Reach thousands of dedicated job seekers passionate about agricultural work</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>60-day visibility ensures your posting gets maximum exposure</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>Manage your listing with easy-to-use magic link authentication</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>Affordable pricing designed for farms of all sizes</span>
                  </li>
                </ul>
                <Link href="/post-job" className="btn btn-primary mt-6 inline-block">
                  Post a Job
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SEO-Rich Content */}
        <section className="bg-white border-t border-border py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-display text-forest mb-6">
                Agriculture Career Opportunities for Every Passion
              </h2>
              <div className="prose prose-lg max-w-none text-forest-light space-y-6">
                <p>
                  The agricultural industry in America offers remarkably diverse career paths. From hands-on farm hand positions working directly with crops and soil, to ranch hand jobs caring for livestock across expansive grazing lands, to specialized roles in permaculture design, organic certification, greenhouse management, and agricultural technology—there&apos;s a place for every skill set and interest.
                </p>
                <p>
                  Throughout American history, farming and ranching have been more than economic activities—they&apos;ve been a way of life that shaped communities, built character, and fed generations. Today, that heritage continues through the dedicated individuals who choose agricultural careers. Whether you&apos;re drawn to the rhythms of seasonal planting and harvest, the daily care of animals, the precision of vineyard management, or the innovation happening in aquaponics and regenerative farming, agricultural work offers tangible results, meaningful purpose, and deep connection to the land.
                </p>
                <p>
                  PlayInDirtJobs features opportunities across all segments of sustainable agriculture: certified organic farms growing vegetables for farmers markets and CSAs, permaculture gardens demonstrating ecological design principles, biodynamic operations integrating cosmic rhythms with soil health, family ranches practicing rotational grazing, nurseries propagating native plants, apiaries producing local honey, vineyards crafting regional wines, and innovative farms combining aquaponics, vertical growing, and other cutting-edge techniques.
                </p>
                <p>
                  Many agricultural positions offer unique benefits beyond salary—housing in beautiful rural settings, fresh organic meals from the farm, hands-on learning from experienced farmers, equipment and tools provided, flexible schedules aligned with natural cycles, profit-sharing arrangements, health insurance, and the satisfaction of producing real food for real communities. Farm apprenticeships and internships provide invaluable education for those beginning their agricultural journey, while experienced positions offer leadership opportunities and competitive compensation.
                </p>
                <p>
                  We&apos;re committed to maintaining the highest quality job board for the agricultural community. Every listing on PlayInDirtJobs represents a genuine opportunity from a real farm, garden, nursery, or ranch. We verify employer information, ensure compliance with labor laws, and maintain a platform where both job seekers and employers can connect with confidence and authenticity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="card p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent-yellow/5">
              <h2 className="text-3xl md:text-4xl font-display text-forest mb-4">
                Ready to Grow With Us?
              </h2>
              <p className="text-xl text-forest-light mb-8">
                Whether you&apos;re seeking your next agricultural adventure or looking to build your farm team, we&apos;re here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/" className="btn btn-primary text-lg px-8 py-3">
                  Browse Jobs
                </Link>
                <Link href="/post-job" className="btn bg-white border border-border hover:bg-gray-50 text-forest text-lg px-8 py-3">
                  Post a Job
                </Link>
              </div>
              <p className="text-sm text-forest-light mt-8">
                Growing opportunities together. 🌾
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
