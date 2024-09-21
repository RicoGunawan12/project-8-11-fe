/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "scontent-cgk1-1.cdninstagram.com",
      "scontent-cgk2-1.cdninstagram.com",
      "scontent-cgk1-2.cdninstagram.com",
    ],
  },
  env: {
    USER_REGISTER: process.env.USER_REGISTER,
    USER_LOGIN: process.env.USER_LOGIN,
  },
};

export default nextConfig;
