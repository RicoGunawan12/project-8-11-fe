"use client"
import React, { useState } from 'react'
import Navbar from '../component/navbar'
import Image from "next/image";
import HotProduct from './product/hot';
import OnSaleProduct from './product/onsale';
import TrendingProduct from './product/trendingNow';
import NewArrivalProduct from './product/newArrival';

const HomePage = () => {

  const [pager, setPager] = useState(1)

  const carousels = [
    {
      product_name: "Nadine Abigail",
      rating: 3,
      photo_link:
        "https://scontent-cgk1-1.cdninstagram.com/v/t39.30808-6/454937963_18449291683031145_1184331195895188137_n.jpg?stp=dst-jpg_e35_p1080x1080&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTYuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=ukFBUFKiBPsQ7kNvgGRqVLt&edm=AFg4Q8wAAAAA&ccb=7-5&ig_cache_key=MzQzMjA3MTAwOTk2OTU1MzYxNQ%3D%3D.3-ccb7-5&oh=00_AYDnQ3Qvjj8QvZPcNdiJa8PTjXRSziv729h5vqm_V9PzHQ&oe=66E71B96&_nc_sid=0b30b7",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      product_name: "Nadine Abigail",
      rating: 3,
      photo_link:
        "https://scontent-cgk1-1.cdninstagram.com/v/t39.30808-6/454937963_18449291683031145_1184331195895188137_n.jpg?stp=dst-jpg_e35_p1080x1080&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTYuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=ukFBUFKiBPsQ7kNvgGRqVLt&edm=AFg4Q8wAAAAA&ccb=7-5&ig_cache_key=MzQzMjA3MTAwOTk2OTU1MzYxNQ%3D%3D.3-ccb7-5&oh=00_AYDnQ3Qvjj8QvZPcNdiJa8PTjXRSziv729h5vqm_V9PzHQ&oe=66E71B96&_nc_sid=0b30b7",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      product_name: "Nadine Abigail",
      rating: 3,
      photo_link:
        "https://scontent-cgk1-1.cdninstagram.com/v/t39.30808-6/454937963_18449291683031145_1184331195895188137_n.jpg?stp=dst-jpg_e35_p1080x1080&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTYuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=ukFBUFKiBPsQ7kNvgGRqVLt&edm=AFg4Q8wAAAAA&ccb=7-5&ig_cache_key=MzQzMjA3MTAwOTk2OTU1MzYxNQ%3D%3D.3-ccb7-5&oh=00_AYDnQ3Qvjj8QvZPcNdiJa8PTjXRSziv729h5vqm_V9PzHQ&oe=66E71B96&_nc_sid=0b30b7",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      product_name: "Nadine Abigail",
      rating: 3,
      photo_link:
        "https://scontent-cgk1-1.cdninstagram.com/v/t39.30808-6/454937963_18449291683031145_1184331195895188137_n.jpg?stp=dst-jpg_e35_p1080x1080&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTYuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=ukFBUFKiBPsQ7kNvgGRqVLt&edm=AFg4Q8wAAAAA&ccb=7-5&ig_cache_key=MzQzMjA3MTAwOTk2OTU1MzYxNQ%3D%3D.3-ccb7-5&oh=00_AYDnQ3Qvjj8QvZPcNdiJa8PTjXRSziv729h5vqm_V9PzHQ&oe=66E71B96&_nc_sid=0b30b7",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      product_name: "Nadine Abigail",
      rating: 3,
      photo_link:
        "https://scontent-cgk1-1.cdninstagram.com/v/t39.30808-6/454937963_18449291683031145_1184331195895188137_n.jpg?stp=dst-jpg_e35_p1080x1080&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTYuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=ukFBUFKiBPsQ7kNvgGRqVLt&edm=AFg4Q8wAAAAA&ccb=7-5&ig_cache_key=MzQzMjA3MTAwOTk2OTU1MzYxNQ%3D%3D.3-ccb7-5&oh=00_AYDnQ3Qvjj8QvZPcNdiJa8PTjXRSziv729h5vqm_V9PzHQ&oe=66E71B96&_nc_sid=0b30b7",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      product_name: "Nadine Abigail",
      rating: 3,
      photo_link:
        "https://scontent-cgk1-1.cdninstagram.com/v/t39.30808-6/454937963_18449291683031145_1184331195895188137_n.jpg?stp=dst-jpg_e35_p1080x1080&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTYuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=ukFBUFKiBPsQ7kNvgGRqVLt&edm=AFg4Q8wAAAAA&ccb=7-5&ig_cache_key=MzQzMjA3MTAwOTk2OTU1MzYxNQ%3D%3D.3-ccb7-5&oh=00_AYDnQ3Qvjj8QvZPcNdiJa8PTjXRSziv729h5vqm_V9PzHQ&oe=66E71B96&_nc_sid=0b30b7",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
  ];

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
      <div className="flex w-screen h-screen bg-stone-800 justify-center items-center gap-6">
        <div className="w-2/5">
          <div className="text-white text-8xl font-bold">
            Best Seller Product
          </div>
          <div className="text-lg mt-4">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores
            soluta dicta, tempora eaque placeat libero debitis voluptatum eum
            assumenda esse ducimus! Unde rem quasi inventore dignissimos ipsa
            corrupti sapiente. Amet dicta facere, eveniet in fugit saepe eum
            commodi totam temporibus rerum voluptatem, autem blanditiis
            distinctio nisi consequatur sequi deleniti? Sapiente.
          </div>
          <div className="border-white border w-fit px-6 py-2 mt-4">
            <button>click here</button>
          </div>
        </div>
        <div className="w-2/5 flex gap-12 overflow-x-auto">
          {carousels.map((carousel, idx) => {
            return (
              <div key={idx} className="flex-shrink-0">
                <Image
                  src={carousel.photo_link}
                  width={400}
                  height={350}
                  alt="logo pic"
                  className="rounded-t-3xl"
                />
                <div className="bg-white py-6 px-10">
                  <div className="text-black">{carousel.rating}</div>
                  <div className="text-black">{carousel.product_name}</div>
                  <div className="text-black flex gap-6">
                    {carousel.discount ? (
                      <div className="line-through text-gray-500">
                        ${carousel.original_price}
                      </div>
                    ) : null}
                    <div>${carousel.price}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Our Product */}
      <div className="w-screen h-screen bg-red-100 flex items-center flex-col">
        <div className='mt-4 text-8xl font-bold text-black'>Our Product</div>
        <div className="flex text-black text-lg font-medium gap-10">
          <button
            onClick={() => {
              console.log(1)
              setPager(1)
            }}
          >
            HOT
          </button>
          <button
            onClick={() => {
              console.log(2)
              setPager(2)
            }}
          >
            ON SALE
          </button>
          <button
            onClick={() => {
              console.log(3)
              setPager(3)
            }}
          >
            TRENDING NOW
          </button>
          <button
            onClick={() => {
              console.log(4)
              setPager(4)
            }}
          >
            NEW ARRIVAL
          </button>
        </div>
        <div className='mt-4'>
          {pager === 1 && <HotProduct/>}
          {pager === 2 && <OnSaleProduct/>}
          {pager === 3 && <TrendingProduct/>}
          {pager === 4 && <NewArrivalProduct/>}
        </div>
      </div>
    </div>
  );
}

export default HomePage