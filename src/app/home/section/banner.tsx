"use client";
import Image from "next/image";
import React from "react";

const Banner = () => {
  return (
    <div className="flex flex-col lg:flex-row w-screen h-screen justify-center items-center gap-24 bg-gradient-radial from-yellow-200 via-yellow-300 to-amber-500 p-6">
      <div className="lg:w-2/5 pt-20 lg:pt-0">
        <h1 className="text-black text-4xl lg:text-8xl font-bold">
          Find The Best Cup For Your
        </h1>
        <p className="text-black mt-6 text-md">
          Upgrade your hydration with our stylish, eco-friendly cups and bottles! Designed to keep drinks hot or cold for hours, they’re perfect for any adventure. Available in a variety of colors and sizes, there’s a match for everyone. Sip in style—get yours today!
        </p>
        <div className="mt-2">
          <button className="bg-black text-white py-2 px-10">
            Check
          </button>
        </div>
      </div>
      <div className="lg:w-2/5 h-5/6 lg:h-auto pt-6 lg:pt-0 flex justify-end lg:justify-center">
        <Image
          src="/a.jpg"
          width={500}
          height={500}
          alt="Stylish cup"
          className="rounded-bl-banner w-full lg:w-[500px] lg:h-[500px] object-cover"
        />
      </div>
    </div>
  );
};

export default Banner;
