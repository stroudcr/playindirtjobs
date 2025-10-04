import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
            <p className="text-sm text-forest-light">
              Connecting people with farming, gardening, and ranching opportunities.
              Build a sustainable future.
            </p>
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
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-forest-light">
          <p>© {currentYear} PlayInDirtJobs. Growing opportunities together. 🌾</p>
        </div>
      </div>
    </footer>
  );
}
