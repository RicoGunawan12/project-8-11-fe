/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns:[{
      protocol: 'http',
      hostname: 'localhost'
    }],
  },
  env: {
    USER_REGISTER: process.env.USER_REGISTER,
    USER_LOGIN: process.env.USER_LOGIN,
    CATEGORIES: process.env.CATEGORIES,
    PRODUCTS: process.env.PRODUCTS,
    BACK_BASE_URL: process.env.BACK_BASE_URL,
    CART: process.env.CART,
    ADDRESS: process.env.ADDRESS,
    FAQ: process.env.FAQ,
    TRANSACTIONS: process.env.TRANSACTIONS
  },
  
};

export default nextConfig;
