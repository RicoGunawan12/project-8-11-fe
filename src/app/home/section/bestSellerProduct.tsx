"use client";
import Image from "next/image";
import React from "react";
import { renderStars } from '../../utilities/icons';

const BestSellerProduct = () => {
  const carousels = [
    {
      product_name: "Cup 1",
      rating: 3.14,
      photo_link: "/a.jpg",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      product_name: "Cup 2",
      rating: 2.45,
      photo_link: "/a.jpg",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      product_name: "Cup 3",
      rating: 4.65,
      photo_link: "/a.jpg",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      product_name: "Cup 4",
      rating: 5,
      photo_link: "/a.jpg",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      product_name: "Cup 5",
      rating: 4.34,
      photo_link: "/a.jpg",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      product_name: "Cup 6",
      rating: 3.87,
      photo_link: "/a.jpg",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
  ];

  return (
    <div className="relative flex w-screen h-screen bg-stone-800 justify-center items-center gap-6 overflow-x-auto px-20">
      {/* Fade effect container */}
      <div className="relative w-full before:absolute before:top-0 before:bottom-0 before:left-0 before:w-12 before:bg-gradient-to-r before:from-stone-800 before:to-transparent before:pointer-events-none after:absolute after:top-0 after:bottom-0 after:right-0 after:w-12 after:bg-gradient-to-l after:from-stone-800 after:to-transparent after:pointer-events-none">
        <div className="flex gap-6 overflow-x-auto pl-12 pr-12">
          {/* Content container */}
          <div className="w-2/5">
            <div className="text-white text-8xl font-bold">
              Best Seller Product
            </div>
            <div className="text-lg mt-4 text-white">
            Our best seller product is renowned for its exceptional quality and customer satisfaction. Carefully crafted using the finest materials, it offers a perfect balance of durability, functionality, and style. Customers love it for its reliability and outstanding performance, making it the top choice in its category. Whether you&apos;re looking for something to enhance your everyday life or a dependable solution to meet your needs, our best seller delivers unmatched value. With countless positive reviews and high ratings, it&apos;s clear why this product stands out as a customer favorite. Experience the excellence that sets it apart today!
            </div>
            <div className="border-white text-white border w-fit px-6 py-2 mt-4">
              <button>click here</button>
            </div>
          </div>

          <div className="w-2/5 flex gap-12">
            {carousels.map((carousel, idx) => (
              <div key={idx} className="flex-shrink-0">
                <Image
                  src={carousel.photo_link}
                  width={400}
                  height={350}
                  alt="logo pic"
                  className="rounded-t-3xl"
                />
                <div className="bg-white py-6 px-10">
                  <div className="text-black">{renderStars(carousel.rating)}</div>
                  <div className="text-black">{carousel.product_name}</div>
                  <div className="text-black flex gap-2">
                    {carousel.discount ? (
                      <div className="line-through text-gray-500">
                        ${carousel.original_price}
                      </div>
                    ) : null}
                    <div>${carousel.price}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellerProduct;
