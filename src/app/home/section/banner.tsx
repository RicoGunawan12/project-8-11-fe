import Image from 'next/image';
import React from 'react'

const Banner = () => {
  return (
    <div className="flex w-screen h-screen justify-center items-center gap-24 bg-gradient-radial to-amber-500 via-yellow-300 from-yellow-200">
      <div className="w-2/5">
        <div className="text-black text-8xl font-bold">
          Find The Best Cup For Your
        </div>
        <div className="text-black mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic cumque
          magni non consectetur sequi magnam harum molestiae ab voluptatum
          autem.
        </div>
        <div className="mt-2">
          <button className="bg-black text-white py-2 px-10">Check</button>
        </div>
      </div>
      <div className="2/5">
        <Image
          src="/a.jpg"
          width={500}
          height={500}
          alt="logo pic"
          className="rounded-bl-banner"
        />
      </div>
    </div>
  );
}

export default Banner
