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
      <div className="relative w-full">
        <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pl-4 lg:pl-12 pr-4 lg:pr-12">
          {/* Content container */}
          <div className="w-full sm:w-3/5 lg:w-2/5 text-center sm:text-left">
            <div className="text-white text-3xl sm:text-4xl font-bold">
              {page && page[0]?.[locale]?.[3]?.title || "Loading"}
            </div>
            <div className="text-sm leading-8 tracking-wide mt-4 text-white text-justify">
              {page && page[0]?.[locale]?.[3]?.content || "Loading"}
            </div>
            <div className="border-white text-white border w-fit py-4 px-8 text-lg mt-4 mx-auto sm:mx-0">
              <button>click here</button>
            </div>
          </div>

          {/* Product display */}
          <div className="w-full lg:w-3/5 flex flex-wrap lg:flex-nowrap justify-center lg:justify-start gap-6 lg:gap-12">
            {products?.map((product, idx) => (
              <Link
                key={idx}
                className="flex-shrink-0 w-full sm:w-[150px] lg:w-[300px]"
                href={`/product/${product.productId}`}
              >
                <Image
                  src={`${process.env.BACK_BASE_URL}${product.defaultImage}`}
                  width={400}
                  height={550}
                  alt="logo pic"
                  className="w-full h-[300px] object-cover"
                />
                <div className="bg-white py-6 px-10">
                  {/* <div className="text-black">{renderStars(product.)}</div> */}
                  <div className="text-black font-semibold">{product.productName}</div>
                  <div className="text-black">Rp. {product.product_variants[0].productPrice}</div>
                  {/* <div className="text-black flex gap-2">
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
