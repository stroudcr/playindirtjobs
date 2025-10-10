import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | PlayInDirtJobs",
  description: "Terms of Service for PlayInDirtJobs - Legal terms and conditions for using our farm, garden, and ranch job board platform.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-earth-cream py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card p-8 md:p-12">
          <h1 className="text-4xl font-bold text-forest mb-6">Terms of Service</h1>

          {/* TLDR Act Summary Statement */}
          <div className="bg-accent-yellow/10 border border-accent-yellow/30 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-forest mb-4">Summary Statement (TLDR)</h2>
            <div className="space-y-2 text-sm text-forest-light">
              <p><strong>Reading Time:</strong> Approximately 15 minutes</p>
              <p><strong>Word Count:</strong> Approximately 3,500 words</p>
              <p><strong>Sensitive Information Processed:</strong> Email addresses, payment information (processed by Stripe), company information, job posting content</p>
              <p><strong>Key Legal Points:</strong></p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>You must be 18+ to use our services</li>
                <li>Job postings are active for 60 days</li>
                <li>Payment is processed securely through Stripe</li>
                <li>Users are responsible for their posted content</li>
                <li>Limited liability - service provided &ldquo;as is&rdquo;</li>
                <li>Disputes governed by arbitration and US law</li>
              </ul>
            </div>
          </div>

          <div className="prose prose-forest max-w-none">
            <p className="text-forest-light mb-6">
              <strong>Effective Date:</strong> January 1, 2025<br />
              <strong>Last Updated:</strong> January 1, 2025
            </p>

            {/* Table of Contents */}
            <div className="bg-forest/5 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-forest mb-3">Table of Contents</h3>
              <ol className="space-y-2 text-sm">
                <li><a href="#acceptance" className="text-primary hover:underline">1. Acceptance of Terms</a></li>
                <li><a href="#description" className="text-primary hover:underline">2. Service Description</a></li>
                <li><a href="#accounts" className="text-primary hover:underline">3. User Accounts</a></li>
                <li><a href="#employer-terms" className="text-primary hover:underline">4. Employer Posting Terms</a></li>
                <li><a href="#user-content" className="text-primary hover:underline">5. User-Generated Content</a></li>
                <li><a href="#intellectual-property" className="text-primary hover:underline">6. Intellectual Property</a></li>
                <li><a href="#payment" className="text-primary hover:underline">7. Payment Terms</a></li>
                <li><a href="#prohibited" className="text-primary hover:underline">8. Prohibited Uses</a></li>
                <li><a href="#disclaimers" className="text-primary hover:underline">9. Disclaimers</a></li>
                <li><a href="#limitation" className="text-primary hover:underline">10. Limitation of Liability</a></li>
                <li><a href="#indemnification" className="text-primary hover:underline">11. Indemnification</a></li>
                <li><a href="#dispute" className="text-primary hover:underline">12. Dispute Resolution</a></li>
                <li><a href="#governing-law" className="text-primary hover:underline">13. Governing Law</a></li>
                <li><a href="#modifications" className="text-primary hover:underline">14. Modifications</a></li>
                <li><a href="#termination" className="text-primary hover:underline">15. Termination</a></li>
                <li><a href="#general" className="text-primary hover:underline">16. General Provisions</a></li>
                <li><a href="#contact" className="text-primary hover:underline">17. Contact Information</a></li>
              </ol>
            </div>

            <section id="acceptance" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">1. Acceptance of Terms</h2>
              <p className="text-forest-light mb-4">
                Welcome to PlayInDirtJobs, a service operated by WellDiem Company LLC (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of our website, services, and platform (collectively, the &ldquo;Service&rdquo;).
              </p>
              <p className="text-forest-light mb-4">
                By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service. You must be at least 18 years of age to use this Service.
              </p>
            </section>

            <section id="description" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">2. Service Description</h2>
              <p className="text-forest-light mb-4">
                PlayInDirtJobs is an online job board platform connecting job seekers with employers in the agriculture, farming, gardening, and ranching industries. Our Service allows:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li>Job seekers to browse and search for employment opportunities</li>
                <li>Employers to post job listings and connect with potential candidates</li>
                <li>Users to receive email alerts about new job postings</li>
              </ul>
              <p className="text-forest-light mb-4">
                We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time without notice.
              </p>
            </section>

            <section id="accounts" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">3. User Accounts</h2>
              <p className="text-forest-light mb-4">
                To post jobs, you may need to provide an email address and company information. You agree to:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account access links</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
              <p className="text-forest-light mb-4">
                We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.
              </p>
            </section>

            <section id="employer-terms" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">4. Employer Posting Terms</h2>
              <p className="text-forest-light mb-4">
                When posting a job listing, you agree that:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li><strong>Duration:</strong> Job postings remain active for 60 days from the date of publication</li>
                <li><strong>Accuracy:</strong> All information provided is accurate, truthful, and not misleading</li>
                <li><strong>Legitimate Opportunities:</strong> Postings represent genuine employment opportunities</li>
                <li><strong>Legal Compliance:</strong> Your posting complies with all applicable employment laws, including anti-discrimination laws</li>
                <li><strong>Management:</strong> You can edit or deactivate your listing using the magic link sent to your email</li>
                <li><strong>No Guarantees:</strong> We do not guarantee any specific number of views, applications, or hiring outcomes</li>
              </ul>
            </section>

            <section id="user-content" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">5. User-Generated Content</h2>
              <p className="text-forest-light mb-4">
                You retain ownership of content you submit to the Service, including job postings and company information. By posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, reproduce, and distribute your content in connection with operating and promoting the Service.
              </p>
              <p className="text-forest-light mb-4">
                You represent and warrant that:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li>You own or have the necessary rights to all content you post</li>
                <li>Your content does not violate any third-party rights</li>
                <li>Your content does not violate any laws or regulations</li>
                <li>Your content is not fraudulent, deceptive, or misleading</li>
              </ul>
              <p className="text-forest-light mb-4">
                We reserve the right, but have no obligation, to monitor, edit, or remove any content that violates these Terms or that we find objectionable.
              </p>
            </section>

            <section id="intellectual-property" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">6. Intellectual Property</h2>
              <p className="text-forest-light mb-4">
                The Service, including its design, text, graphics, logos, and software, is owned by WellDiem Company LLC and is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or reverse engineer any part of the Service without our express written permission.
              </p>
              <p className="text-forest-light mb-4">
                &ldquo;PlayInDirtJobs&rdquo; and associated logos are trademarks of WellDiem Company LLC. Use of these trademarks without permission is strictly prohibited.
              </p>
            </section>

            <section id="payment" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">7. Payment Terms</h2>
              <p className="text-forest-light mb-4">
                <strong>Job Posting Fees:</strong> Certain services, such as posting job listings, require payment. Current pricing is displayed on our website before checkout.
              </p>
              <p className="text-forest-light mb-4">
                <strong>Payment Processing:</strong> All payments are processed securely through Stripe, a third-party payment processor. We do not store your credit card information. By making a payment, you agree to Stripe's terms and conditions.
              </p>
              <p className="text-forest-light mb-4">
                <strong>Refund Policy:</strong> Job posting fees are generally non-refundable once the posting goes live. If you experience technical issues preventing your listing from being published, please contact us at info@playindirtjobs.com within 48 hours.
              </p>
              <p className="text-forest-light mb-4">
                <strong>Pricing Changes:</strong> We reserve the right to modify our pricing at any time. Changes will not affect existing active postings.
              </p>
            </section>

            <section id="prohibited" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">8. Prohibited Uses</h2>
              <p className="text-forest-light mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li>Post false, misleading, or fraudulent job listings</li>
                <li>Discriminate based on race, color, religion, sex, national origin, age, disability, or other protected characteristics</li>
                <li>Collect personal information from users without their consent</li>
                <li>Send spam or unsolicited commercial messages</li>
                <li>Upload viruses, malware, or harmful code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Scrape or harvest data from the Service using automated means</li>
                <li>Post pyramid schemes, multi-level marketing, or similar opportunities</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </section>

            <section id="disclaimers" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">9. Disclaimers</h2>
              <p className="text-forest-light mb-4 uppercase font-semibold">
                THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-forest-light mb-4">
                We do not warrant that:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li>The Service will be uninterrupted, secure, or error-free</li>
                <li>Job listings are accurate or represent legitimate opportunities</li>
                <li>Any employer or job seeker is qualified, safe, or reliable</li>
                <li>Your use of the Service will result in employment or successful hiring</li>
              </ul>
              <p className="text-forest-light mb-4">
                You acknowledge that we are a platform connecting employers and job seekers, and we are not responsible for the conduct, safety, legality, or quality of any job posting, employer, or job seeker.
              </p>
            </section>

            <section id="limitation" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">10. Limitation of Liability</h2>
              <p className="text-forest-light mb-4 uppercase font-semibold">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WELLDIEM COMPANY LLC, ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
              </p>
              <p className="text-forest-light mb-4">
                IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS RELATED TO THE SERVICE EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR $100, WHICHEVER IS GREATER.
              </p>
              <p className="text-forest-light mb-4">
                Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you.
              </p>
            </section>

            <section id="indemnification" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">11. Indemnification</h2>
              <p className="text-forest-light mb-4">
                You agree to indemnify, defend, and hold harmless WellDiem Company LLC, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or related to:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-forest-light mb-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Content you post or submit to the Service</li>
                <li>Your employment practices or hiring decisions</li>
              </ul>
            </section>

            <section id="dispute" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">12. Dispute Resolution</h2>
              <p className="text-forest-light mb-4">
                <strong>Informal Resolution:</strong> Before filing a claim, you agree to contact us at info@playindirtjobs.com to attempt to resolve the dispute informally. We will attempt to resolve the dispute within 60 days.
              </p>
              <p className="text-forest-light mb-4">
                <strong>Arbitration Agreement:</strong> If we cannot resolve the dispute informally, you agree that any dispute arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the Commercial Arbitration Rules of the American Arbitration Association, rather than in court.
              </p>
              <p className="text-forest-light mb-4">
                <strong>Class Action Waiver:</strong> You agree to resolve disputes with us only on an individual basis, and not as part of a class, consolidated, or representative action.
              </p>
              <p className="text-forest-light mb-4">
                <strong>Exceptions:</strong> Either party may bring a claim in small claims court as an alternative to arbitration.
              </p>
            </section>

            <section id="governing-law" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">13. Governing Law</h2>
              <p className="text-forest-light mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the United States and the state in which WellDiem Company LLC is registered, without regard to its conflict of law provisions.
              </p>
            </section>

            <section id="modifications" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">14. Modifications to Terms</h2>
              <p className="text-forest-light mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on our website with a new "Last Updated" date. Your continued use of the Service after changes are posted constitutes your acceptance of the modified Terms.
              </p>
              <p className="text-forest-light mb-4">
                We encourage you to review these Terms periodically.
              </p>
            </section>

            <section id="termination" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">15. Termination</h2>
              <p className="text-forest-light mb-4">
                We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.
              </p>
              <p className="text-forest-light mb-4">
                Upon termination, your right to use the Service will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnification, and limitations of liability.
              </p>
            </section>

            <section id="general" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">16. General Provisions</h2>
              <p className="text-forest-light mb-4">
                <strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and WellDiem Company LLC regarding the Service.
              </p>
              <p className="text-forest-light mb-4">
                <strong>Severability:</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
              </p>
              <p className="text-forest-light mb-4">
                <strong>Waiver:</strong> Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
              <p className="text-forest-light mb-4">
                <strong>Assignment:</strong> You may not assign or transfer these Terms without our prior written consent. We may assign our rights and obligations without restriction.
              </p>
              <p className="text-forest-light mb-4">
                <strong>No Agency:</strong> Nothing in these Terms creates any agency, partnership, joint venture, or employment relationship between you and WellDiem Company LLC.
              </p>
            </section>

            <section id="contact" className="mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">17. Contact Information</h2>
              <p className="text-forest-light mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-forest/5 rounded-lg p-6">
                <p className="text-forest-light mb-2">
                  <strong>Company:</strong> WellDiem Company LLC
                </p>
                <p className="text-forest-light mb-2">
                  <strong>Email:</strong> <a href="mailto:info@playindirtjobs.com" className="text-primary hover:underline">info@playindirtjobs.com</a>
                </p>
                <p className="text-forest-light">
                  <strong>Website:</strong> <Link href="/" className="text-primary hover:underline">https://playindirtjobs.com</Link>
                </p>
              </div>
            </section>

            <div className="border-t border-border pt-8 mt-12 text-center">
              <p className="text-sm text-forest-light">
                Thank you for using PlayInDirtJobs. We&rsquo;re committed to connecting people with meaningful work in sustainable agriculture.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
