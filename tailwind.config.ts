import {nextui} from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        primary: "#000000",
        secondary: "#405362"
      },
      dropShadow:{
        default: "0 3px 10px rgba(0,0,0,1)"
      },
      borderRadius:{
        banner: "15rem"
      },
      padding:{
        product_detail : "65px"
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
