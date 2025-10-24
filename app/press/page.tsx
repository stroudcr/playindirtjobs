import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Download, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Press & Media | PlayInDirtJobs",
  description: "Press resources, media kit, and contact information for PlayInDirtJobs. Download our logo, brand assets, and learn about our mission to connect America's agricultural community.",
  keywords: [
    "playindirtjobs press",
    "agricultural job board media",
    "farm jobs press release",
    "sustainable agriculture news",
    "farming careers media",
  ],
  openGraph: {
    title: "Press & Media | PlayInDirtJobs",
    description: "Press resources and media kit for PlayInDirtJobs, America's premier agricultural job board.",
    url: "https://playindirtjobs.com/press",
  },
  alternates: {
    canonical: "https://playindirtjobs.com/press",
  },
};

export default function PressPage() {
  return (
    <main className="min-h-screen bg-earth-cream">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-earth-cream to-accent-yellow/10 border-b border-border py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Breadcrumbs items={[
              { label: "Home", href: "/" },
              { label: "Press" }
            ]} />

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-forest mb-6 mt-6">
              Press & Media
            </h1>
            <p className="text-xl md:text-2xl text-forest-light leading-relaxed">
              Resources for journalists, media outlets, and content creators covering PlayInDirtJobs and the sustainable agriculture employment landscape.
            </p>
          </div>
        </div>
      </section>

      {/* About PlayInDirtJobs */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:p-12 bg-white">
            <h2 className="text-3xl md:text-4xl font-bold text-forest mb-6">
              About PlayInDirtJobs
            </h2>
            <div className="prose prose-lg max-w-none text-forest-light space-y-4">
              <p>
                PlayInDirtJobs is America&apos;s leading job board connecting passionate workers with sustainable farming, gardening, and ranching opportunities. We bridge the gap between dedicated agricultural professionals and the farms that need them.
              </p>
              <p>
                Founded to honor the historical prominence of agriculture in American life, PlayInDirtJobs serves as the essential platform for organic farms, permaculture gardens, regenerative ranches, and sustainable agriculture operations seeking skilled team members.
              </p>
              <p>
                Our platform features opportunities across all agricultural sectors—from farm hand positions and ranch work to specialized roles in greenhouse management, vineyard operations, and agricultural technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Facts */}
      <section className="bg-white border-y border-border py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-forest mb-8">
              Key Facts
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-xl font-bold text-forest mb-3">Mission</h3>
                <p className="text-forest-light">
                  Strengthen American agriculture by connecting dedicated workers with meaningful farming, gardening, and ranching careers.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-bold text-forest mb-3">Founded</h3>
                <p className="text-forest-light">
                  2025
                </p>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-bold text-forest mb-3">Focus</h3>
                <p className="text-forest-light">
                  Sustainable agriculture, organic farming, permaculture, regenerative ranching, and eco-conscious agricultural operations.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-bold text-forest mb-3">Coverage</h3>
                <p className="text-forest-light">
                  Nationwide agricultural job opportunities across all 50 states.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-forest mb-8">
            Brand Assets
          </h2>
          <div className="card p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-forest mb-2">Logo & Media Kit</h3>
                <p className="text-forest-light mb-4">
                  Download our logos, brand guidelines, and visual assets for use in articles, presentations, and media coverage.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/images/PlayInDirtLogo.PNG"
                    download
                    className="btn btn-primary text-sm"
                  >
                    Download Logo (PNG)
                  </a>
                  <a
                    href="/images/PlayInDirtWord.PNG"
                    download
                    className="btn bg-white border border-border hover:bg-gray-50 text-forest text-sm"
                  >
                    Download Wordmark (PNG)
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-6">
              <h4 className="font-semibold text-forest mb-2">Usage Guidelines</h4>
              <ul className="text-sm text-forest-light space-y-2">
                <li>• Please maintain adequate spacing around the logo</li>
                <li>• Do not alter the logo colors or proportions</li>
                <li>• Use our official brand colors: Primary Green (#10b981)</li>
                <li>• For questions about brand usage, contact our media team</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-forest mb-8">
            Media Contact
          </h2>
          <div className="card p-8 bg-gradient-to-br from-primary/5 to-accent-yellow/5">
            <div className="flex items-start gap-4 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-forest mb-2">
                  For Media Inquiries
                </h3>
                <p className="text-forest-light mb-4">
                  For interviews, press releases, partnership opportunities, or general media questions, please contact:
                </p>
                <a
                  href="mailto:info@playindirtjobs.com"
                  className="text-primary hover:text-primary-dark font-semibold text-lg"
                >
                  info@playindirtjobs.com
                </a>
                <p className="text-sm text-forest-light mt-4">
                  We typically respond to media inquiries within 24-48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Ideas */}
      <section className="bg-white border-t border-border py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-forest mb-8">
              Story Ideas
            </h2>
            <p className="text-forest-light mb-6">
              We&apos;re happy to provide expert commentary and insights on topics including:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <span className="text-forest-light">Trends in sustainable agriculture employment</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <span className="text-forest-light">The future of organic farming careers</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <span className="text-forest-light">Farm apprenticeships and agricultural education</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <span className="text-forest-light">Regenerative agriculture workforce development</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <span className="text-forest-light">Rural employment and farm labor challenges</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <span className="text-forest-light">Benefits and compensation in agricultural work</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-8 md:p-12 bg-white">
            <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4">
              Learn More About PlayInDirtJobs
            </h2>
            <p className="text-xl text-forest-light mb-8">
              Explore our platform to see how we&apos;re connecting America&apos;s agricultural community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about" className="btn btn-primary text-lg px-8 py-3">
                About Us
              </Link>
              <Link href="/contact" className="btn bg-white border border-border hover:bg-gray-50 text-forest text-lg px-8 py-3">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
