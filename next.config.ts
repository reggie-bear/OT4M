import type { NextConfig } from "next";
const { initOpenNextCloudflareForDev } = require("@cloudflare/next-on-pages/next-dev");

if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {};

export default nextConfig;
