import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Uploads live on Vercel Blob (or any https host the admin pastes in).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
