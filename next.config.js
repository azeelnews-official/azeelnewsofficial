/** @type {import('next').NextConfig} */

const nextConfig = {

  compress: true,

  images: {
    formats: ['image/avif','image/webp'],
    remotePatterns: [
      {
        protocol:'https',
        hostname:'**'
      }
    ]
  },

  experimental:{
    optimizePackageImports:[
      "lucide-react",
      "react-icons"
    ]
  },

  poweredByHeader:false,

  async headers(){

    return [
      {
        source:"/(.*)",
        headers:[
          {
            key:"X-Content-Type-Options",
            value:"nosniff"
          },
          {
            key:"X-Frame-Options",
            value:"SAMEORIGIN"
          },
          {
            key:"Cache-Control",
            value:"public, max-age=0, must-revalidate"
          }
        ]
      }
    ]

  }

}

module.exports = nextConfig
