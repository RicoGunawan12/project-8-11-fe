"use client";
import { useLocaleStore } from "@/app/component/locale";
import { Categories } from "@/app/model/category";
import Page from "@/app/model/pageModel";
import { ProductCard } from "@/app/model/productCard";
import {Loading} from "@/app/utilities/loading";
import { toastError } from "@/app/utilities/toast";
import { Spinner } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const NewCollection = () => {
  const [page, setPages] = useState<Page[]>();
  const { locale, change } = useLocaleStore();
  const [data, setData] = useState<Categories[]>([])

  useEffect(() => {
    try {
      const fetchData = async () => {
        const req = await fetch(`${process.env.PAGES}`, {
          method: "GET",
        });

        const res = await req.json();

        setPages(res.pages);

        const dataReq = await fetch(`${process.env.CATEGORIES}?limit=6`, {
          method: "GET",
        });

        const dataRes = await dataReq.json();

        setData(dataRes)
      };

      fetchData();
    } catch (error: any) {
      toastError(error.message);
    }
  }, []);

  if(!page){
    return <Loading/>
  }

  return (
    <div className="w-full h-auto flex flex-col items-center py-10 lg:py-20 px-4 lg:px-0">
      <div className="text-black text-3xl lg:text-4xl font-bold text-center">
        {page && page[0]?.[locale]?.[1]?.title || ""}
      </div>
      <div className="text-black text-center text-sm pt-2 px-6 lg:mt-6 lg:w-1/2">
        {page && page[0]?.[locale]?.[1]?.content || ""}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 flex-wrap lg:flex-row w-full lg:w-3/4 h-auto lg:h-3/5 items-center lg:justify-around mt-6 gap-4">
        {
          data.map((datum: Categories) => {
            return (
              <Link key={datum.productCategoryId} href={`/product?category=${encodeURIComponent(datum.productCategoryName)}`} className="w-full flex flex-col items-center justify-center">
                <Image
                  src={`${process.env.BACK_BASE_URL}${datum.productCategoryPhoto}`}
                  width={400}
                  height={400}
                  alt="logo pic"
                  className="aspect-square object-cover"
                  priority
                />
                <div className="w-full text-center font-semibold text-black text-md">
                  {datum.productCategoryName}
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
