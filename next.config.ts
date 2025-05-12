import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false, // Disable source maps in browser
  images: {
    domains: ["img.daisyui.com", "cdn-icons-png.flaticon.com"],
  },
};

export default nextConfig;
