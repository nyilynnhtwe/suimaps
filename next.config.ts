import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://suimaps.vercel.app/sample_nft.png')],
  },
};

export default nextConfig;
