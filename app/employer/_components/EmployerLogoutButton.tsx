"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function EmployerLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const signOut = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Unable to sign out");
      router.replace("/employer/login");
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <span className="inline-flex flex-col items-end">
      <button
        type="button"
        onClick={signOut}
        disabled={loading}
        className="btn btn-outline"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        {loading ? "Signing out…" : "Sign out"}
      </button>
      {error ? <span role="alert" className="mt-1 text-xs text-red-700">Try again</span> : null}
    </span>
  );
}
