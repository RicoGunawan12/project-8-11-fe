"use client";
import { useLocaleStore } from "@/app/component/locale";
import Page from "@/app/model/pageModel";
import { toastError } from "@/app/utilities/toast";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Banner = () => {
  const [page, setPages] = useState<Page[]>();
  const { locale, change } = useLocaleStore();

  useEffect(() => {
    try {
      const fetchData = async () => {
        const req = await fetch(`${process.env.PAGES}`, {
          method: "GET",
        });

        const res = await req.json();

        setPages(res.pages);
      };

      fetchData();
    } catch (error: any) {
      toastError(error.message);
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full h-auto lg:h-screen justify-center items-center gap-8 lg:gap-24 bg-gradient-radial from-yellow-200 via-yellow-300 to-amber-500 p-6">
      <div className="w-full lg:w-2/5 pt-20 lg:pt-0">
        <h1 className="text-black text-2xl lg:text-5xl font-bold text-center lg:text-left">
          {page && page[0]?.[locale]?.[0]?.title || "Loading"}
        </h1>
        <p className="text-black mt-6 text-md text-justify lg:text-left">
          {page && page[0]?.[locale]?.[0]?.content || "Loading"}
        </p>
        <div className="mt-4 flex justify-start">
          <button className="bg-black text-white py-2 px-10 rounded-md">
            Check
          </button>
        </div>
      </div>

      <div className="w-full lg:w-2/5 h-auto lg:h-5/6 flex justify-center lg:justify-end pt-6 lg:pt-0">
        <Image
          src="/a.jpg"
          width={500}
          height={500}
          alt="Stylish cup"
          className="rounded-lg w-full lg:w-[500px] lg:h-[500px] object-cover"
        />
      </div>
    </div>
  );
};

export default Banner;
