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
          src="https://scontent-cgk1-1.cdninstagram.com/v/t39.30808-6/455723764_18450080107031145_5661507037296809291_n.jpg?stp=dst-jpg_e35_p1080x1080&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTYuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=J0TMN7OuQLEQ7kNvgHWGhsa&_nc_gid=45ad532f3420433ba4d988ff5b3cf2ef&edm=AEhyXUkAAAAA&ccb=7-5&ig_cache_key=MzQzNTEyOTY0MDYxNTI5ODE4Nw%3D%3D.3-ccb7-5&oh=00_AYCiPU-tR-4vEtmH0SyidFwjLSZebIVcMzKld-yS_NFG9Q&oe=66E72C62&_nc_sid=8f1549"
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
