"use client";
import { useLocaleStore } from "@/app/component/locale";
import Page from "@/app/model/pageModel";
import { ProductCard } from "@/app/model/productCard";
import { toastError } from "@/app/utilities/toast";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const NewCollection = () => {
  const [page, setPages] = useState<Page[]>();
  const { locale, change } = useLocaleStore();
  const [data, setData] = useState<ProductCard[]>([])

  useEffect(() => {
    try {
      const fetchData = async () => {
        const req = await fetch(`${process.env.PAGES}`, {
          method: "GET",
        });

        const res = await req.json();

        setPages(res.pages);

        const dataReq = await fetch(`${process.env.PRODUCTS}/newest`, {
          method: "GET",
        });

        const dataRes = await dataReq.json();

        console.log(dataRes)
        setData(dataRes.products)
      };

      fetchData();
    } catch (error: any) {
      toastError(error.message);
    }
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-10 lg:pt-20 px-4 lg:px-0">
      <div className="text-black text-3xl lg:text-4xl font-bold text-center">
        {page && page[0]?.[locale]?.[1]?.title || "Loading"}
      </div>
      <div className="text-black text-center text-sm pt-2 px-6 lg:mt-6 lg:w-1/2">
        {page && page[0]?.[locale]?.[1]?.content || "Loading"}
      </div>

      <div className="flex flex-col lg:flex-row w-full lg:w-2/3 h-auto lg:h-3/5 items-center lg:justify-around mt-6 gap-4">
        {
          data.map((datum: ProductCard) => {
            return (
              <Link href={`/product/${datum.productId}`} className="w-full lg:w-[300px] flex flex-col items-center justify-center">
                <Image
                  src={`${process.env.BACK_BASE_URL}${datum.defaultImage}`}
                  width={400}
                  height={400}
                  alt="logo pic"
                  className="aspect-square w-1/2 h-auto lg:w-[400px] lg:h-[400px] object-cover"
                />
                <div className="w-full text-center font-semibold text-black text-md">
                  {datum.productName}
                </div>
                <div className="w-full text-center text-black text-md">
                  Rp. {datum.product_variants[0].productPrice}
                </div>
              </Link>
            )
          })
        }
      </div>
    </div>
  );
};

export default NewCollection;
