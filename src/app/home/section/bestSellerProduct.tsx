"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { renderStars } from '../../utilities/icons';
import { ExploreProduct} from "@/app/model/product";
import { toastError } from "@/app/utilities/toast";
import Link from "next/link";
import { useLocaleStore } from "@/app/component/locale";
import  Page  from "@/app/model/pageModel";

const BestSellerProduct = () => {

  const [products, setProducts] = useState<ExploreProduct[]>();
  const [page, setPages] = useState<Page[]>();
  const {locale, change} = useLocaleStore()

  useEffect(() => {
    try {
      
      const fetchData = async() => {

        const req = await fetch(`${process.env.PRODUCTS}/bestseller`, {
          method: "GET"
        })

        const result = await req.json()

        console.log(result)

        setProducts(result.bestSellerProduct)

        const reqs = await fetch(`${process.env.PAGES}`, {
          method: "GET"
        })

        const res = await reqs.json()

        console.log(res.pages)
        setPages(res.pages)
      }

      fetchData()

    } catch (error : any) {
      toastError(error.mesasge)
    }
  }, [])

  return (
    <div className="relative flex w-screen h-screen bg-stone-800 justify-center items-center gap-6 overflow-x-auto px-20">
      {/* Fade effect container */}
      <div className="relative w-full before:absolute before:top-0 before:bottom-0 before:left-0 before:w-12 before:bg-gradient-to-r before:from-stone-800 before:to-transparent before:pointer-events-none after:absolute after:top-0 after:bottom-0 after:right-0 after:w-12 after:bg-gradient-to-l after:from-stone-800 after:to-transparent after:pointer-events-none">
        <div className="flex gap-6 overflow-x-auto pl-12 pr-12">
          {/* Content container */}
          <div className="w-2/5">
            <div className="text-white text-8xl font-bold">
            {page && page[0]?.[locale]?.[3]?.title || "No Title Available"}
            </div>
            <div className="text-lg mt-4 text-white">
            {page && page[0]?.[locale]?.[3]?.content || "No Content Available"}
            </div>
            <div className="border-white text-white border w-fit px-6 py-2 mt-4">
              <button>click here</button>
            </div>
          </div>

          <div className="w-2/5 flex gap-12">
            {products?.map((product, idx) => (
              <Link key={idx} className="flex-shrink-0" href={`/product/${product.productId}`}>
                <Image
                  src={`${process.env.BACK_BASE_URL}${product.defaultImage}`}
                  width={400}
                  height={550}
                  alt="logo pic"
                  className="rounded-t-3xl w-[400px] h-[450px]"
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
