"use client";
import { useLocaleStore } from "@/app/component/locale";
import { Page } from "@/app/model/page";
import { toastError } from "@/app/utilities/toast";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Banner = () => {

  const [page, setPages] = useState<Page[]>();
  const {locale, change} = useLocaleStore()

  useEffect(()=> {

    try {
      
      const fetchData = async() => {

        const req = await fetch(`${process.env.PAGES}`, {
          method: "GET"
        })

        const res = await req.json()

        console.log(res.pages)
        setPages(res.pages)

      }

      fetchData()

    } catch (error:any) {
toastError(error.message)
    }

  }, [])

  return (
    <div className="flex flex-col lg:flex-row w-screen h-screen justify-center items-center gap-24 bg-gradient-radial from-yellow-200 via-yellow-300 to-amber-500 p-6">
      <div className="lg:w-2/5 pt-20 lg:pt-0">
        <h1 className="text-black text-xl lg:text-5xl font-bold">
        {page && page[0]?.[locale]?.[0]?.title || "No Title Available"}
        </h1>
        <p className="text-black mt-6 text-md">
        {page && page[0]?.[locale]?.[0]?.content || "No Content Available"}
        </p>
        <div className="mt-2">
          <button className="bg-black text-white py-2 px-10">
            Check
          </button>
        </div>
      </div>
      <div className="lg:w-2/5 h-5/6 lg:h-auto pt-6 lg:pt-0 flex justify-end lg:justify-center">
        <Image
          src="/a.jpg"
          width={500}
          height={500}
          alt="Stylish cup"
          className="rounded-bl-banner w-full lg:w-[500px] lg:h-[500px] object-cover"
        />
      </div>
    </div>
  );
};

export default Banner;
