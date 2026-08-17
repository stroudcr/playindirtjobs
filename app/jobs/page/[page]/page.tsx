import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Home from "@/app/page";
import { getUrl } from "@/lib/metadata";
import { normalizePublicJobsPage } from "@/lib/job-pagination";

export const dynamic = "force-dynamic";

interface PaginatedJobsPageProps {
  params: Promise<{ page: string }>;
}

export async function generateMetadata({ params }: PaginatedJobsPageProps): Promise<Metadata> {
  const rawPage = (await params).page;
  const page = normalizePublicJobsPage(rawPage);

  if (page < 2 || String(page) !== rawPage) {
    return { robots: { index: false, follow: true } };
  }

  return {
    title: `Farm, Ranch & Gardening Jobs – Page ${page}`,
    description: `Browse page ${page} of active farming, ranch, greenhouse, nursery, and gardening jobs across the United States.`,
    alternates: { canonical: getUrl(`jobs/page/${page}`) },
  };
}

export default async function PaginatedJobsPage({ params }: PaginatedJobsPageProps) {
  const rawPage = (await params).page;
  const page = normalizePublicJobsPage(rawPage);

  if (page < 2 || String(page) !== rawPage) notFound();

  return Home({ searchParams: Promise.resolve({ page: String(page) }) });
}
