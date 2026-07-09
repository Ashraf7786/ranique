import type { NextConfig } from "next";

const securityHeaders = [
  // Prevents the page from being displayed in an iframe — stops clickjacking attacks
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Prevents browsers from sniffing the MIME type — stops certain injection attacks
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Controls how much referrer info is sent — protects user privacy
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Disables access to camera, microphone, and geolocation APIs
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Enables DNS prefetching for performance
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // Enforces HTTPS for 2 years — only applies when site is served over HTTPS
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  headers: async () => [
    {
      // Apply security headers to all routes
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
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
