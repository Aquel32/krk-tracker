import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["duckdb", "duckdb-async"],
};

export default nextConfig;
