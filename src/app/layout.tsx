import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactButton from "./component/contact";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true,
});

export const metadata: Metadata = {
  title: "TYESO Indonesia",
  description: "TYESO Official Indonesia Website",
};

const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS;
const FACEBOOK_PIXEL_ID = process.env.META_PIXEL;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        {GOOGLE_ANALYTICS_ID && (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`} />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ANALYTICS_ID}');
              `}
            </Script>
          </>
        )}

        {/* Meta Pixel */}
        {FACEBOOK_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FACEBOOK_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
            alt="fb-pixel"
          />
        </noscript>
      </head>
      <body className={poppinsFont.className}>
        {children}
        <ToastContainer />
        <ContactButton />
        {GOOGLE_ANALYTICS_ID && <GoogleTagManager gtmId={GOOGLE_ANALYTICS_ID} />}
      </body>
    </html>
  );
}
