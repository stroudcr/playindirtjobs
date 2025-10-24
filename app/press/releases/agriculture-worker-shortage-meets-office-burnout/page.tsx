import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getPressReleaseBySlug } from "@/lib/press-releases";
import { Calendar, ArrowLeft, Printer, Share2 } from "lucide-react";
import { notFound } from "next/navigation";
import { getUrl } from "@/lib/metadata";

const slug = "agriculture-worker-shortage-meets-office-burnout";

export async function generateMetadata(): Promise<Metadata> {
  const release = getPressReleaseBySlug(slug);

  if (!release) {
    return {
      title: "Press Release Not Found",
    };
  }

  return {
    title: `${release.title} | PlayInDirtJobs Press Release`,
    description: release.excerpt,
    keywords: [
      "playindirtjobs launch",
      "agricultural job board",
      "farm jobs platform",
      "sustainable agriculture employment",
      "office burnout",
      "career change farming",
      "agriculture labor shortage",
    ],
    openGraph: {
      title: release.title,
      description: release.excerpt,
      url: getUrl(`press/releases/${release.slug}`),
      type: "article",
      publishedTime: release.date,
      authors: [release.author],
      images: [
        {
          url: getUrl("images/PlayInDirtX.png"),
          width: 1200,
          height: 630,
          alt: "PlayInDirtJobs",
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: release.title,
      description: release.excerpt,
      images: [getUrl("images/PlayInDirtX.png")],
    },
    alternates: {
      canonical: getUrl(`press/releases/${release.slug}`),
    },
  };
}

export default function PressReleasePage() {
  const release = getPressReleaseBySlug(slug);

  if (!release) {
    notFound();
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Article Schema for Google News
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": release.title,
    "description": release.excerpt,
    "datePublished": release.date,
    "dateModified": release.date,
    "author": {
      "@type": "Person",
      "name": release.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "PlayInDirtJobs",
      "logo": {
        "@type": "ImageObject",
        "url": getUrl("images/PlayInDirtLogo.PNG")
      }
    },
    "url": getUrl(`press/releases/${release.slug}`),
    "image": getUrl("images/PlayInDirtX.png"),
    "articleBody": release.content.replace(/<[^>]*>/g, ''), // Strip HTML for plain text
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="min-h-screen bg-earth-cream">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-earth-cream to-accent-yellow/10 border-b border-border py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Press", href: "/press" },
                { label: "Press Releases", href: "/press/releases" },
                { label: release.title }
              ]} />

              <div className="flex items-center gap-2 text-sm text-forest-light mb-4 mt-6">
                <Calendar className="w-4 h-4" />
                <time dateTime={release.date}>
                  {formatDate(release.date)}
                </time>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-forest mb-4">
                {release.title}
              </h1>

              {release.subtitle && (
                <p className="text-lg md:text-xl text-forest-light font-medium">
                  {release.subtitle}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Press Release Content */}
        <article className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Utilities Bar */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => window.print()}
                className="btn bg-white border border-border hover:bg-gray-50 text-forest text-sm"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: release.title,
                      text: release.excerpt,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="btn bg-white border border-border hover:bg-gray-50 text-forest text-sm"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Press Release Header */}
            <div className="card p-8 md:p-12">
              <div className="text-center mb-8 pb-8 border-b border-border">
                <p className="text-xs font-bold tracking-widest text-forest-light uppercase mb-4">
                  FOR IMMEDIATE RELEASE
                </p>
              </div>

              {/* Press Release Body */}
              <div
                className="prose prose-lg max-w-none text-forest-light
                  prose-headings:text-forest prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-p:mb-4 prose-p:leading-relaxed
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-forest prose-strong:font-semibold"
                dangerouslySetInnerHTML={{ __html: release.content }}
              />

              {/* Contact Information */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-xl font-bold text-forest mb-4">Media Contact:</h3>
                <div className="text-forest-light space-y-1">
                  <p className="font-semibold text-forest">{release.contact.name}</p>
                  <p>{release.contact.title}</p>
                  <p>
                    <a
                      href={`mailto:${release.contact.email}`}
                      className="text-primary hover:underline"
                    >
                      {release.contact.email}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`https://${release.contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {release.contact.website}
                    </a>
                  </p>
                </div>
              </div>

              {/* End Mark */}
              <div className="text-center mt-8 pt-8 border-t border-border">
                <p className="text-2xl font-bold text-forest-light">###</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
              <Link
                href="/press/releases"
                className="btn bg-white border border-border hover:bg-gray-50 text-forest"
              >
                <ArrowLeft className="w-4 h-4" />
                All Press Releases
              </Link>
              <Link
                href="/press"
                className="btn bg-white border border-border hover:bg-gray-50 text-forest"
              >
                Press & Media Home
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
