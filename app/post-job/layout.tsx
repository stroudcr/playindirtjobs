import type { Metadata } from "next";
import { getUrl } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Post a Farm, Garden or Ranch Job | PlayInDirtJobs",
  description:
    "Post agricultural jobs on PlayInDirtJobs and reach workers looking for farming, gardening, ranching, greenhouse, nursery, and sustainable agriculture roles.",
  openGraph: {
    title: "Post Agricultural Jobs | PlayInDirtJobs",
    description:
      "Reach farm workers, gardeners, ranch hands, and sustainable agriculture candidates with a 60-day job listing.",
    url: getUrl("post-job"),
  },
  alternates: {
    canonical: getUrl("post-job"),
  },
};

export default function PostJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
