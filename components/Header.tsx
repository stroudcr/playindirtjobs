import Link from "next/link";
import Image from "next/image";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/images/PlayInDirtWord.PNG"
              alt="PlayInDirtJobs"
              width={360}
              height={96}
              className="h-9 md:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="text-sm font-medium text-forest hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Browse Jobs
            </Link>
            <Link
              href="/job-alerts"
              className="text-sm font-medium text-forest hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Job Alerts
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-forest hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Pricing
            </Link>
            <div className="w-px h-6 bg-border mx-2" />
            <Link
              href="/post-job"
              className="btn btn-primary text-sm px-4"
            >
              Post a Job
            </Link>
          </nav>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/post-job"
              className="btn btn-primary text-xs px-3"
            >
              Post Job
            </Link>
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
