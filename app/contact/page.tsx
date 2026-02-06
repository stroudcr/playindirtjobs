import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Mail, MessageSquare } from "lucide-react";
import { getUrl } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Contact Us | PlayInDirtJobs",
  description: "Get in touch with PlayInDirtJobs. We're here to help with questions about posting jobs or finding agricultural work opportunities.",
  alternates: {
    canonical: getUrl("contact"),
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-earth-cream">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-earth-cream to-accent-yellow/10 border-b border-border py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Breadcrumbs items={[
              { label: "Home", href: "/" },
              { label: "Contact" }
            ]} />

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-forest mb-6 mt-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-forest-light leading-relaxed">
              We&apos;re here to help connect you with agricultural opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="card p-8 md:p-12 bg-white text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-3xl font-bold text-forest mb-4">
              Reach Us At
            </h2>

            <a
              href="mailto:info@playindirtjobs.com"
              className="text-2xl md:text-3xl text-primary hover:text-primary-dark transition-colors font-semibold inline-block mb-8"
            >
              info@playindirtjobs.com
            </a>

            <div className="border-t border-border pt-8 mt-8">
              <p className="text-lg text-forest-light leading-relaxed">
                Whether you&apos;re looking to post a job, have questions about our platform, or need assistance finding agricultural work, we&apos;re here to help. We typically respond within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-forest mb-6 text-center">
            Quick Links
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Job Seekers */}
            <div className="card p-6 bg-white hover:shadow-lg transition-shadow">
              <MessageSquare className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-xl font-bold text-forest mb-2">
                For Job Seekers
              </h3>
              <p className="text-forest-light mb-4">
                Browse available positions and find your next agricultural opportunity.
              </p>
              <Link href="/" className="text-primary hover:text-primary-dark font-semibold">
                Browse Jobs →
              </Link>
            </div>

            {/* Employers */}
            <div className="card p-6 bg-white hover:shadow-lg transition-shadow">
              <MessageSquare className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-xl font-bold text-forest mb-2">
                For Employers
              </h3>
              <p className="text-forest-light mb-4">
                Post your agricultural job openings and find dedicated workers.
              </p>
              <Link href="/post-job" className="text-primary hover:text-primary-dark font-semibold">
                Post a Job →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="bg-white border-t border-border py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-forest mb-6">
              Additional Resources
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/about" className="text-primary hover:text-primary-dark font-semibold">
                About Us
              </Link>
              <span className="text-border">•</span>
              <Link href="/faq" className="text-primary hover:text-primary-dark font-semibold">
                FAQ
              </Link>
              <span className="text-border">•</span>
              <Link href="/privacy" className="text-primary hover:text-primary-dark font-semibold">
                Privacy Policy
              </Link>
              <span className="text-border">•</span>
              <Link href="/terms" className="text-primary hover:text-primary-dark font-semibold">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
