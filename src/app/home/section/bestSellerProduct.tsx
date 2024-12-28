"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { renderStars } from '../../utilities/icons';
import { ExploreProduct } from "@/app/model/product";
import { toastError } from "@/app/utilities/toast";
import Link from "next/link";
import { useLocaleStore } from "@/app/component/locale";
import Page from "@/app/model/pageModel";

const BestSellerProduct = () => {
  const [products, setProducts] = useState<ExploreProduct[]>();
  const [page, setPages] = useState<Page[]>();
  const { locale, change } = useLocaleStore();

  useEffect(() => {
    try {
      const fetchData = async () => {
        const req = await fetch(`${process.env.PRODUCTS}/bestseller`, {
          method: "GET",
        });

        const result = await req.json();
        setProducts(result.bestSellerProduct);

        const reqs = await fetch(`${process.env.PAGES}`, {
          method: "GET",
        });

        const res = await reqs.json();
        setPages(res.pages);
      };

      fetchData();
    } catch (error: any) {
      toastError(error.message);
    }
  }, []);

  return (
    <div className="relative flex w-full h-auto lg:h-screen bg-stone-800 justify-center items-center gap-6 overflow-x-auto px-4 lg:px-20 py-10">
      {/* Fade effect container */}
      <div className="relative w-full before:absolute before:top-0 before:bottom-0 before:left-0 before:w-12 before:bg-gradient-to-r before:from-stone-800 before:to-transparent before:pointer-events-none after:absolute after:top-0 after:bottom-0 after:right-0 after:w-12 after:bg-gradient-to-l after:from-stone-800 after:to-transparent after:pointer-events-none">
        <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pl-4 lg:pl-12 pr-4 lg:pr-12">
          {/* Content container */}
          <div className="w-full lg:w-2/5 text-center lg:text-left">
            <div className="text-white text-3xl lg:text-4xl font-bold">
              {page && page[0]?.[locale]?.[3]?.title || "Loading"}
            </div>
            <div className="text-sm leading-8 tracking-wide mt-4 text-white text-justify">
              {page && page[0]?.[locale]?.[3]?.content || "Loading"}
            </div>
            <div className="border-white text-white border w-fit py-6 px-16 text-lg mt-4 mx-auto lg:mx-0">
              <button>click here</button>
            </div>
          </div>

          {/* Product display */}
          <div className="w-full lg:w-3/5 flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-12">
            {products?.map((product, idx) => (
              <Link
                key={idx}
                className="flex-shrink-0 w-full sm:w-[200px] lg:w-[400px]"
                href={`/product/${product.productId}`}
              >
                <Image
                  src={`${process.env.BACK_BASE_URL}${product.defaultImage}`}
                  width={400}
                  height={550}
                  alt="logo pic"
                  className="w-full h-[450px] object-cover"
                />
                <div className="bg-white py-6 px-10">
                  {/* <div className="text-black">{renderStars(product.)}</div> */}
                  <div className="text-black">{product.productName}</div>
                  {/* <div className="text-black flex gap-2">
                    <div>Rp. {product.product_variants[0].productPrice}</div>
                  </div> */}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellerProduct;
