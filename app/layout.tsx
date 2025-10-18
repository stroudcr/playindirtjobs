import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { getUrl } from "@/lib/metadata";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Farm Jobs, Gardening Jobs & Ranch Work | PlayInDirtJobs",
  description: "Find farming, gardening, and ranching jobs across America. Browse sustainable agriculture careers, organic farm positions, and ranch hand opportunities.",
  keywords: [
    "farming jobs",
    "farm jobs",
    "gardening jobs",
    "ranch jobs",
    "agricultural jobs",
    "organic farm jobs",
    "farm hand jobs",
    "sustainable agriculture careers",
    "ranch work",
    "farm apprenticeships",
    "permaculture jobs"
  ],
  icons: {
    icon: "/images/PlayInDirtFavicon.ico",
  },
  openGraph: {
    title: "Find Your Dream Farm Job | PlayInDirtJobs",
    description: "Browse farming, gardening, and ranching jobs from sustainable farms across America. Connect with organic farms, permaculture gardens, and regenerative ranches hiring now.",
    url: getUrl(),
    siteName: "PlayInDirtJobs",
    images: [
      {
        url: "/images/PlayInDirtX.png",
        width: 1200,
        height: 630,
        alt: "PlayInDirtJobs - Farm, Garden & Ranch Jobs",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Your Dream Farm Job | PlayInDirtJobs",
    description: "Browse farming, gardening, and ranching jobs from sustainable farms across America.",
    images: ["/images/PlayInDirtX.png"],
  },
  alternates: {
    canonical: getUrl(),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PlayInDirtJobs",
    "url": getUrl(),
    "logo": getUrl("images/PlayInDirtLogo.PNG"),
    "description": "America's leading job board for sustainable agriculture, organic farming, and regenerative ranching careers. Connect farms with passionate workers.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "info@playindirtjobs.com"
    },
    "sameAs": []
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
