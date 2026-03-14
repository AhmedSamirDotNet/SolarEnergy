/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    buildActivityPosition: "bottom-right",
  },
  async rewrites() {
    return [
      {
        source: "/api-backend/:path*",
        destination: "https://analytics.afkarhost.cloud/:path*",
      },
    ];
  },
};

export default nextConfig;
