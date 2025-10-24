import Link from "next/link";
import Image from "next/image";
import { X as XIcon } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* About */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/PlayInDirtWord.PNG"
                alt="PlayInDirtJobs"
                width={540}
                height={144}
                className="h-24 w-auto"
              />
            </Link>
            <p className="text-sm text-forest-light mb-4">
              Connecting people with farming, gardening, and ranching opportunities.
              Build a sustainable future.
            </p>
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
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="font-semibold text-forest mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-forest-light">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/#subscribe" className="hover:text-primary transition-colors">
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
            <h4 className="font-semibold text-forest mb-4">For Employers</h4>
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
            <h4 className="font-semibold text-forest mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-forest-light">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-primary transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="font-semibold text-forest mb-4">Partners</h4>
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
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-forest-light">
          <p>© {currentYear} PlayInDirtJobs. Growing opportunities together. 🌾</p>
        </div>
      </div>
    </footer>
  );
}
