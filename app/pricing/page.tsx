import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Check, HelpCircle } from "lucide-react";
import { PRICING } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing | Post Farm, Garden & Ranch Jobs | PlayInDirtJobs",
  description: "Affordable pricing for posting agricultural jobs. Connect with qualified farm hands, gardeners, and ranch workers. $5 for basic listings, $15 for featured placement. 60-day visibility guaranteed.",
  keywords: [
    "farm job posting cost",
    "agricultural job board pricing",
    "post farm jobs",
    "ranch job listing price",
    "agriculture recruitment cost",
    "farming job board rates",
  ],
  openGraph: {
    title: "Pricing | Post Agricultural Jobs | PlayInDirtJobs",
    description: "Simple, transparent pricing for agricultural job postings. Find qualified workers for your farm, garden, or ranch starting at $5.",
    url: "https://playindirtjobs.com/pricing",
  },
  alternates: {
    canonical: "https://playindirtjobs.com/pricing",
  },
};

export default function PricingPage() {
  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "PlayInDirtJobs Job Posting",
    "description": "Post agricultural job listings on PlayInDirtJobs",
    "offers": [
      {
        "@type": "Offer",
        "name": "Basic Listing",
        "price": (PRICING.BASIC / 100).toFixed(2),
        "priceCurrency": "USD",
        "description": "60-day job listing with standard visibility"
      },
      {
        "@type": "Offer",
        "name": "Featured Listing",
        "price": (PRICING.FEATURED / 100).toFixed(2),
        "priceCurrency": "USD",
        "description": "60-day featured job listing with enhanced visibility"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />

      <main className="min-h-screen bg-earth-cream">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-earth-sand border-b border-border py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Pricing" }
              ]} />

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-forest mb-6 mt-6">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl md:text-2xl text-forest-light leading-relaxed">
                Reach thousands of qualified agricultural workers with 60-day job listings. No hidden fees, no subscriptions—just results.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Basic Plan */}
              <div className="card p-8 flex flex-col">
                <div className="mb-6">
                  <h2 className="text-2xl font-display text-forest mb-2">Basic Listing</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-primary">$5</span>
                    <span className="text-forest-light">/ 60 days</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-forest-light">60-day active listing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-forest-light">Standard visibility in search results</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-forest-light">Email support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-forest-light">Applicant tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-forest-light">Job management via magic link</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-forest-light">Edit listing anytime</span>
                  </li>
                </ul>

                <Link href="/post-job" className="btn btn-primary justify-center w-full">
                  Get Started
                </Link>
              </div>

              {/* Featured Plan */}
              <div className="card p-8 flex flex-col border-2 border-primary relative overflow-hidden lg:scale-105">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-light to-accent-yellow" />
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 mt-1">
                  <span className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    Most Popular
                  </span>
                </div>

                <div className="mb-6">
                  <h2 className="text-2xl font-display text-forest mb-2">Featured Listing</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-primary">$15</span>
                    <span className="text-forest-light">/ 60 days</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-forest-light">Everything in Basic, plus:</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-forest-light"><strong>Featured badge</strong> & highlighted listing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-forest-light"><strong>Top placement</strong> in search results</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-forest-light"><strong>2x more visibility</strong> to job seekers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-forest-light">Priority email support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-forest-light">Increased application rates</span>
                  </li>
                </ul>

                <Link href="/post-job" className="btn btn-primary justify-center w-full">
                  Get Started
                </Link>
              </div>
            </div>

            <p className="text-center text-forest-light mt-8">
              All plans include a full 60 days of visibility and easy job management. No recurring charges.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white border-y border-border py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display text-forest mb-10 text-center">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <div className="card p-6">
                  <div className="flex gap-4">
                    <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-display text-forest mb-2">
                        How long do job postings stay active?
                      </h3>
                      <p className="text-forest-light leading-relaxed">
                        All job postings remain active for 60 days from the date of posting. This gives you two full months to find the perfect candidate for your agricultural position. Your listing will automatically expire after 60 days, with no recurring charges.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex gap-4">
                    <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-display text-forest mb-2">
                        Can I edit my job posting after it&apos;s published?
                      </h3>
                      <p className="text-forest-light leading-relaxed">
                        Yes! After your payment is processed, you&apos;ll receive a magic link via email that allows you to manage your job posting. You can edit the job details, update the description, or deactivate the listing at any time during the 60-day period.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex gap-4">
                    <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-display text-forest mb-2">
                        What payment methods do you accept?
                      </h3>
                      <p className="text-forest-light leading-relaxed">
                        We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure payment processor, Stripe. All transactions are encrypted and secure. Payment is required before your job listing goes live.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex gap-4">
                    <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-display text-forest mb-2">
                        Do you offer refunds?
                      </h3>
                      <p className="text-forest-light leading-relaxed">
                        We do not offer refunds at this time. All sales are final once your job posting is published and payment is processed. Please review your listing carefully before submitting payment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex gap-4">
                    <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-display text-forest mb-2">
                        How do applicants contact me about the position?
                      </h3>
                      <p className="text-forest-light leading-relaxed">
                        When creating your job posting, you&apos;ll provide either an application email address or an application URL where candidates can apply. Job seekers will contact you directly through the method you specify. We don&apos;t act as an intermediary—you maintain full control over your hiring process.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex gap-4">
                    <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-display text-forest mb-2">
                        What&apos;s the difference between Basic and Featured listings?
                      </h3>
                      <p className="text-forest-light leading-relaxed">
                        Featured listings receive premium placement at the top of search results and category pages, include a distinctive featured badge, and receive approximately 2x more visibility than basic listings. If you&apos;re looking to fill a position quickly or attract top-tier candidates, Featured is the best option. Basic listings still receive excellent visibility and are perfect for budget-conscious employers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO-Rich Content */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display text-forest mb-6">
              Invest in Quality Agricultural Recruitment
            </h2>
            <div className="prose prose-lg max-w-none text-forest-light space-y-6">
              <p>
                Finding the right employees for your farm, garden, nursery, or ranch is one of the most important investments you can make. Quality workers who understand sustainable agriculture, care about the land, and share your values are essential to your operation&apos;s success. PlayInDirtJobs offers affordable, effective job posting solutions designed specifically for the agricultural community.
              </p>
              <p>
                Unlike general job boards that charge hundreds of dollars for 30-day listings, PlayInDirtJobs provides 60-day postings starting at just $5. Our platform is built exclusively for agricultural employers, which means every job seeker browsing our site is specifically interested in farming, gardening, ranching, and sustainable agriculture careers. You&apos;re not competing with retail jobs or tech positions—your listing reaches a focused audience of passionate agricultural workers.
              </p>
              <p>
                Whether you&apos;re a small organic farm seeking seasonal harvest workers, a permaculture operation looking for long-term apprentices, a livestock ranch hiring experienced ranch hands, or a nursery needing skilled horticulturists, our pricing structure makes professional recruitment accessible. The Featured listing option at $15 is particularly valuable for positions that are difficult to fill or require specialized skills, offering enhanced visibility and placement that can significantly reduce your time-to-hire.
              </p>
              <p>
                Every dollar invested in effective job postings saves time and resources in the long run. Poor hiring decisions, extended vacancy periods, and high turnover all cost far more than a quality job listing. PlayInDirtJobs helps you connect with candidates who are genuinely committed to agricultural work, reducing turnover and building stronger farm teams. Our 60-day listing period gives you ample time to review applications, conduct interviews, and find the perfect fit for your operation.
              </p>
              <p>
                We understand that agricultural operations work on tight margins, which is why our pricing is straightforward and affordable. There are no hidden fees, no subscription requirements, and no automatic renewals. You pay once and receive 60 full days of visibility to thousands of qualified job seekers across America. Join hundreds of farms, ranches, and agricultural businesses that have successfully filled positions through PlayInDirtJobs.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="card p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent-yellow/5">
              <h2 className="text-3xl md:text-4xl font-display text-forest mb-4">
                Ready to Find Your Next Team Member?
              </h2>
              <p className="text-xl text-forest-light mb-8">
                Post your job today and connect with passionate agricultural workers across America.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/post-job" className="btn btn-primary text-lg px-8 py-3">
                  Post a Job
                </Link>
                <Link href="/" className="btn bg-white border border-border hover:bg-gray-50 text-forest text-lg px-8 py-3">
                  Browse Jobs
                </Link>
              </div>
              <p className="text-sm text-forest-light mt-8">
                Questions? Contact us at info@playindirtjobs.com
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
