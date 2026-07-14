"use client";

import { useEffect, useRef } from "react";

export function TrackJobView({ slug }: { slug: string }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    void fetch(`/api/jobs/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      keepalive: true,
    });
  }, [slug]);
  return null;
}
