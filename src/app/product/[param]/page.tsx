"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import { workerData } from "worker_threads";
import Navbar from "@/app/component/navbar";

const ProductDetailPage = () => {
  const router = useParams();
  const id = router.param;

  const productData = [
    {
      photo_link:
        "https://scontent-cgk1-2.cdninstagram.com/v/t51.29350-15/449719214_797251469152405_1782651565383336025_n.heic?stp=dst-jpg_e35_p1080x1080&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTcuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=101&_nc_ohc=5Y9EyFZt01IQ7kNvgGWNdEK&_nc_gid=77692bb39e734791ac36fc19d4000751&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQwNTI5NDk5MTA1MzE5OTQxNw%3D%3D.3-ccb7-5&oh=00_AYDWVU48dQq0l3WE0Zw4fG1xOoj1gzNK0b6a9iR1ID-4KQ&oe=66E9719E&_nc_sid=0b30b7",
      rating: Math.floor(Math.random() * 5) + 1,
      product_name: "Wireless Earbuds",
      discount: Math.random() > 0.5,
      price: Math.floor(Math.random() * 500) + 10000,
      original_price: Math.floor(Math.random() * 500) + 15000,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit fugit repellat cumque inventore aliquid earum beatae nemo consequuntur molestiae harum!",
    },
    {
      photo_link:
        "https://scontent-cgk1-2.cdninstagram.com/v/t51.29350-15/449719214_797251469152405_1782651565383336025_n.heic?stp=dst-jpg_e35_p1080x1080&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTcuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=101&_nc_ohc=5Y9EyFZt01IQ7kNvgGWNdEK&_nc_gid=77692bb39e734791ac36fc19d4000751&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQwNTI5NDk5MTA1MzE5OTQxNw%3D%3D.3-ccb7-5&oh=00_AYDWVU48dQq0l3WE0Zw4fG1xOoj1gzNK0b6a9iR1ID-4KQ&oe=66E9719E&_nc_sid=0b30b7",
      rating: Math.floor(Math.random() * 5) + 1,
      product_name: "Bluetooth Speaker",
      discount: Math.random() > 0.5,
      price: Math.floor(Math.random() * 500) + 10000,
      original_price: Math.floor(Math.random() * 500) + 15000,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit fugit repellat cumque inventore aliquid earum beatae nemo consequuntur molestiae harum!",
    },
    {
      photo_link:
        "https://scontent-cgk1-2.cdninstagram.com/v/t51.29350-15/449719214_797251469152405_1782651565383336025_n.heic?stp=dst-jpg_e35_p1080x1080&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTcuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=101&_nc_ohc=5Y9EyFZt01IQ7kNvgGWNdEK&_nc_gid=77692bb39e734791ac36fc19d4000751&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQwNTI5NDk5MTA1MzE5OTQxNw%3D%3D.3-ccb7-5&oh=00_AYDWVU48dQq0l3WE0Zw4fG1xOoj1gzNK0b6a9iR1ID-4KQ&oe=66E9719E&_nc_sid=0b30b7",
      rating: Math.floor(Math.random() * 5) + 1,
      product_name: "Smartwatch",
      discount: Math.random() > 0.5,
      price: Math.floor(Math.random() * 500) + 10000,
      original_price: Math.floor(Math.random() * 500) + 15000,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit fugit repellat cumque inventore aliquid earum beatae nemo consequuntur molestiae harum!",
    },
    {
      photo_link:
        "https://scontent-cgk1-2.cdninstagram.com/v/t51.29350-15/449719214_797251469152405_1782651565383336025_n.heic?stp=dst-jpg_e35_p1080x1080&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTcuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=101&_nc_ohc=5Y9EyFZt01IQ7kNvgGWNdEK&_nc_gid=77692bb39e734791ac36fc19d4000751&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQwNTI5NDk5MTA1MzE5OTQxNw%3D%3D.3-ccb7-5&oh=00_AYDWVU48dQq0l3WE0Zw4fG1xOoj1gzNK0b6a9iR1ID-4KQ&oe=66E9719E&_nc_sid=0b30b7",
      rating: Math.floor(Math.random() * 5) + 1,
      product_name: "Portable Charger",
      discount: Math.random() > 0.5,
      price: Math.floor(Math.random() * 500) + 10000,
      original_price: Math.floor(Math.random() * 500) + 15000,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit fugit repellat cumque inventore aliquid earum beatae nemo consequuntur molestiae harum!",
    },
    {
      photo_link:
        "https://scontent-cgk1-2.cdninstagram.com/v/t51.29350-15/449719214_797251469152405_1782651565383336025_n.heic?stp=dst-jpg_e35_p1080x1080&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTcuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=101&_nc_ohc=5Y9EyFZt01IQ7kNvgGWNdEK&_nc_gid=77692bb39e734791ac36fc19d4000751&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQwNTI5NDk5MTA1MzE5OTQxNw%3D%3D.3-ccb7-5&oh=00_AYDWVU48dQq0l3WE0Zw4fG1xOoj1gzNK0b6a9iR1ID-4KQ&oe=66E9719E&_nc_sid=0b30b7",
      rating: Math.floor(Math.random() * 5) + 1,
      product_name: "Fitness Tracker",
      discount: Math.random() > 0.5,
      price: Math.floor(Math.random() * 500) + 10000,
      original_price: Math.floor(Math.random() * 500) + 15000,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit fugit repellat cumque inventore aliquid earum beatae nemo consequuntur molestiae harum!",
    },
  ];

  const [variantChosen, setVariantChosen] = useState(0);

  return (
    <div className="bg-white w-screen h-screen flex">
      <Navbar />
      {/* Selected Variant */}
      <div className="w-5/12 h-full flex justify-center items-center pt-14">
        <Image
          src={productData[variantChosen].photo_link}
          width={500}
          height={500}
          style={{ objectFit: "contain" }}
          alt="Not Found"
          layout="fixed"
        />
      </div>
      {/* Variant List */}
      <div className="w-1/12 h-full text-black overflow-y-auto pt-product_detail">
        {productData.map((product, idx) => {
          return (
            <div
              key={idx}
              className="flex justify-center items-center py-2 px-6"
            >
              <Image
                src={product.photo_link}
                width={200}
                height={200}
                alt="Not Found"
                onClick={() => {
                  setVariantChosen(idx);
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Variant Data */}
      <div className="w-5/12 h-full text-black pt-16 px-6">
        <div className="text-8xl font-bold">
          {productData[variantChosen].product_name}
        </div>
        <div>owdkaoksd</div>
        <div>kdokwaodk</div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
