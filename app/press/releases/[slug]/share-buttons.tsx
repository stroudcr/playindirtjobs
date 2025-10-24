"use client";

import { Printer, Share2 } from "lucide-react";

export function ShareButtons() {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link');
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={handlePrint}
        className="btn bg-white border border-border hover:bg-gray-50 text-forest text-sm"
      >
        <Printer className="w-4 h-4" />
        Print
      </button>
      <button
        onClick={handleShare}
        className="btn bg-white border border-border hover:bg-gray-50 text-forest text-sm"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>
    </div>
  );
}
