import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@mobility-nexus/types"],
  turbopack: {
    root: path.resolve(process.cwd(), "../../"),
  },
};

export default nextConfig;
