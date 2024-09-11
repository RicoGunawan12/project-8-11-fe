"use client"
import React from 'react'
import Navbar from '../component/navbar'
import Image from "next/image";

const HomePage = () => {

  const banners = [
    {
      title : "Ini ke-1",
      name : "TYESO Travel Mug 1",
      link : "https://tyesoindonesia.id/wp-content/uploads/2024/02/232-1024x1024.png",
      id: "1",
    },
    {
      title : "Ini ke-2",
      name : "TYESO Travel Mug 2",
      link : "https://tyesoindonesia.id/wp-content/uploads/2024/02/1.1-1.jpg",
      id: "",
    },
    {
      title : "Ini ke-3",
      name : "TYESO Travel Mug 3",
      link : "https://tyesoindonesia.id/wp-content/uploads/2024/02/1.2.jpg",
      id: "",
    },
    {
      title : "Ini ke-4",
      name : "TYESO Travel Mug 4",
      link : "https://tyesoindonesia.id/wp-content/uploads/2024/02/1.3.jpg",
      id: "",
    },
  ]

  const slideNext = () =>{
    const slider = document.getElementById('slider')

    if(slider){
      slider.style.transform = 'translate(-1024px, 0)'
    }
    console.log("move")
  }

  return (
    <div className="w-screen bg-white">
      <Navbar />
      {/* Banner */}
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

      {/* New Collection */}
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
            src="https://scontent-cgk1-1.cdninstagram.com/v/t39.30808-6/455620360_18450080116031145_8492434641316228714_n.jpg?stp=dst-jpg_e35_p1080x1080&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=dGtuz8uNiTgQ7kNvgF1NkV6&edm=AEhyXUkAAAAA&ccb=7-5&ig_cache_key=MzQzNTEyOTY0MDYwNjc5MTk5NA%3D%3D.3-ccb7-5&oh=00_AYCjEq31tFVrEou4pCLViSnW3VgGxE8OUvTE7aGQPt6pnA&oe=66E716D9&_nc_sid=8f1549"
            width={400}
            height={400}
            alt="logo pic"
            className="aspect-square"
          />
          <Image
            src="https://scontent-cgk1-1.cdninstagram.com/v/t39.30808-6/455707271_18450080125031145_315727109677010934_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTYuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=1lH-joe5x-gQ7kNvgEQA2hj&_nc_gid=45ad532f3420433ba4d988ff5b3cf2ef&edm=AEhyXUkAAAAA&ccb=7-5&ig_cache_key=MzQzNTEyOTY0MDc5MTU2Nzk0Ng%3D%3D.3-ccb7-5&oh=00_AYDUQ2VUrcnQLIrjHVTAgAyIzkBBt2h9Pu1yo9miwnN4JQ&oe=66E6F713&_nc_sid=8f1549"
            width={400}
            height={400}
            alt="logo pic"
            className="aspect-square"
          />
          <Image
            src="https://scontent-cgk1-1.cdninstagram.com/v/t39.30808-6/455789176_18450080137031145_5719792645966362196_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTYuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=yGltols5s4EQ7kNvgFxTm2y&_nc_gid=45ad532f3420433ba4d988ff5b3cf2ef&edm=AEhyXUkAAAAA&ccb=7-5&ig_cache_key=MzQzNTEyOTY0MDYxNTI1NTQ4MA%3D%3D.3-ccb7-5&oh=00_AYAdFey_v48Cctv3xezrMWbyHyI9Ok5lazE4_Z6z80wt0w&oe=66E720A1&_nc_sid=8f1549"
            width={400}
            height={400}
            alt="logo pic"
            className="aspect-square"
          />
        </div>
      </div>

      {/* Best Item */}
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
          <div className="text-black text-8xl font-bold">
            Best Cup Since 2014
          </div>
          <div className="text-black text-lg mt-10">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi
            reiciendis aperiam consectetur, quisquam commodi accusamus hic cum
            at labore maxime vel voluptate officia debitis. Iure laborum, eum
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

      {/* Best Seller Product */}
      <div className='flex'>
        <div>
          <div>
            Best Seller Product
          </div>
          <div>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores soluta dicta, tempora eaque placeat libero debitis voluptatum eum assumenda esse ducimus! Unde rem quasi inventore dignissimos ipsa corrupti sapiente. Amet dicta facere, eveniet in fugit saepe eum commodi totam temporibus rerum voluptatem, autem blanditiis distinctio nisi consequatur sequi deleniti? Sapiente.
          </div>
          <div>
            <button></button>
          </div>
        </div>
        <div>
          
        </div>
      </div>
    </div>
  );
}

export default HomePage