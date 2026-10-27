import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.1.45"],
  // Hide the Next.js "N" badge in the corner during development.
  devIndicators: false,
  cacheComponents: true,
  experimental: {
    serverActions: {
      // Files are capped at 25 MB in lib/limits.ts; the extra 2 MB covers upload overhead.
      bodySizeLimit: "27mb",
    },
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
