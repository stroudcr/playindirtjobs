import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Success | PlayInDirtJobs",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
