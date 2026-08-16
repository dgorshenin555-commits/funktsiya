import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // На GitHub Pages сайт живёт в подпапке с именем репозитория,
  // поэтому в проде все пути должны идти с этим префиксом.
  basePath: process.env.NODE_ENV === 'production' ? '/funktsiya' : '',
};

export default nextConfig;
