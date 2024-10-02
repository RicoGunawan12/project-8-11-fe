import Image from 'next/image';
import React from 'react'

const NewCollection = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center pt-20 lg:pt-0">
      <div className="text-black text-6xl lg:text-8xl font-bold text-center">
        New Collection
      </div>
      <div className="text-black text-center text-md mt-6">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis non,
        nihil alias vitae expedita autem numquam animi culpa voluptatum
        blanditiis.
      </div>
      <div className="flex flex-col lg:flex-row w-2/3 items-center lg:justify-around mt-6">
        <Image
          src="/a.jpg"
          width={200}
          height={200}
          alt="logo pic"
          className="aspect-square w-[200px] h-[200px] lg:w-[400px] lg:h-[400px]"
        />
        <Image
          src="/a.jpg"
          width={200}
          height={200}
          alt="logo pic"
          className="aspect-square mt-3 w-[200px] h-[200px] lg:w-[400px] lg:h-[400px]"
        />
        <Image
          src="/a.jpg"
          width={200}
          height={200}
          alt="logo pic"
          className="aspect-square mt-3 w-[200px] h-[200px] lg:w-[400px] lg:h-[400px]"
        />
      </div>
    </div>
  );
}

export default NewCollection
