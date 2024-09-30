/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
    ],
  },
  env: {
    USER_REGISTER: process.env.USER_REGISTER,
    USER_LOGIN: process.env.USER_LOGIN,
    CATEGORIES: process.env.CATEGORIES,
    PRODUCTS: process.env.PRODUCTS
  },
};

export default nextConfig;
