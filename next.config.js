/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  transpilePackages: ['@radix-ui/react-progress', '@shadcn/ui'], // Add the packages you use here
};

module.exports = nextConfig;
