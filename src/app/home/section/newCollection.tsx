"use client";
import { useLocaleStore } from "@/app/component/locale";
import  Page  from "@/app/model/pageModel";
import { toastError } from "@/app/utilities/toast";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const NewCollection = () => {

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
    <div className="w-screen h-screen flex flex-col items-center pt-10 lg:pt-20">
      <div className="text-black text-6xl lg:text-5xl font-bold text-center">
      {page && page[0]?.[locale]?.[1]?.title || "No Title Available"}
      </div>
      <div className="text-black text-center text-sm pt-2 lg:mt-6 px-2 lg:px-0">
      {page && page[0]?.[locale]?.[1]?.content || "No Content Available"}
      </div>
      <div className="flex flex-col lg:flex-row h-3/5 w-2/3 items-center lg:justify-around mt-6">
        <Link href={"#"}>
          <Image
            src="/a.jpg"
            width={200}
            height={200}
            alt="logo pic"
            className="aspect-square w-[180px] h-1/3 lg:w-[400px] lg:h-[400px]"
          />
        </Link>
        <Link href={"#"}>
          <Image
            src="/a.jpg"
            width={200}
            height={200}
            alt="logo pic"
            className="aspect-square w-[180px] h-1/3 lg:w-[400px] lg:h-[400px]"
          />
        </Link><Link href={"#"}>
          <Image
            src="/a.jpg"
            width={200}
            height={200}
            alt="logo pic"
            className="aspect-square w-[180px] h-1/3 lg:w-[400px] lg:h-[400px]"
          />
        </Link>
      </div>
    </div>
  );
};

export default NewCollection;
