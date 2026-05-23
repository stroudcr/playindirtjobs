import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview Job Posting | PlayInDirtJobs",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PostJobPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
