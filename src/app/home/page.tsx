"use client"
import React from 'react'
import Navbar from '../component/navbar'
import OurProductSection from './section/ourProduct';
import BestSellerProduct from './section/bestSellerProduct';
import BestItem from './section/bestItem';
import NewCollection from './section/newCollection';
import Banner from './section/banner';

const HomePage = () => {

  return (
    <div className="w-screen bg-white">
      
      <Navbar />

      <Banner/>
      <NewCollection/>
      <BestItem/>
      <BestSellerProduct/>
      <OurProductSection/>

    </div>
  );
}

export default HomePage