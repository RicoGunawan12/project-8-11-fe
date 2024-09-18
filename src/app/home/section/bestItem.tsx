import Image from 'next/image';
import React from 'react'

const BestItem = () => {
  return (
    <div className="w-screen h-screen flex relative justify-center pt-32">
      <div className="w-2/5">
        <Image
          src="https://scontent-cgk1-1.cdninstagram.com/v/t39.30808-6/454937963_18449291683031145_1184331195895188137_n.jpg?stp=dst-jpg_e35_p1080x1080&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTYuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=ukFBUFKiBPsQ7kNvgGRqVLt&edm=AFg4Q8wAAAAA&ccb=7-5&ig_cache_key=MzQzMjA3MTAwOTk2OTU1MzYxNQ%3D%3D.3-ccb7-5&oh=00_AYDnQ3Qvjj8QvZPcNdiJa8PTjXRSziv729h5vqm_V9PzHQ&oe=66E71B96&_nc_sid=0b30b7"
          width={550}
          height={550}
          alt="logo pic"
          className="rounded-tl-banner"
        />
      </div>
      <div className="w-2/5">
        <div className="text-black text-8xl font-bold">Best Cup Since 2014</div>
        <div className="text-black text-lg mt-10">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi
          reiciendis aperiam consectetur, quisquam commodi accusamus hic cum at
          labore maxime vel voluptate officia debitis. Iure laborum, eum
          corporis vitae harum nobis quas voluptas veritatis incidunt at,
          officia dolorum quibusdam beatae!
        </div>
      </div>
      <div className="flex bg-white text-black absolute bottom-52 w-1/2 right-64 shadow-2xl justify-around">
        <div className="border-r-2 pr-6 my-6 border-black flex flex-col items-center">
          <div className="text-5xl font-semibold">2014</div>
          <div>Lorem ipsum dolor sit amet.</div>
        </div>
        <div className="pr-3 pl-3 my-6 border-black flex flex-col items-center">
          <div className="text-5xl font-semibold">8900+</div>
          <div>Lorem ipsum dolor sit amet.</div>
        </div>
        <div className="border-l-2 pl-6 my-6 border-black flex flex-col items-center">
          <div className="text-5xl font-semibold">3105+</div>
          <div>Lorem ipsum dolor sit amet.</div>
        </div>
      </div>
    </div>
  );
}

export default BestItem
