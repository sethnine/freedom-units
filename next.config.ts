import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",
  fallbacks: {
    document: "/app",
  },
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA(nextConfig);
