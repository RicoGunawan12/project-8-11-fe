"use client"
import React from 'react'
import OurProductSection from './section/ourProduct';
import BestSellerProduct from './section/bestSellerProduct';
import BestItem from './section/bestItem';
import NewCollection from './section/newCollection';
import Banner from './section/banner';
import NavigationBar from '../component/navbar';
import Footer from '../component/footer';

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