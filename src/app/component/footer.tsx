import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="w-screen h-auto bg-black text-white py-6">
      <div className="flex w-full justify-around">
        <div className="flex w-2/3 gap-6 px-6">
          <div className="text-sm">
            <h1 className="mb-6 text-xl font-bold">COMPANY</h1>
            <div className="flex flex-col gap-y-1">
              <Link href={"/about"}>About</Link>
              <Link href={"/product"}>Product</Link>
            </div>
          </div>
          <div>
            <h1 className="mb-6 text-xl font-bold">SUPPORT</h1>
            <div className="flex flex-col gap-y-1">
              <Link href={"/faq"}>FAQ</Link>
              <Link href={"/blog"}>Blog</Link>
            </div>
          </div>
        </div>
        <div className="w-1/3">
          <h1 className="mb-6 text-xl font-bold">STAY IN TOUCH!</h1>
          <div>
            From new products to new ways to drink while on adventure, we’ll
            take you along for the ride with the latest on everything Hydro
            Flask.
          </div>
        </div>
      </div>
      <div>
        <div>TYESO</div>
        <div>
          
        </div>
      </div>
    </div>
  );
};

export default Footer;
