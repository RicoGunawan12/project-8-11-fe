"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import { workerData } from "worker_threads";
import Navbar from "@/app/component/navbar";
import NavigationBar from "@/app/component/navbar";
import { Button, Input } from "@nextui-org/react";

const ProductDetailPage = () => {
  const router = useParams();
  const id = router.param;

  const productData = [
    {
      photo_link: "/a.jpg",
      rating: Math.floor(Math.random() * 5) + 1,
      product_name: "Wireless Earbuds",
      discount: Math.random() > 0.5,
      price: Math.floor(Math.random() * 500) + 10000,
      original_price: Math.floor(Math.random() * 500) + 15000,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit fugit repellat cumque inventore aliquid earum beatae nemo consequuntur molestiae harum!",
    },
    {
      photo_link: "/a.jpg",
      rating: Math.floor(Math.random() * 5) + 1,
      product_name: "Wireless Earbuds",
      discount: Math.random() > 0.5,
      price: Math.floor(Math.random() * 500) + 10000,
      original_price: Math.floor(Math.random() * 500) + 15000,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit fugit repellat cumque inventore aliquid earum beatae nemo consequuntur molestiae harum!",
    },
    {
      photo_link: "/a.jpg",
      rating: Math.floor(Math.random() * 5) + 1,
      product_name: "Wireless Earbuds",
      discount: Math.random() > 0.5,
      price: Math.floor(Math.random() * 500) + 10000,
      original_price: Math.floor(Math.random() * 500) + 15000,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit fugit repellat cumque inventore aliquid earum beatae nemo consequuntur molestiae harum!",
    },  
    {
      photo_link: "/a.jpg",
      rating: Math.floor(Math.random() * 5) + 1,
      product_name: "Bluetooth Speaker",
      discount: Math.random() > 0.5,
      price: Math.floor(Math.random() * 500) + 10000,
      original_price: Math.floor(Math.random() * 500) + 15000,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit fugit repellat cumque inventore aliquid earum beatae nemo consequuntur molestiae harum!",
    },
    {
      photo_link: "/a.jpg",
      rating: Math.floor(Math.random() * 5) + 1,
      product_name: "Smartwatch",
      discount: Math.random() > 0.5,
      price: Math.floor(Math.random() * 500) + 10000,
      original_price: Math.floor(Math.random() * 500) + 15000,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit fugit repellat cumque inventore aliquid earum beatae nemo consequuntur molestiae harum!",
    },
    {
      photo_link: "/a.jpg",
      rating: Math.floor(Math.random() * 5) + 1,
      product_name: "Portable Charger",
      discount: Math.random() > 0.5,
      price: Math.floor(Math.random() * 500) + 10000,
      original_price: Math.floor(Math.random() * 500) + 15000,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit fugit repellat cumque inventore aliquid earum beatae nemo consequuntur molestiae harum!",
    },
    {
      photo_link: "/a.jpg",
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

  const addToCart = () => {

  }

  return (
    <div className="bg-white w-screen h-screen overflow-y-hidden">
      <NavigationBar />
      <div className="flex h-full">
        {/* Selected Variant */}
        <div className="w-5/12 h-full flex justify-center items-center">
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
        <div className="w-5/12 h-full text-black px-6 flex flex-col justify-between pt-24 pb-12">
          <div>
            <div className="text-5xl font-bold">
              {productData[variantChosen].product_name}
            </div>
            <div className="flex mt-2">
              {productData[variantChosen].discount ? (
                <div className="line-through text-gray-500 mr-2">
                  ${productData[variantChosen].original_price}
                </div>
              ) : null}
              ${productData[variantChosen].price}
            </div>
            <div>{productData[variantChosen].rating} *</div>
            <div>{productData[variantChosen].description}</div>
          </div>
          <div>
            <Input
              type="number"
              label="Quantity"
              placeholder="0"
              labelPlacement="outside"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small"></span>
                </div>
              }
            />
            <Button
              onClick={addToCart}
              className="w-full bg-secondary text-white font-semibold text-lg mt-6"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
