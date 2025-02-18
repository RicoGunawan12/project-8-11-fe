"use client"
import React from 'react'
// import OurProductSection from './section/ourProduct';
// import BestSellerProduct from './section/bestSellerProduct';
// import BestItem from './section/bestItem';
// import NewCollection from './section/newCollection';
// import Banner from './section/banner';
import NavigationBar from '../component/navbar';
// import Footer from '../component/footer';
import dynamic from 'next/dynamic';


const Banner = dynamic(() => import("./section/banner"), { ssr: false })
const BestSellerProduct = dynamic(() => import("./section/bestSellerProduct"), { ssr: false })
const NewCollection = dynamic(() => import("./section/newCollection"), { ssr: false })
const BestItem = dynamic(() => import("./section/bestItem"), { ssr: false })
const OurProductSection = dynamic(() => import("./section/ourProduct"), { ssr: false })
const Footer = dynamic(() => import("../component/footer"), { ssr: false })

const HomePage = () => {

  return (
    <div className="w-screen h-fit p-0 m-0 bg-white">
      <NavigationBar />
      <Banner/>
      <BestSellerProduct/>
      <NewCollection/>
      <BestItem/>
      <OurProductSection/>
      <Footer/>
    </div>
  );
}

export default HomePage