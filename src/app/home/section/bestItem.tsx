"use client"
import Image from 'next/image';
import React from 'react'

const BestItem = () => {
  return (
    <div className="w-screen h-screen flex flex-col lg:flex-row-reverse relative lg:justify-center pt-6 lg:pt-32">
      <div className="w-full lg:w-2/5">
        <div className="text-black pl-6 lg:pl-0 text-3xl lg:text-8xl font-bold">Best Cup Since 2014</div>
        <div className="text-black pl-6 lg:pl-0 text-md lg:text-lg mt-2 lg:mt-10">
        Meet the TYESO Cup, our best-seller that’s been making waves! Known for its sleek design and superior insulation, this cup keeps your drinks at the perfect temperature for hours, whether hot or cold. Made from eco-friendly, durable materials and available in multiple colors, the TYESO Cup has become a favorite for its blend of style, sustainability, and function. Perfect for on-the-go lifestyles, it&apos;s the go-to choice for those who value both quality and the environment.
        </div>
      </div>
      <div className="w-full lg:w-2/5 flex justify-start pl-6">
        <Image
          src="/a.jpg"
          width={550}
          height={550}
          alt="logo pic"
          className="rounded-tl-banner w-[350px] h-[600px] lg:w-[550px] lg:h-[550px]"
        />
      </div>
      <div className="flex bg-white text-black absolute bottom-10 right-6 lg:bottom-52 w-4/5 lg:w-1/2 lg:right-64 shadow-2xl justify-around">
        <div className="border-r-2 pr-2 lg:pr-6 my-6 border-black flex flex-col items-center">
          <div className="text-md lg:text-5xl font-semibold">8900+</div>
          <div className='text-sm'>Interact</div>
        </div>
        <div className="pr-1 pl-1 lg:pr-3 lg:pl-3 my-6 border-black flex flex-col items-center">
          <div className="text-md lg:text-5xl font-semibold">3105+</div>
          <div className='text-sm'>Purchase</div>
        </div>
        <div className="border-l-2 pl-2 lg:pl-6 my-6 border-black flex flex-col items-center">

          <div className="text-md lg:text-5xl font-semibold">2014</div>
          <div className='text-sm'>Reviews</div>
        </div>
      </div>
    </div>
  );
}

export default BestItem
