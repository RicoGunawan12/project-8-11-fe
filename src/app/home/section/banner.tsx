import Image from 'next/image';
import React from 'react'

const Banner = () => {
  return (
    <div className="lg:flex w-screen h-screen justify-center items-center gap-24 bg-gradient-radial to-amber-500 via-yellow-300 from-yellow-200 p-6">
      <div className="lg:w-2/5 pt-20 lg:pt-0">
        <div className="text-black text-4rxl lg:text-8xl font-bold">
          Find The Best Cup For Your
        </div>
        <div className="text-black mt-2 text-md">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic cumque
          magni non consectetur sequi magnam harum molestiae ab voluptatum
          autem.
        </div>
        <div className="mt-2">
          <button className="bg-black text-white py-2 px-10">Check</button>
        </div>
      </div>
      <div className="lg:w-2/5 lg:h-auto h-5/6 pt-6 lg:pt-0 flex justify-end lg:justify-center">
        <Image
          src="/a.jpg"
          width={400}
          height={400}
          alt="logo pic"
          className="rounded-bl-banner w-full h-1/2 lg:w-[500px] lg:h-[500px]"
        />
      </div>
    </div>
  );
}

export default Banner
