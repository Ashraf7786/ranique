import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow SVG files to be served (used for styled placeholder images)
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Serve all static files unoptimized (SVG + PNG from /public)
    // Real images can be optimized via a CDN in production
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
