import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  outputFileTracingIncludes: {
    "/*": ["./db/schema.sql", "./data/keel.db"],
    "/api/*": ["./db/schema.sql", "./data/keel.db"],
    "/meetings/*": ["./db/schema.sql", "./data/keel.db"],
    "/meetings/**": ["./db/schema.sql", "./data/keel.db"],
    "/share/*": ["./db/schema.sql", "./data/keel.db"],
    "/share/**": ["./db/schema.sql", "./data/keel.db"],
    "/calendar": ["./db/schema.sql", "./data/keel.db"],
  },
};

export default nextConfig;
