
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination:
          "https://salonbook-server-zd31.onrender.com/api/auth/:path*",
      },
    ];
  },
};

export default nextConfig;
