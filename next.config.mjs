const nextConfig = {
  async redirects() {
    return [
      {
        source: "/register",
        destination: "https://forms.gle/2AJUs99FP8xxT2UJA",
        permanent: false,
      },
    ];
  },
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
  transpilePackages: ['react-redux'],
};

export default nextConfig;