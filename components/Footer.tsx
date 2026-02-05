import Link from "next/link";
import Image from "next/image";
import { X as XIcon } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-gray-50 mt-20">
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-primary-light to-accent-yellow" />

      <div className="container mx-auto px-4 py-12">
        {/* Top row: Logo + social */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div>
            <Link href="/" className="inline-block mb-3">
              <Image
                src="/images/PlayInDirtWord.PNG"
                alt="PlayInDirtJobs"
                width={360}
                height={96}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-forest-light max-w-xs">
              Connecting people with farming, gardening, and ranching opportunities.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://www.x.com/playindirtjobs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-light hover:text-primary transition-colors"
              aria-label="Follow us on X"
            >
              <XIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61582960229282"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-light hover:text-primary transition-colors"
              aria-label="Follow us on Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Link grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* For Job Seekers */}
          <div>
            <h4 className="font-display text-forest mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-forest-light">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/job-alerts" className="hover:text-primary transition-colors">
                  Job Alerts
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-display text-forest mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm text-forest-light">
              <li>
                <Link href="/post-job" className="hover:text-primary transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-forest mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-forest-light">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-primary transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="font-display text-forest mb-4">Partners</h4>
            <ul className="space-y-2 text-sm text-forest-light">
              <li>
                <a
                  href="https://www.welldiem.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  WellDiem
                </a>
              </li>
              <li>
                <a
                  href="https://www.fayetteflyer.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Fayette Flyer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-forest-light">
          <p>&copy; {currentYear} PlayInDirtJobs. Growing opportunities together.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
