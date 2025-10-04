import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/images/PlayInDirtWord.PNG"
              alt="PlayInDirtJobs"
              width={360}
              height={96}
              className="h-10 md:h-16 w-auto"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2 md:gap-4">
            <Link
              href="/"
              className="hidden sm:inline-block text-sm font-medium text-forest hover:text-primary transition-colors px-2 py-2"
            >
              Jobs
            </Link>
            <Link
              href="/post-job"
              className="btn btn-primary text-xs sm:text-sm whitespace-nowrap px-3 sm:px-4"
            >
              Post Job
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
