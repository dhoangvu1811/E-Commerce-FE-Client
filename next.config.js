/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Cho phép tất cả các đường dẫn con phía sau hostname
      },
       {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: '**.fbcdn.net',
        port:'',
        pathname: '/**',
      },
    ]
  }
}

module.exports = nextConfig
