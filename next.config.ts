import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  async headers() {
    const privatePageHeaders = [
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
    ];
    return [
      "/admin/:path*",
      "/employer/:path*",
      "/manage/:path*",
      "/success",
      "/unsubscribe",
      "/jobs/:slug/claim",
    ].map((source) => ({ source, headers: privatePageHeaders }));
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
