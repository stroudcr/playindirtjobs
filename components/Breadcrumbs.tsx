import Link from "next/link";
import { getBaseUrl } from "@/lib/metadata";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  variant?: "default" | "light";
}

export function Breadcrumbs({ items, variant = "default" }: BreadcrumbsProps) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href && { "item": `${getBaseUrl()}${item.href}` })
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav className={`mb-6 text-sm ${variant === "light" ? "text-white/70" : "text-forest-light"}`} aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              {item.href ? (
                <Link href={item.href} className={variant === "light" ? "hover:text-white" : "hover:text-primary"}>
                  {item.label}
                </Link>
              ) : (
                <span className={`font-medium ${variant === "light" ? "text-white" : "text-forest"}`}>{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
