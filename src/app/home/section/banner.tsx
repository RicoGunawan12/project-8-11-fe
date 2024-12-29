"use client";
import { useLocaleStore } from "@/app/component/locale";
import Page from "@/app/model/pageModel";
import {Loading} from "@/app/utilities/loading";
import { toastError } from "@/app/utilities/toast";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Banner = () => {
  const [pages, setPages] = useState<Page[] | undefined>(undefined);
  const { locale } = useLocaleStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.PAGES || "", { method: "GET" });

        if (!response.ok) {
          throw new Error(`Failed to fetch pages: ${response.statusText}`);
        }

        const data = await response.json();
        setPages(data.pages);
      } catch (error: any) {
        toastError(error.message || "An unexpected error occurred.");
      }
    };

    fetchData();
  }, []);

  const pageData : any = pages?.[0]?.[locale]?.[0] ?? {}; // Fallback for safe access to page data
  const backgroundImageUrl = process.env.BACK_BASE_URL + (pageData.background || "");
  
  if(!pages){
    return <Loading/>
  }

  return (
    <div
      className="flex flex-col lg:flex-row w-full h-auto lg:h-screen justify-center items-center gap-8 lg:gap-24 p-6"
      style={{
        backgroundImage: `url('${backgroundImageUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full lg:w-2/5 pt-20 lg:pt-0">
        <h1 className="text-white text-2xl lg:text-5xl font-bold text-center lg:text-left">
          {pageData.title || ""}
        </h1>
        <p className="text-white mt-6 text-md text-justify lg:text-left">
          {pageData.content || ""}
        </p>
        <div className="mt-4 flex justify-start">
          <Link href={"/product"} className="bg-secondary text-white py-2 px-10 rounded-md">
            Explore
          </Link>
        </div>
      </div>

      <div className="w-full lg:w-2/5 h-auto lg:h-5/6 flex justify-center lg:items-center pt-6 lg:pt-0">
        {pageData.photo ? (
          <Image
            src={`${process.env.BACK_BASE_URL}${pageData.photo}`}
            width={500}
            height={500}
            alt="Banner photo"
            className="rounded-lg w-full lg:w-[500px] lg:h-[500px] object-cover"
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Banner;
