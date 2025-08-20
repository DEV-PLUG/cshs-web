/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: '',
        pathname: '/**',
      },
    ],
  },
  productionBrowserSourceMaps: false, // Disable source maps in development
  optimizeFonts: false, // Disable font optimization
  swcMinify: true,
};

export default nextConfig;