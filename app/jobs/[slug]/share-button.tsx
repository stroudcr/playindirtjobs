'use client';

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="btn btn-outline flex-1 justify-center text-sm"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-primary" />
          Copied!
        </>
      ) : (
        <>
          <Link2 className="w-4 h-4" />
          Copy Link
        </>
      )}
    </button>
  );
}
