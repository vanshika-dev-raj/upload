import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.1.45"],
  // Hide the Next.js "N" badge in the corner during development.
  devIndicators: false,
  cacheComponents: true,
  experimental: {
    serverActions: {
      // Photos and PPTs can be large; the default limit is 1 MB.
      bodySizeLimit: "50mb",
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
