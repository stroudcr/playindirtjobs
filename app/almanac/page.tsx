import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/ArticleCard";
import { ArrowRight } from "lucide-react";
import { getUrl } from "@/lib/metadata";
import {
  almanacArticles,
  getFeaturedArticles,
  getAlmanacCategories,
} from "@/lib/almanac-content";

export const metadata: Metadata = {
  title: "The Almanac — Guides & Insights for Farm Workers | PlayInDirtJobs",
  description:
    "Essential guides, career advice, and industry insights for agricultural workers and employers. Your trusted resource for navigating farming careers.",
  openGraph: {
    title: "The Almanac — Guides & Insights for Farm Workers | PlayInDirtJobs",
    description:
      "Essential guides, career advice, and industry insights for agricultural workers and employers.",
    url: getUrl("almanac"),
    siteName: "PlayInDirtJobs",
    type: "website",
    images: [
      {
        url: "/images/PlayInDirtX.png",
        width: 1200,
        height: 630,
        alt: "The Almanac — PlayInDirtJobs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Almanac — Guides & Insights for Farm Workers | PlayInDirtJobs",
    description:
      "Essential guides, career advice, and industry insights for agricultural workers and employers.",
    images: ["/images/PlayInDirtX.png"],
  },
  alternates: {
    canonical: getUrl("almanac"),
  },
};

export default function AlmanacPage() {
  const featured = getFeaturedArticles();
  const featuredArticle = featured[0];
  const categories = getAlmanacCategories();
  const otherArticles = almanacArticles.filter(
    (a) => a.slug !== featuredArticle?.slug
  );

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "The Almanac",
    description:
      "Essential guides, career advice, and industry insights for agricultural workers and employers.",
    url: getUrl("almanac"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: almanacArticles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: getUrl(`almanac/${article.slug}`),
        name: article.title,
      })),
    },
  };

  const featuredDate = featuredArticle
    ? new Date(featuredArticle.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <main className="min-h-screen bg-earth-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-earth-sand border-b border-border py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "The Almanac" }]}
            />
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-forest mb-4 mt-6">
              The Almanac
            </h1>
            <p className="text-lg md:text-xl text-forest-light max-w-2xl">
              Essential guides, insights, and career resources for agricultural
              workers and employers.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Link
              href={`/almanac/${featuredArticle.slug}`}
              className="card group block overflow-hidden hover:shadow-soft-lg hover:border-gray-300 transition-all"
            >
              {featuredArticle.heroImage && (
                <div className="aspect-[2/1] overflow-hidden bg-gray-100">
                  <img
                    src={featuredArticle.heroImage.src}
                    alt={featuredArticle.heroImage.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Featured
                  </span>
                  <span className="text-xs text-forest-light">
                    {featuredDate}
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl text-forest mb-3 group-hover:text-primary transition-colors">
                  {featuredArticle.title}
                </h2>
                <p className="text-forest-light mb-4">
                  {featuredArticle.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-primary font-semibold text-sm">
                  Read article
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Category Pills */}
      <section className="container mx-auto px-4 pb-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-3 py-1.5 bg-white border border-border rounded-full text-sm font-medium text-forest"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-forest mb-6">
            All Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-6 animate-stagger">
            {otherArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 text-center bg-white">
            <h2 className="font-display text-2xl text-forest mb-3">
              Looking for farm work?
            </h2>
            <p className="text-forest-light mb-6">
              Browse hundreds of farming, gardening, and ranching jobs across
              America.
            </p>
            <Link href="/" className="btn btn-primary">
              Browse Jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
