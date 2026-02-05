"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 top-16 bg-black/20 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-soft-lg z-50">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-sm font-medium text-forest hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
                Browse Jobs
              </Link>
              <Link
                href="/job-alerts"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-sm font-medium text-forest hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
                Job Alerts
              </Link>
              <Link
                href="/pricing"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-sm font-medium text-forest hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-sm font-medium text-forest hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
                About
              </Link>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
