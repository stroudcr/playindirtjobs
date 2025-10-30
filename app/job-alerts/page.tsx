import { Metadata } from "next";
import { getUrl } from "@/lib/metadata";
import { JOB_CATEGORIES } from "@/lib/constants";
import Breadcrumbs from "@/components/Breadcrumbs";
import JobAlertsForm from "@/components/JobAlertsForm";
import { Bell, Mail, Zap, Shield, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Get Sustainable Agriculture Job Alerts | PlayInDirtJobs",
  description:
    "Never miss your dream farming, gardening, or ranching job. Subscribe to free job alerts and get instant notifications for sustainable agriculture opportunities matching your interests.",
  keywords: [
    "farming job alerts",
    "agriculture job notifications",
    "sustainable farming jobs email",
    "organic farming job alerts",
    "permaculture job notifications",
    "gardening job alerts",
    "ranch job alerts",
    "regenerative agriculture jobs",
    "farm job newsletter",
    "sustainable agriculture careers",
  ],
  openGraph: {
    title: "Get Sustainable Agriculture Job Alerts | PlayInDirtJobs",
    description:
      "Subscribe to free job alerts for sustainable farming, gardening, and ranching opportunities. Get notified instantly when new positions are posted.",
    url: getUrl("/job-alerts"),
  },
  alternates: {
    canonical: getUrl("/job-alerts"),
  },
};

export default function JobAlertsPage() {
  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Job Alerts - Sustainable Agriculture Jobs",
            description:
              "Subscribe to job alerts for sustainable agriculture, farming, gardening, and ranching opportunities.",
            url: getUrl("/job-alerts"),
            isPartOf: {
              "@type": "WebSite",
              name: "PlayInDirtJobs",
              url: getUrl("/"),
            },
            mainEntity: {
              "@type": "Service",
              name: "Job Alert Subscription Service",
              description:
                "Free email notifications for sustainable agriculture job postings",
              provider: {
                "@type": "Organization",
                name: "PlayInDirtJobs",
              },
              serviceType: "Job Alert Service",
              areaServed: "Worldwide",
            },
          }),
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-earth-cream to-accent-yellow/10 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Breadcrumbs />
          <div className="max-w-4xl mx-auto text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full mb-6 shadow-sm">
              <Bell className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-forest">
                100% Free · No Spam · Unsubscribe Anytime
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-forest mb-6">
              Never Miss Your Dream{" "}
              <span className="text-primary">Sustainable Agriculture</span> Job
            </h1>
            <p className="text-xl md:text-2xl text-forest-light mb-8 leading-relaxed">
              Get instant email alerts for farming, gardening, and ranching
              opportunities that match your interests. Join hundreds of
              passionate agricultural professionals finding their next role.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-forest-light mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Fresh jobs daily</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Filter by category</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>One-click unsubscribe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Subscription Form */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <JobAlertsForm />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-earth-cream to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-forest text-center mb-12">
            Why Subscribe to Job Alerts?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-forest mb-3">
                Be First in Line
              </h3>
              <p className="text-forest-light">
                Get notified within minutes of new job postings. Apply early
                and stand out from the crowd before positions fill up.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-forest mb-3">
                Curated Opportunities
              </h3>
              <p className="text-forest-light">
                Choose specific categories or get alerts for all sustainable
                agriculture jobs. Only relevant positions, no noise.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-forest mb-3">
                Your Privacy Matters
              </h3>
              <p className="text-forest-light">
                We never share your email. Unsubscribe with one click anytime.
                No spam, just quality job opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-forest text-center mb-12">
            How Job Alerts Work
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-bold text-forest mb-2">
                  Subscribe
                </h3>
                <p className="text-forest-light">
                  Enter your email and optionally select job categories you're
                  interested in.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-bold text-forest mb-2">
                  Get Notified
                </h3>
                <p className="text-forest-light">
                  Receive instant email alerts when new jobs matching your
                  preferences are posted.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-bold text-forest mb-2">
                  Apply & Land Your Dream Job
                </h3>
                <p className="text-forest-light">
                  Click through to view full details and apply directly to
                  opportunities that excite you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 to-earth-cream">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-forest text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="card">
              <h3 className="text-lg font-bold text-forest mb-2">
                How often will I receive job alerts?
              </h3>
              <p className="text-forest-light">
                You&apos;ll receive an email whenever a new job is posted that
                matches your selected categories. This could be daily, several
                times a week, or less frequently depending on posting activity.
                We bundle alerts to avoid inbox overload while keeping you
                informed.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-forest mb-2">
                Can I choose which types of jobs I want to hear about?
              </h3>
              <p className="text-forest-light">
                Absolutely! When subscribing, you can select specific categories
                like Organic Farming, Permaculture, Gardening, Ranch Hand, and
                more. Or choose &quot;All Categories&quot; to never miss an opportunity.
                You can update your preferences anytime.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-forest mb-2">
                Is this service really free?
              </h3>
              <p className="text-forest-light">
                Yes! Job alerts are 100% free for job seekers. We make money by
                charging employers to post jobs, so we can provide this service
                to you at no cost. No hidden fees, no credit card required.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-forest mb-2">
                How do I unsubscribe?
              </h3>
              <p className="text-forest-light">
                Every email we send includes a one-click unsubscribe link at the
                bottom. You can opt out anytime, no questions asked. We respect
                your inbox and your time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary-dark to-forest text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="text-xl mb-8 text-primary-light max-w-2xl mx-auto">
            Join our community of sustainable agriculture professionals and
            never miss a great job posting again.
          </p>
          <a
            href="#subscribe-form"
            className="btn bg-white text-primary hover:bg-earth-cream transition-colors inline-flex items-center gap-2 text-lg px-8 py-3"
          >
            <Bell className="w-5 h-5" />
            Subscribe to Job Alerts
          </a>
        </div>
      </section>
    </>
  );
}
