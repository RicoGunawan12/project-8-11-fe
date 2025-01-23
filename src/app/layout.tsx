import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactButton from "./component/contact";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";
import Image from "next/image";

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TYESO Indonesia",
  description: "TYESO Official Indonesia Website",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

// Access environment variables
const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS;
const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics Script */}
        {GOOGLE_ANALYTICS_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS}`}
            ></Script>
            <Script id="google-analytics">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.GOOGLE_ANALYTICS}');
              `}
            </Script>
          </>
        )}

        {/* Meta Pixel Base Code */}
        {FACEBOOK_PIXEL_ID && (
          <>
            <Script id="meta-pixel">
              {`
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '485548430893380');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=485548430893380&ev=PageView&noscript=1"
/></noscript>

              `}
            </Script>
            <noscript>
              <Image
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${process.env.META_PIXEL}&ev=PageView&noscript=1`}
                alt="fb-pixel"
              />
            </noscript>
          </>
        )}
      </head>


      <body className={poppinsFont.className}>
        {children}
        <ToastContainer />
        <ContactButton />
        <GoogleTagManager gtmId={process.env.GOOGLE_ANALYTICS || ""} />
      </body>
    </html>
  );
}
