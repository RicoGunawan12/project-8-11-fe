"use client"
import React from 'react'
import OurProductSection from './section/ourProduct';
import BestSellerProduct from './section/bestSellerProduct';
import BestItem from './section/bestItem';
import NewCollection from './section/newCollection';
import Banner from './section/banner';
import NavigationBar from '../component/navbar';
import Footer from '../component/footer';
import { NextSeo } from 'next-seo';

const HomePage = () => {

  return (
    <>
<NextSeo
        title= "Tyeso"
        description= "Tyeso Home"
        canonical="https://tyeso.indonesia.com"
        openGraph={{
          title: "Tyeso",
          description: "Tyeso Home",
          url: "https://tyeso.indonesia.com",
          type: "website",
          images: [
            {
              url: "https://www.example.com/images/og-image.jpg",
              width: 1200,
              height: 630,
              alt: "Og Image Alt",
            },
          ],
          siteName: "Tyeso",
        }}
      />

      {/* Main Page Content */}
      <div className="w-screen h-fit p-0 m-0 bg-white">
        <NavigationBar />
        <Banner />
        <BestSellerProduct />
        <NewCollection />
        <BestItem />
        <OurProductSection />
        <Footer />
      </div>
    </>

  );
}

export default HomePage