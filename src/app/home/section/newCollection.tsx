"use client";
import { useLocaleStore } from "@/app/component/locale";
import Page from "@/app/model/pageModel";
import { toastError } from "@/app/utilities/toast";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const NewCollection = () => {
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
    <div className="w-full min-h-screen flex flex-col items-center pt-10 lg:pt-20 px-4 lg:px-0">
      <div className="text-black text-4xl lg:text-6xl font-bold text-center">
        {page && page[0]?.[locale]?.[1]?.title || "Loading"}
      </div>
      <div className="text-black text-justify text-sm pt-2 lg:mt-6">
        {page && page[0]?.[locale]?.[1]?.content || "Loading"}
      </div>

      <div className="flex flex-col lg:flex-row w-full lg:w-2/3 h-auto lg:h-3/5 items-center lg:justify-around mt-6 gap-4">
        <Link href={"#"} className="w-full lg:w-[300px]">
          <Image
            src="/a.jpg"
            width={400}
            height={400}
            alt="logo pic"
            className="aspect-square w-full h-auto lg:w-[400px] lg:h-[400px] object-cover"
          />
        </Link>
        <Link href={"#"} className="w-full lg:w-[300px]">
          <Image
            src="/a.jpg"
            width={400}
            height={400}
            alt="logo pic"
            className="aspect-square w-full h-auto lg:w-[400px] lg:h-[400px] object-cover"
          />
        </Link>
        <Link href={"#"} className="w-full lg:w-[300px]">
          <Image
            src="/a.jpg"
            width={400}
            height={400}
            alt="logo pic"
            className="aspect-square w-full h-auto lg:w-[400px] lg:h-[400px] object-cover"
          />
        </Link>
      </div>
    </div>
  );
};

export default NewCollection;
