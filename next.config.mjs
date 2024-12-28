/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: process.env.BACK_IP_ADDR ?? 'localhost'
      },
      {
        protocol: 'https',
        hostname: process.env.BACK_IP_ADDR ?? 'localhost'
      }
    ],
  },
  env: {
    USER_REGISTER: process.env.USER_REGISTER,
    USER_LOGIN: process.env.USER_LOGIN,
    USER: process.env.USER,
    CATEGORIES: process.env.CATEGORIES,
    PRODUCTS: process.env.PRODUCTS,
    BACK_BASE_URL: process.env.BACK_BASE_URL,
    CART: process.env.CART,
    ADDRESS: process.env.ADDRESS,
    FAQ: process.env.FAQ,
    POSTS: process.env.POSTS,
    TRANSACTIONS: process.env.TRANSACTIONS,
    CONTACTS: process.env.CONTACTS,
    EMAILS: process.env.EMAILS,
    PAGES: process.env.PAGES,
    VOUCHER: process.env.VOUCHER,
    BANNERS: process.env.BANNERS,
    RATINGS: process.env.RATINGS,
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
  typescript: {
    ignoreBuildErrors: true, 
  },
};

export default nextConfig;
