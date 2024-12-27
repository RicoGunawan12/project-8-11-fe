import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactButton from "./component/contact";

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TYESO Indonesia",
  description: "TYESO Official Indonesia Website",
  icons: {
    icon: '/favicon.ico'
  }
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={poppinsFont.className}>
        {children}
        <ToastContainer />
        <ContactButton/>
      </body>
    </html>
  );
}
