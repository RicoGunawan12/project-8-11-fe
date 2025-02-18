"use client";
import dynamic from "next/dynamic"
import Banner from './banner';
import NavigationBar from '../../component/navbar';

const BestSellerProduct = dynamic(() => import("./bestSellerProduct"))
const NewCollection = dynamic(() => import("./newCollection"))
const BestItem = dynamic(() => import("./bestItem"))
const OurProductSection = dynamic(() => import("./ourProduct"))
const Footer = dynamic(() => import("../../component/footer"))

const HomePageContent = () => {
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

export default HomePageContent;