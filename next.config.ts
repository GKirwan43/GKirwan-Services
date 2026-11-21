import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A self-contained build (.next/standalone) that runs with `node server.js` and needs no node_modules, for the LXC.
  output: "standalone",
};

export default nextConfig;
