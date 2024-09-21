"use client"
import React from 'react'
import OurProductSection from './section/ourProduct';
import BestSellerProduct from './section/bestSellerProduct';
import BestItem from './section/bestItem';
import NewCollection from './section/newCollection';
import Banner from './section/banner';
import NavigationBar from '../component/navbar';

const HomePage = () => {

  return (
    <div className="w-screen bg-white">
      
      <NavigationBar />

      <Banner/>
      <NewCollection/>
      <BestItem/>
      <BestSellerProduct/>
      <OurProductSection/>

    </div>
  );
}

export default HomePage