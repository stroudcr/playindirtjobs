import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | PlayInDirtJobs",
  description: "Privacy Policy for PlayInDirtJobs - How we collect, use, and protect your personal information in compliance with CCPA, CPRA, and other privacy laws.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-earth-cream py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card p-8 md:p-12">
          <h1 className="text-4xl font-bold text-forest mb-6">Privacy Policy</h1>

          <div className="prose prose-forest max-w-none">
            <p className="text-forest-light mb-6">
              <strong>Effective Date:</strong> January 1, 2025<br />
              <strong>Last Updated:</strong> January 1, 2025
            </p>

            <p className="text-forest-light mb-6">
              WellDiem Company LLC (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates PlayInDirtJobs, a job board platform for agriculture, farming, gardening, and ranching careers. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website and use our services.
            </p>

            {/* Table of Contents */}
            <div className="bg-forest/5 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-forest mb-3">Table of Contents</h3>
              <ol className="space-y-2 text-sm">
                <li><a href="#information-we-collect" className="text-primary hover:underline">1. Information We Collect</a></li>
                <li><a href="#how-we-collect" className="text-primary hover:underline">2. How We Collect Information</a></li>
                <li><a href="#how-we-use" className="text-primary hover:underline">3. How We Use Your Information</a></li>
                <li><a href="#data-retention" className="text-primary hover:underline">4. Data Retention</a></li>
                <li><a href="#sharing" className="text-primary hover:underline">5. How We Share Your Information</a></li>
                <li><a href="#third-party-services" className="text-primary hover:underline">6. Third-Party Services</a></li>
                <li><a href="#cookies" className="text-primary hover:underline">7. Cookies and Tracking Technologies</a></li>
                <li><a href="#california-rights" className="text-primary hover:underline">8. California Privacy Rights (CCPA/CPRA)</a></li>
                <li><a href="#state-rights" className="text-primary hover:underline">9. Other State Privacy Rights</a></li>
                <li><a href="#do-not-sell" className="text-primary hover:underline">10. Do Not Sell or Share My Personal Information</a></li>
                <li><a href="#international" className="text-primary hover:underline">11. International Users</a></li>
                <li><a href="#children" className="text-primary hover:underline">12. Children's Privacy</a></li>
                <li><a href="#security" className="text-primary hover:underline">13. Data Security</a></li>
                <li><a href="#changes" className="text-primary hover:underline">14. Changes to This Privacy Policy</a></li>
                <li><a href="#contact" className="text-primary hover:underline">15. Contact Us</a></li>
              </ol>
            </div>

            <section id="information-we-collect" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">1. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-forest mb-3">A. Personal Information You Provide</h3>
              <p className="text-forest-light mb-4">
                We collect the following categories of personal information that you voluntarily provide:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li><strong>Contact Information:</strong> Email address, company name, contact person name</li>
                <li><strong>Job Posting Information:</strong> Job titles, descriptions, locations, salary ranges, company information, employment terms</li>
                <li><strong>Payment Information:</strong> Credit card information and billing details (processed and stored by Stripe, not by us)</li>
                <li><strong>Communication Data:</strong> Information you provide when contacting us via email or our contact forms</li>
                <li><strong>Subscription Data:</strong> Email addresses for job alert subscriptions</li>
              </ul>

              <h3 className="text-xl font-semibold text-forest mb-3">B. Information Automatically Collected</h3>
              <p className="text-forest-light mb-4">
                When you visit our website, we automatically collect certain information:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong>Usage Data:</strong> Pages viewed, time spent on pages, links clicked, search queries, referral sources</li>
                <li><strong>Location Data:</strong> General geographic location based on IP address</li>
                <li><strong>Cookies and Similar Technologies:</strong> Data collected through cookies and similar tracking technologies (see Section 7)</li>
              </ul>
            </section>

            <section id="how-we-collect" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">2. How We Collect Information</h2>
              <p className="text-forest-light mb-4">
                We collect information through:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li><strong>Direct Interactions:</strong> When you post a job, subscribe to alerts, or contact us</li>
                <li><strong>Automated Technologies:</strong> Through cookies, server logs, and analytics tools</li>
                <li><strong>Third-Party Payment Processors:</strong> Stripe collects payment information on our behalf</li>
                <li><strong>Email Service Providers:</strong> Resend processes email communications</li>
              </ul>
            </section>

            <section id="how-we-use" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">3. How We Use Your Information</h2>
              <p className="text-forest-light mb-4">
                We use your personal information for the following specific purposes:
              </p>

              <h3 className="text-xl font-semibold text-forest mb-3">A. Service Delivery</h3>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li>Publishing and displaying job postings for 60 days</li>
                <li>Sending job posting confirmation emails and management links</li>
                <li>Processing payments through Stripe</li>
                <li>Sending job alert emails to subscribers based on their preferences</li>
                <li>Providing customer support and responding to inquiries</li>
              </ul>

              <h3 className="text-xl font-semibold text-forest mb-3">B. Platform Operations</h3>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li>Maintaining and improving website functionality and user experience</li>
                <li>Analyzing usage patterns to optimize search and filtering features</li>
                <li>Troubleshooting technical issues and preventing fraud</li>
                <li>Ensuring platform security and preventing abuse</li>
              </ul>

              <h3 className="text-xl font-semibold text-forest mb-3">C. Legal Compliance</h3>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li>Complying with legal obligations and regulations</li>
                <li>Enforcing our Terms of Service</li>
                <li>Resolving disputes and preventing illegal activities</li>
                <li>Responding to law enforcement requests when required</li>
              </ul>
            </section>

            <section id="data-retention" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">4. Data Retention</h2>
              <p className="text-forest-light mb-4">
                We retain your personal information for specific timeframes based on the purpose of collection:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li><strong>Job Posting Data:</strong> Active for 60 days, then archived for 2 years for legal compliance and dispute resolution, after which it is deleted</li>
                <li><strong>Payment Records:</strong> Retained for 7 years to comply with tax and financial regulations</li>
                <li><strong>Email Subscription Data:</strong> Retained until you unsubscribe, then deleted within 30 days</li>
                <li><strong>Customer Support Communications:</strong> Retained for 3 years to maintain service quality and handle follow-up inquiries</li>
                <li><strong>Website Analytics Data:</strong> Aggregated data retained for 2 years; individual user data retained for 14 months</li>
                <li><strong>Account Access Links:</strong> Magic links expire after 30 days; associated email addresses retained with job posting data</li>
              </ul>
              <p className="text-forest-light mb-4">
                After these retention periods, we securely delete or anonymize your personal information unless longer retention is required by law.
              </p>
            </section>

            <section id="sharing" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">5. How We Share Your Information</h2>
              <p className="text-forest-light mb-4">
                We share your personal information only in the following limited circumstances:
              </p>

              <h3 className="text-xl font-semibold text-forest mb-3">A. Public Job Listings</h3>
              <p className="text-forest-light mb-4">
                Job posting information (company name, job details, location, salary range) is publicly displayed on our website and visible to all visitors. Email addresses and payment information are never publicly displayed.
              </p>

              <h3 className="text-xl font-semibold text-forest mb-3">B. Service Providers</h3>
              <p className="text-forest-light mb-4">
                We share information with third-party service providers who perform services on our behalf:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li><strong>Stripe:</strong> Payment processing (covered by Stripe's privacy policy)</li>
                <li><strong>Resend:</strong> Email delivery services for confirmations and job alerts</li>
                <li><strong>Hosting Providers:</strong> Website hosting and database management</li>
              </ul>
              <p className="text-forest-light mb-4">
                These service providers are contractually obligated to protect your information and use it only for the purposes we specify.
              </p>

              <h3 className="text-xl font-semibold text-forest mb-3">C. Legal Requirements</h3>
              <p className="text-forest-light mb-4">
                We may disclose your information if required by law, court order, subpoena, or government request, or to protect our rights, property, or safety.
              </p>

              <h3 className="text-xl font-semibold text-forest mb-3">D. Business Transfers</h3>
              <p className="text-forest-light mb-4">
                If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
              </p>

              <h3 className="text-xl font-semibold text-forest mb-3">E. With Your Consent</h3>
              <p className="text-forest-light mb-4">
                We may share your information for other purposes with your explicit consent.
              </p>
            </section>

            <section id="third-party-services" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">6. Third-Party Services</h2>

              <h3 className="text-xl font-semibold text-forest mb-3">Stripe Payment Processing</h3>
              <p className="text-forest-light mb-4">
                We use Stripe to process payments. When you make a payment, your credit card information is collected and processed directly by Stripe. We do not store your complete credit card information on our servers.
              </p>
              <p className="text-forest-light mb-4">
                Stripe's use of your information is governed by their privacy policy: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://stripe.com/privacy</a>
              </p>

              <h3 className="text-xl font-semibold text-forest mb-3">Resend Email Services</h3>
              <p className="text-forest-light mb-4">
                We use Resend to send transactional emails (job posting confirmations, magic links) and marketing emails (job alerts). Your email address and associated data are shared with Resend for this purpose.
              </p>
            </section>

            <section id="cookies" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">7. Cookies and Tracking Technologies</h2>

              <h3 className="text-xl font-semibold text-forest mb-3">What Are Cookies?</h3>
              <p className="text-forest-light mb-4">
                Cookies are small text files stored on your device that help us provide and improve our services.
              </p>

              <h3 className="text-xl font-semibold text-forest mb-3">Types of Cookies We Use</h3>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality (e.g., maintaining your session)</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website and improve performance</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences (e.g., search filters)</li>
              </ul>

              <h3 className="text-xl font-semibold text-forest mb-3">Managing Cookies</h3>
              <p className="text-forest-light mb-4">
                You can control cookies through your browser settings. Most browsers allow you to refuse or delete cookies. However, disabling cookies may affect website functionality.
              </p>
            </section>

            <section id="california-rights" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">8. California Privacy Rights (CCPA/CPRA)</h2>
              <p className="text-forest-light mb-4">
                If you are a California resident, the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA) provide you with specific rights regarding your personal information.
              </p>

              <h3 className="text-xl font-semibold text-forest mb-3">Your California Rights</h3>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li><strong>Right to Know:</strong> Request disclosure of the categories and specific pieces of personal information we collect, use, disclose, and sell</li>
                <li><strong>Right to Delete:</strong> Request deletion of your personal information, subject to certain exceptions</li>
                <li><strong>Right to Correct:</strong> Request correction of inaccurate personal information</li>
                <li><strong>Right to Opt-Out:</strong> Opt out of the sale or sharing of your personal information (Note: We do not sell personal information)</li>
                <li><strong>Right to Limit Use of Sensitive Personal Information:</strong> Limit use of sensitive personal information</li>
                <li><strong>Right to Non-Discrimination:</strong> Exercise your privacy rights without discriminatory treatment</li>
              </ul>

              <h3 className="text-xl font-semibold text-forest mb-3">Categories of Personal Information We Collect</h3>
              <p className="text-forest-light mb-4">
                Under CCPA/CPRA, we collect the following categories:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li><strong>Identifiers:</strong> Email addresses, IP addresses, company names</li>
                <li><strong>Commercial Information:</strong> Payment transaction records, job posting purchases</li>
                <li><strong>Internet Activity:</strong> Browsing history, search history, interaction with our website</li>
                <li><strong>Geolocation Data:</strong> General location derived from IP address</li>
                <li><strong>Professional Information:</strong> Job posting details, employment information</li>
              </ul>

              <h3 className="text-xl font-semibold text-forest mb-3">Do We Sell Personal Information?</h3>
              <p className="text-forest-light mb-4">
                <strong>No.</strong> We do not sell your personal information to third parties for monetary or other valuable consideration. We do not share your personal information for cross-context behavioral advertising.
              </p>

              <h3 className="text-xl font-semibold text-forest mb-3">How to Exercise Your Rights</h3>
              <p className="text-forest-light mb-4">
                To exercise your California privacy rights, please contact us at:
              </p>
              <p className="text-forest-light mb-4">
                <strong>Email:</strong> <a href="mailto:info@playindirtjobs.com" className="text-primary hover:underline">info@playindirtjobs.com</a><br />
                <strong>Subject Line:</strong> &ldquo;CCPA Privacy Request&rdquo;
              </p>
              <p className="text-forest-light mb-4">
                We will verify your identity before processing your request and respond within 45 days. You may designate an authorized agent to make requests on your behalf.
              </p>
            </section>

            <section id="state-rights" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">9. Other State Privacy Rights</h2>
              <p className="text-forest-light mb-4">
                If you reside in Virginia, Colorado, Connecticut, Utah, or other states with comprehensive privacy laws, you may have similar rights to those described in the California section, including rights to access, delete, correct, and opt out of certain data processing activities.
              </p>
              <p className="text-forest-light mb-4">
                To exercise these rights, please contact us using the information in Section 15.
              </p>
            </section>

            <section id="do-not-sell" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">10. Do Not Sell or Share My Personal Information</h2>
              <p className="text-forest-light mb-4">
                We do not sell or share your personal information as defined under California and other state privacy laws. We do not engage in:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li>Selling personal information for monetary compensation</li>
                <li>Sharing personal information for cross-context behavioral advertising</li>
                <li>Processing sensitive personal information beyond what is necessary for our services</li>
              </ul>
              <p className="text-forest-light mb-4">
                If our practices change, we will update this Privacy Policy and provide opt-out mechanisms as required by law.
              </p>
            </section>

            <section id="international" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">11. International Users</h2>
              <p className="text-forest-light mb-4">
                Our services are based in the United States and intended for users within the United States. If you access our website from outside the US, your information will be transferred to, stored, and processed in the United States.
              </p>

              <h3 className="text-xl font-semibold text-forest mb-3">GDPR (European Users)</h3>
              <p className="text-forest-light mb-4">
                If you are located in the European Economic Area (EEA), UK, or Switzerland, you have certain rights under the General Data Protection Regulation (GDPR):
              </p>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li>Right of access to your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure (&ldquo;right to be forgotten&rdquo;)</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Right to withdraw consent</li>
              </ul>
              <p className="text-forest-light mb-4">
                To exercise these rights, please contact us at info@playindirtjobs.com. You also have the right to lodge a complaint with a supervisory authority.
              </p>
            </section>

            <section id="children" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">12. Children's Privacy</h2>
              <p className="text-forest-light mb-4">
                Our services are not directed to individuals under the age of 18, and we do not knowingly collect personal information from children under 13 (or 16 in certain jurisdictions). If you believe we have collected information from a child, please contact us immediately at info@playindirtjobs.com, and we will delete it.
              </p>
            </section>

            <section id="security" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">13. Data Security</h2>
              <p className="text-forest-light mb-4">
                We implement reasonable technical, administrative, and physical security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li><strong>Encryption:</strong> HTTPS encryption for data transmission; encrypted storage for sensitive data</li>
                <li><strong>Payment Security:</strong> PCI-DSS compliant payment processing through Stripe</li>
                <li><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis</li>
                <li><strong>Regular Security Audits:</strong> Periodic review of security practices and vulnerabilities</li>
                <li><strong>Secure Development:</strong> Following security best practices in code and infrastructure</li>
              </ul>
              <p className="text-forest-light mb-4">
                However, no method of transmission or storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section id="changes" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">14. Changes to This Privacy Policy</h2>
              <p className="text-forest-light mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will post the updated policy on this page with a new &ldquo;Last Updated&rdquo; date.
              </p>
              <p className="text-forest-light mb-4">
                For material changes that significantly affect your rights, we will provide additional notice, such as via email to registered users or a prominent notice on our website.
              </p>
              <p className="text-forest-light mb-4">
                We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
              </p>
            </section>

            <section id="contact" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">15. Contact Us</h2>
              <p className="text-forest-light mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-forest/5 rounded-lg p-6">
                <p className="text-forest-light mb-2">
                  <strong>Company:</strong> WellDiem Company LLC
                </p>
                <p className="text-forest-light mb-2">
                  <strong>Email:</strong> <a href="mailto:info@playindirtjobs.com" className="text-primary hover:underline">info@playindirtjobs.com</a>
                </p>
                <p className="text-forest-light mb-4">
                  <strong>Website:</strong> <Link href="/" className="text-primary hover:underline">https://playindirtjobs.com</Link>
                </p>
                <p className="text-forest-light mt-4 text-sm">
                  <strong>For Privacy-Specific Requests:</strong><br />
                  Please include &ldquo;Privacy Request&rdquo; or &ldquo;CCPA Request&rdquo; in your email subject line to ensure prompt processing.
                </p>
              </div>
            </section>

            <div className="border-t border-border pt-8 mt-12">
              <div className="bg-accent-yellow/10 border border-accent-yellow/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-forest mb-2">Your Privacy Matters</h3>
                <p className="text-sm text-forest-light">
                  At PlayInDirtJobs, we are committed to transparency and protecting your privacy. We only collect information necessary to provide our services and connect people with meaningful work in sustainable agriculture. We never sell your personal information, and we implement strong security measures to keep your data safe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
