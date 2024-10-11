// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "7whi4qsyghrar8gh.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "ph-files.imgix.net",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "thestartupmag.com",
      },
      {
        protocol: "https",
        hostname: "techcrunch.com",
      },
      {
        protocol: "https",
        hostname: "img-cdn.publive.online",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: "json",
    });
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

// "uploadthing.com",
// "lh3.googleusercontent.com",
// "7whi4qsyghrar8gh.public.blob.vercel-storage.com",
