/** @type {import('next').NextConfig} */

const nextConfig = {

  reactStrictMode: true,

  poweredByHeader: false,

  compress: true,

  output: "standalone",


  images: {

    formats: [
      "image/avif",
      "image/webp"
    ],


    deviceSizes: [
      320,
      420,
      640,
      750,
      1080,
      1200,
      1440,
      1920
    ],


    imageSizes: [
      16,
      32,
      64,
      128,
      256,
      384
    ],


    minimumCacheTTL: 86400,


    remotePatterns: [

      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },

      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },

      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      }

    ]

  },


  async headers() {

    return [

      {

        source: "/images/:path*",

        headers: [

          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }

        ]

      },


      {

        source: "/:path*",

        headers: [

          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },


          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },


          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },


          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          },


          {
            key: "Content-Security-Policy",
            value:
            "default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https:; frame-src https://www.youtube.com;"
          }

        ]

      }

    ];

  },


  experimental: {

    optimizePackageImports: [
      "lucide-react"
    ]

  }


};


module.exports = nextConfig;
