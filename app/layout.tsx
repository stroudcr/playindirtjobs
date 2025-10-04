import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PlayInDirtJobs - Farm, Garden & Ranch Jobs",
  description: "Find farming, gardening, and ranching jobs. Connect with sustainable agriculture opportunities.",
  keywords: ["farming jobs", "agriculture", "gardening jobs", "ranch work", "farm jobs", "sustainable farming"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
