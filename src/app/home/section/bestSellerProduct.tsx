"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { renderStars } from "../../utilities/icons";
import { ExploreProduct } from "@/app/model/product";
import { toastError } from "@/app/utilities/toast";
import Link from "next/link";
import { useLocaleStore } from "@/app/component/locale";
import Page from "@/app/model/pageModel";
import { Loading } from "@/app/utilities/loading";

const BestSellerProduct = () => {
  const [products, setProducts] = useState<ExploreProduct[]>();
  const [page, setPages] = useState<Page[]>();
  const [lastDivisionResult, setLastDivisionResult] = useState<number>();
  const { locale, change } = useLocaleStore();
  const [flag, setFlag ] = useState(false)

  useEffect(() => {
    const handleScrollAnimation = () => {
      const bestSellerProductsComponent = document.querySelector('#best-seller-products');
      const bestSellerDescriptionComponent = document.querySelector('#best-seller-desc');

      if (bestSellerProductsComponent === null || bestSellerProductsComponent === undefined || bestSellerDescriptionComponent === null || bestSellerDescriptionComponent === undefined) return;

      const productsCompLeftPoint = bestSellerProductsComponent.scrollLeft; 
      const descriptionCompWidth = bestSellerDescriptionComponent.clientWidth;

      let percentageCovered = productsCompLeftPoint / descriptionCompWidth * 100;


      if (percentageCovered > 100) percentageCovered = 100;

      const divisionResult = Math.ceil(percentageCovered / 5);
      if (divisionResult !== lastDivisionResult) {
        setLastDivisionResult(divisionResult)
        let printedToClass = 100 - (divisionResult * 5 * 3); // divisionResult * 5 * speed to lower lg:opacity
        if (printedToClass < 0) printedToClass = 0;

        const printedClass = `lg:opacity-${printedToClass}`;

        bestSellerDescriptionComponent.classList.remove(
          "lg:opacity-100",
          "lg:opacity-95",
          "lg:opacity-90",
          "lg:opacity-85",
          "lg:opacity-80",
          "lg:opacity-75",
          "lg:opacity-70",
          "lg:opacity-65",
          "lg:opacity-60",
          "lg:opacity-55",
          "lg:opacity-50",
          "lg:opacity-45",
          "lg:opacity-40",
          "lg:opacity-35",
          "lg:opacity-30",
          "lg:opacity-25",
          "lg:opacity-20",
          "lg:opacity-15",
          "lg:opacity-10",
          "lg:opacity-5",
          "lg:opacity-0"
        );

        bestSellerDescriptionComponent.classList.add(printedClass);

        if (printedToClass === 100) {
          bestSellerDescriptionComponent.classList.add('z-10');
        } else if (bestSellerProductsComponent.classList.contains('z-10')) {
          bestSellerDescriptionComponent.classList.remove('z-10');
        }
      }
    }


    const bestSellerDescriptionComponent = document.querySelector('#best-seller-desc');
    bestSellerDescriptionComponent?.classList.add('lg:opacity-100');

    const bestSellerProductsComponent = document.querySelector('#best-seller-products');
    bestSellerProductsComponent?.addEventListener('scroll', handleScrollAnimation);

    return () => {
      bestSellerProductsComponent?.removeEventListener('scroll', handleScrollAnimation);
    }
  }, [flag]);

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
        setFlag(true)
      };

      fetchData();
    } catch (error: any) {
      toastError(error.message);
    }
  }, []);

  if(!flag){
    return <Loading/>
  }

  return (
    <div className="relative flex w-full h-auto lg:h-screen bg-stone-800 justify-center items-center gap-6 overflow-x-auto px-4 lg:px-20 py-6">
      {/* Fade effect container */}
      <div className="relative w-full">
      <div className="w-full h-full z-10 lg:w-3/5  text-center lg:text-left lg:absolute pl-4 lg:pl-12 pr-4 lg:pr-12 bg-stone-800" id="best-seller-desc">
          <div className="text-white text-3xl sm:text-4xl font-bold">
            {(page && page[0]?.[locale]?.[3]?.title) || "Loading"}
          </div>
          <div className="text-sm leading-8 tracking-wide mt-4 text-white text-justify">
            {(page && page[0]?.[locale]?.[3]?.content) || "Loading"}
          </div>
          <div className="border-white text-white border w-fit py-4 px-8 text-lg mt-4 mx-auto sm:mx-0">
            <Link href="/product">View More</Link>
          </div>
        </div>

        <div className="flex flex-col z-10 lg:flex-row gap-6 overflow-x-auto pl-4 lg:pl-12 pr-4 lg:pr-12" id="best-seller-products">
          {/* Content container */}
          <div className="lg:w-3/5 text-center sm:text-left hidden lg:flex opacity-0">
            <div className="text-white text-3xl sm:text-4xl font-bold">
              {(page && page[0]?.[locale]?.[3]?.title) || "Loading"}
            </div>
            <div className="text-sm leading-8 tracking-wide mt-4 text-white text-justify">
              {(page && page[0]?.[locale]?.[3]?.content) || "Loading"}
            </div>
            <div className="border-white text-white border w-fit py-4 px-8 text-lg mt-4 mx-auto sm:mx-0">
              <button>click here</button>
              <Link href="/product">View More</Link>
            </div>
          </div>

          {/* Product display */}
          <div className="w-2/3 lg:w-2/5 z-20 flex flex-nowrap justify-start gap-6 mt-6 lg:gap-12">
            
              {products?.map((product, idx) => (
                <Link
                  key={idx}
                  className="flex-shrink-0 w-full sm:w-[200px] lg:w-[300px]"
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
                    <div className="text-black font-semibold">
                      {product.productName}
                    </div>
                    <div className="text-black">
                      Rp. {product.product_variants[0].productPrice}
                    </div>
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