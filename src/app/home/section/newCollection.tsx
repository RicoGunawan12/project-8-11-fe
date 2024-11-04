"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NewCollection = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center pt-10 lg:pt-20">
      <div className="text-black text-6xl lg:text-8xl font-bold text-center">
        New Collection
      </div>
      <div className="text-black text-center text-md pt-2 lg:mt-6 px-2 lg:px-0">
        Discover our newest collection—where style meets functionality in every piece. Fresh designs, vibrant colors, and premium quality await to elevate your everyday essentials!
      </div>
      <div className="flex flex-col lg:flex-row h-3/5 w-2/3 items-center lg:justify-around mt-6">
        <Link href={"#"}>
          <Image
            src="/a.jpg"
            width={200}
            height={200}
            alt="logo pic"
            className="aspect-square w-[180px] h-1/3 lg:w-[400px] lg:h-[400px]"
          />
        </Link>
        <Link href={"#"}>
          <Image
            src="/a.jpg"
            width={200}
            height={200}
            alt="logo pic"
            className="aspect-square w-[180px] h-1/3 lg:w-[400px] lg:h-[400px]"
          />
        </Link><Link href={"#"}>
          <Image
            src="/a.jpg"
            width={200}
            height={200}
            alt="logo pic"
            className="aspect-square w-[180px] h-1/3 lg:w-[400px] lg:h-[400px]"
          />
        </Link>
      </div>
    </div>
  );
};

export default NewCollection;
