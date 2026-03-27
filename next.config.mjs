/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/software/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
