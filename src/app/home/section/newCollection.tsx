import Image from 'next/image';
import React from 'react'

const NewCollection = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="text-black text-8xl font-bold text-center">
        New Collection
      </div>
      <div className="text-black text-center text-lg mt-6">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis non,
        nihil alias vitae expedita autem numquam animi culpa voluptatum
        blanditiis.
      </div>
      <div className="flex w-2/3 justify-around mt-6">
        <Image
          src="/a.jpg"
          width={400}
          height={400}
          alt="logo pic"
          className="aspect-square"
        />
        <Image
          src="/a.jpg"
          width={400}
          height={400}
          alt="logo pic"
          className="aspect-square"
        />
        <Image
          src="/a.jpg"
          width={400}
          height={400}
          alt="logo pic"
          className="aspect-square"
        />
      </div>
    </div>
  );
}

export default NewCollection
