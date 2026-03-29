import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["localhost:3000", "192.168.3.70:3000"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tbknvsjxnatqtcxofnkv.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
