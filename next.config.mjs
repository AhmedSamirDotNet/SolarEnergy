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
    buildActivityPosition: 'bottom-right',
  },
  async rewrites() {
    return [
      {
        source: '/api-backend/:path*',
        destination: 'https://afkar-co.com/lar/:path*',
      },
    ]
  },
}

export default nextConfig
