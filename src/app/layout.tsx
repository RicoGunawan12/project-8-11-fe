import React from "react";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactButton from "./component/contact";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";
import Image from "next/image";
import { headers } from "next/headers";

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true,
});

type RootLayoutProps = {
  children: React.ReactNode;
};

const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS;
const FACEBOOK_PIXEL_ID = process.env.META_PIXEL;

// export async function generateMetadata({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   const { slug} = params;
//   const siteURL = process.env.PUBLIC_SITE

//   return {
    
//     title: 'TYESO Indonesia',
//     description: 'TYESO Official Indonesia Website',
//     metadataBase: `${siteURL}/${slug ?? ""}`,
//     alternates: {
//       canonical: `${siteURL}/${slug ?? ""}`,
//     },

//     icons: {
//       icon: '/images/icon.ico',
//       shortcut: '/images/icon.ico',
//       apple: '/images/icon.ico',
//       other: {
//         rel: 'apple-touch-icon-precomposed',
//         url: '/images/icon.ico',
//       },
//     },

//     openGraph: {
//       title: 'TYESO Indonesia',
//       description: 'TYESO Official Indonesia Website',
//       url: `${siteURL}/${slug ?? ""}`,
//       siteName: 'Next.js',
//       images: [
//         {
//           url: 'https://nextjs.org/og.png',
//           width: 800,
//           height: 600,
//         },
//         {
//           url: 'https://nextjs.org/og-alt.png',
//           width: 1800,
//           height: 1600,
//           alt: 'My custom alt',
//         },
//       ],
//       locale: 'en_US',
//       type: 'website',
//     },
//   };
// }

export async function generateMetadata() {
  var headersList = headers();
  var fullPath = (await headersList).get("x-url") || "/";
  
  var slug = fullPath.split("/")[3] || "home";
  if(slug=='auth') slug=fullPath.split('/')[4]
  var response = await fetch(`${process.env.METADATA}/${slug}`); 

  if (!response.ok) {
    return {
      title: "TYESO Indonesia",
      description: "TYESO Official Indonesia Website",
      keywords: ["Tyeso", "Product", "Bottle"],
    };
  }

  var data = await response.json();

  return {
    title: data.title,
    description: data.description,
    metadataBase: data.metadataBase,
    alternates: data.alternates,
    icons: data.icons,
    openGraph: data.openGraph,
    keywords: data.keywords,
  };
}

export default function RootLayout({ children }: RootLayoutProps) {

  return (
    <html lang="en">
      
      <head>
        <meta name="google-site-verification" content="R6DF0U5vOfBBKyr2cIHG8jqQJxw8xfibw9typf964N0" />
      
        {/* Google Analytics Script */}

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
