import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | PlayInDirtJobs",
  description: "Common questions about posting farm jobs, finding agriculture careers, pricing, and using PlayInDirtJobs job board.",
  alternates: { canonical: "https://playindirtjobs.com/faq" },
};

const faqs = [
  {
    question: "How do I post a job on PlayInDirtJobs?",
    answer: "Click the 'Post a Job' button in the top navigation, fill out your job details, select a plan (Basic or Featured), and complete checkout. Your job will be live immediately after payment."
  },
  {
    question: "How long do job postings stay active?",
    answer: "All job postings remain active for 30 days from the date of posting. You can edit or remove your posting at any time during this period."
  },
  {
    question: "What's the difference between Basic and Featured job postings?",
    answer: "Basic jobs ($5) appear in standard listings. Featured jobs ($15) are highlighted with a special badge, appear at the top of search results, and get significantly more visibility to job seekers."
  },
  {
    question: "Can I edit my job posting after it's published?",
    answer: "Yes, contact us with your job posting details and we&apos;ll help you make updates. We recommend ensuring all information is accurate before publishing."
  },
  {
    question: "What types of jobs can I post?",
    answer: "We accept all agriculture-related positions including farm workers, ranch hands, gardeners, farm managers, apprenticeships, livestock care, organic farming, permaculture, nursery work, and more."
  },
  {
    question: "Is there a refund policy?",
    answer: "Due to the immediate publication of job postings, we do not offer refunds. Please review your posting carefully before completing checkout."
  },
  {
    question: "How do applicants contact me about jobs?",
    answer: "Job seekers apply using the email address or application URL you provide in your job posting. All applications go directly to you."
  },
  {
    question: "Can I post multiple jobs?",
    answer: "Yes! There's no limit to the number of jobs you can post. Each posting requires a separate payment."
  },
  {
    question: "Do you offer discounts for multiple job postings?",
    answer: "Currently we offer individual pricing per job posting. Contact us if you regularly post multiple positions to discuss custom solutions."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards and debit cards through our secure Stripe payment processor."
  },
  {
    question: "Are jobs visible nationwide?",
    answer: "Yes, all job postings are visible to job seekers across the United States. You specify the location, and seekers can filter by location."
  },
  {
    question: "Can I post remote agriculture jobs?",
    answer: "Absolutely! Select 'Remote' as the job type when creating your posting. Remote positions in agriculture consulting, sales, marketing, and management are welcome."
  }
];

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <main className="min-h-screen bg-earth-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="bg-gradient-to-br from-primary/10 via-earth-cream to-secondary/10 border-b border-border py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "FAQ" }
          ]} />
          <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-forest-light">Everything you need to know about posting jobs and finding agriculture careers on PlayInDirtJobs.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg border border-border p-6 shadow-sm">
              <h2 className="text-xl font-bold text-forest mb-3">{faq.question}</h2>
              <p className="text-forest-light leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-primary/10 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-forest mb-4">Still have questions?</h2>
          <p className="text-forest-light mb-6">Contact us and we&apos;ll be happy to help.</p>
          <a href="mailto:info@playindirtjobs.com" className="btn btn-primary">
            Contact Support
          </a>
        </div>
      </section>
    </main>
  );
}
