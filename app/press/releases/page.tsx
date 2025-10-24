import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pressReleases } from "@/lib/press-releases";
import { Calendar, ArrowRight } from "lucide-react";
import { getUrl } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Press Releases | PlayInDirtJobs",
  description: "Latest news and press releases from PlayInDirtJobs. Stay updated on our mission to connect America's agricultural community with meaningful farming, gardening, and ranching careers.",
  keywords: [
    "playindirtjobs press releases",
    "agricultural job board news",
    "farm jobs announcements",
    "sustainable agriculture news",
    "farming careers press",
  ],
  openGraph: {
    title: "Press Releases | PlayInDirtJobs",
    description: "Latest news and announcements from PlayInDirtJobs, America's premier agricultural job board.",
    url: getUrl("press/releases"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Press Releases | PlayInDirtJobs",
    description: "Latest news and announcements from PlayInDirtJobs.",
  },
  alternates: {
    canonical: getUrl("press/releases"),
  },
};

export default function PressReleasesPage() {
  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <main className="min-h-screen bg-earth-cream">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-earth-cream to-accent-yellow/10 border-b border-border py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Breadcrumbs items={[
              { label: "Home", href: "/" },
              { label: "Press", href: "/press" },
              { label: "Press Releases" }
            ]} />

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-forest mb-6 mt-6">
              Press Releases
            </h1>
            <p className="text-xl md:text-2xl text-forest-light leading-relaxed">
              Latest news and announcements from PlayInDirtJobs.
            </p>
          </div>
        </div>
      </section>

      {/* Press Releases List */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {pressReleases.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-forest-light text-lg">
                No press releases available at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {pressReleases.map((release) => (
                <article key={release.slug} className="card p-6 md:p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 text-sm text-forest-light mb-3">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={release.date}>
                      {formatDate(release.date)}
                    </time>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-forest mb-3">
                    <Link
                      href={`/press/releases/${release.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {release.title}
                    </Link>
                  </h2>

                  {release.subtitle && (
                    <p className="text-lg md:text-xl text-forest-light font-medium mb-4">
                      {release.subtitle}
                    </p>
                  )}

                  <p className="text-forest-light leading-relaxed mb-6">
                    {release.excerpt}
                  </p>

                  <Link
                    href={`/press/releases/${release.slug}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
                  >
                    Read full press release
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Back to Press */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/press"
            className="btn bg-white border border-border hover:bg-gray-50 text-forest"
          >
            Back to Press & Media
          </Link>
        </div>
      </section>
    </main>
  );
}
