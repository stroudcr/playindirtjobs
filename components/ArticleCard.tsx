import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import type { AlmanacArticle } from "@/lib/almanac-content";

interface ArticleCardProps {
  article: AlmanacArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = new Date(article.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/almanac/${article.slug}`}
      className="card group p-6 hover:shadow-soft-lg hover:border-gray-300 transition-all"
    >
      {article.heroImage && (
        <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4 bg-gray-100">
          <img
            src={article.heroImage.src}
            alt={article.heroImage.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center px-2.5 py-0.5 bg-primary/5 text-primary text-xs font-semibold rounded-full">
          {article.category}
        </span>
        {article.featured && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            Featured
          </span>
        )}
      </div>

      <h3 className="font-display text-lg text-forest mb-2 group-hover:text-primary transition-colors">
        {article.title}
      </h3>

      <p className="text-sm text-forest-light mb-4 line-clamp-2">
        {article.excerpt}
      </p>

      <div className="flex items-center gap-4 text-xs text-forest-light">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {article.readTime} min read
        </span>
      </div>
    </Link>
  );
}
