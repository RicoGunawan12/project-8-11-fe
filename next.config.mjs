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
    PAGES: process.env.PAGES,
    VOUCHER: process.env.VOUCHER,
    BANNERS: process.env.BANNERS
  },
  
};

export default nextConfig;
