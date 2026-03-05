import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmailSubscribe } from "@/components/EmailSubscribe";
import { ArticleCard } from "@/components/ArticleCard";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { getUrl } from "@/lib/metadata";
import {
  almanacArticles,
  getAlmanacArticle,
} from "@/lib/almanac-content";

export function generateStaticParams() {
  return almanacArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getAlmanacArticle(slug);
  if (!article) return {};

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: getUrl(`almanac/${article.slug}`),
      siteName: "PlayInDirtJobs",
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      images: article.heroImage
        ? [
            {
              url: article.heroImage.src,
              width: 1200,
              height: 630,
              alt: article.heroImage.alt,
            },
          ]
        : [
            {
              url: "/images/PlayInDirtX.png",
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
      images: article.heroImage
        ? [article.heroImage.src]
        : ["/images/PlayInDirtX.png"],
    },
    alternates: {
      canonical: getUrl(`almanac/${article.slug}`),
    },
  };
}

export default async function AlmanacArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getAlmanacArticle(slug);
  if (!article) notFound();

  const formattedDate = new Date(article.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const relatedArticles = (article.relatedSlugs ?? [])
    .map((slug) => getAlmanacArticle(slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof getAlmanacArticle>>[];

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "PlayInDirtJobs",
      url: getUrl(),
    },
    url: getUrl(`almanac/${article.slug}`),
    ...(article.heroImage && {
      image: article.heroImage.src,
    }),
  };

  return (
    <main className="min-h-screen bg-earth-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-earth-sand border-b border-border py-10 sm:py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "The Almanac", href: "/almanac" },
                { label: article.title },
              ]}
            />

            <div className="mt-6">
              <span className="inline-flex items-center px-2.5 py-0.5 bg-primary/5 text-primary text-xs font-semibold rounded-full mb-4">
                {article.category}
              </span>

              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-forest mb-4">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-forest-light">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {article.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {article.readTime} min read
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      {article.heroImage && (
        <div className="container mx-auto px-4 -mt-1">
          <div className="max-w-3xl mx-auto">
            <div className="aspect-[2/1] rounded-lg overflow-hidden bg-gray-100 mt-8">
              <img
                src={article.heroImage.src}
                alt={article.heroImage.alt}
                className="w-full h-full object-cover"
              />
            </div>
            {article.heroImage.credit && (
              <p className="text-xs text-forest-light mt-2">
                Photo by{" "}
                {article.heroImage.creditUrl ? (
                  <a
                    href={article.heroImage.creditUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    {article.heroImage.credit}
                  </a>
                ) : (
                  article.heroImage.credit
                )}{" "}
                / Unsplash
              </p>
            )}
          </div>
        </div>
      )}

      {/* Content + Sidebar */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Article Body */}
          <article
            className="prose prose-lg max-w-3xl text-forest-light prose-headings:font-display prose-headings:text-forest prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-forest prose-li:marker:text-primary/50"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 space-y-6">
            <div className="lg:sticky lg:top-28">
              <EmailSubscribe />

              {relatedArticles.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-display text-lg text-forest mb-4">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/almanac/${related.slug}`}
                        className="block card p-4 hover:shadow-soft-lg hover:border-gray-300 transition-all group"
                      >
                        <h4 className="font-display text-sm text-forest group-hover:text-primary transition-colors mb-1">
                          {related.title}
                        </h4>
                        <p className="text-xs text-forest-light line-clamp-2">
                          {related.excerpt}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Related Articles Grid (bottom) */}
      {relatedArticles.length > 0 && (
        <section className="bg-white border-t border-border py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-2xl text-forest mb-6">
                More from The Almanac
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedArticles.map((related) => (
                  <ArticleCard key={related.slug} article={related} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 text-center bg-white">
            <h2 className="font-display text-2xl text-forest mb-3">
              Ready to start your farm career?
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
