import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <span className="text-2xl">🌱</span>
            <span className="hidden sm:inline">PlayInDirtJobs</span>
            <span className="sm:hidden">PIDJ</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-forest hover:text-primary transition-colors"
            >
              Jobs
            </Link>
            <Link
              href="/post-job"
              className="btn btn-primary text-sm"
            >
              Post a Job
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
