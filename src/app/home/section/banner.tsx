"use client";
import { useLocaleStore } from "@/app/component/locale";
import Page from "@/app/model/pageModel";
import { toastError } from "@/app/utilities/toast";
import Image from "next/image";
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

  const pageData = pages?.[0]?.[locale]?.[0] ?? {}; // Fallback for safe access to page data
  console.log(pages?.[0])
  console.log(pageData)
  console.log(process.env.BACK_BASE_URL)
  // Construct the background image URL
  const backgroundImageUrl = process.env.BACK_BASE_URL + (pageData.background || "");
  
  // Log the URL to see how it looks
  console.log("Background Image URL:", backgroundImageUrl);

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
        <h1 className="text-black text-2xl lg:text-5xl font-bold text-center lg:text-left">
          {pageData.title || "Loading..."}
        </h1>
        <p className="text-black mt-6 text-md text-justify lg:text-left">
          {pageData.content || "Loading..."}
        </p>
        <div className="mt-4 flex justify-start">
          <button className="bg-black text-white py-2 px-10 rounded-md">
            Check
          </button>
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
          <div className="text-center text-black">No Image Available</div>
        )}
      </div>
    </div>
  );
};

export default Banner;
