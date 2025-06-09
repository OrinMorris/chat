import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  distDir: '.next',
  experimental: {
    turbopack: true
  }
};

export default nextConfig;
