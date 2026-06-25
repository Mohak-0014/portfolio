/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  // three.js + drei ship modern ESM; transpile for safety across versions
  transpilePackages: ["three"],
};

export default nextConfig;
