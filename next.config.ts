import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      // Redirect www to non-www
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.playindirtjobs.com",
          },
        ],
        destination: "https://playindirtjobs.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
