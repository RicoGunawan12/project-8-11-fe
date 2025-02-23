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
  const [flag, setFlag] = useState(false)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Handle window resize and set initial mobile state
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // 640px is Tailwind's 'sm' breakpoint
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

        // if (printedToClass === 100) {
        //   bestSellerDescriptionComponent.classList.add('z-10');
        // } else if (bestSellerProductsComponent.classList.contains('z-10')) {
        //   bestSellerDescriptionComponent.classList.remove('z-10');
        // }
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

  if (!flag) {
    return <Loading />
  }

  return (
    <div className="relative flex w-full h-auto lg:h-auto bg-stone-800 justify-center items-center gap-6 overflow-x-auto px-6 lg:px-20 py-6 lg:py-24">
      {/* Fade effect container */}
      <div className="relative w-full h-full flex flex-col lg:flex-row items-center">
        <div className="w-full h-full lg:w-3/5 lg:pr-6 text-center flex flex-col justify-center items-center lg:items-start lg:text-left lg:absolute bg-stone-800" id="best-seller-desc">
          <div className="text-white z-10 text-3xl sm:text-4xl font-bold">
            {(page && page[0]?.[locale]?.[3]?.title) || "Loading"}
          </div>
          <div className="text-sm leading-8 z-10 tracking-wide mt-4 text-white text-justify">
            {(page && page[0]?.[locale]?.[3]?.content) || "Loading"}
          </div>
          <div className="border-white relative z-50 text-white border w-fit py-2 px-4 lg:py-4 lg:px-8 text-lg mt-4 mx-auto sm:mx-0">
            <Link href="/product">View More</Link>
          </div>
        </div>

        <div className="flex flex-col w-full h-full z-10 lg:flex-row gap-6 items-center overflow-x-auto" id="best-seller-products">
          {/* Content container */}
          <div className="lg:w-3/5 text-center sm:text-left hidden lg:flex opacity-0">
            <div className="text-white text-3xl sm:text-4xl font-bold">
              {(page && page[0]?.[locale]?.[3]?.title) || "Loading"}
            </div>
            <div className="text-sm leading-8 tracking-wide mt-4 text-white text-justify">
              {(page && page[0]?.[locale]?.[3]?.content) || "Loading"}
            </div>
            <div className="border-white text-white border w-full py-2 px-4 lg:py-4 lg:px-8 text-lg mt-4 mx-auto sm:mx-0">
              {/* <button>click here</button> */}
              <Link href="/product">View More</Link>
            </div>
          </div>

          {/* Product display */}
          <div className={`w-full z-20 flex h-full ${isMobile ? "overflow-x-auto" : ""} scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 gap-4 lg:gap-12 mt-6 lg:w-2/5 lg:items-center`}>
            {products?.map((product, idx) => (
              <Link
                key={idx}
                className="flex-shrink-0 w-[75%] sm:w-[200px] lg:w-[300px]"
                href={`/product/${product.productId}`}
              >
                <Image
                  src={product.product_covers[0] ? process.env.BACK_BASE_URL +  product.product_covers[0].productCover : "/placeholder.webp"}
                  width={400}
                  height={550}
                  alt="logo pic"
                  className="w-full h-[300px] object-cover"
                  priority
                />
                <div className="bg-white py-6 px-10 h-[100px]">
                  <div className="text-black font-semibold truncate">{product.productName}</div>
                  <div className="text-black">
                    Rp. {product.product_variants[0]?.productPrice}
                  </div>
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