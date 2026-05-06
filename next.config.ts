import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: [
    '@sparticuz/chromium-min',
    'playwright-core',
  ],
};

export default nextConfig;
