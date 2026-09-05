"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export function WorkshopPaymentStatus() {
  const router = useRouter();
  useEffect(() => {
    let attempts = 0;
    const timer = window.setInterval(() => {
      if (++attempts <= 12) router.refresh();
      else window.clearInterval(timer);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [router]);
  return (
    <p className="mt-4 text-sm text-forest-light" role="status">
      Waiting for secure payment confirmation. This page checks automatically.
    </p>
  );
}
