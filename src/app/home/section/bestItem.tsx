"use client";
import { useLocaleStore } from '@/app/component/locale';
import Page from '@/app/model/pageModel';
import {Loading} from '@/app/utilities/loading';
import { toastError } from '@/app/utilities/toast';
import { Spinner } from '@nextui-org/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const BestItem = () => {
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

  if(!page){
    return <Loading/>
  }

  return (
    <div className="w-full h-auto lg:h-screen flex flex-col lg:flex-row-reverse bg-primary relative lg:justify-center pt-6 lg:pt-24 px-4 lg:px-0">
      {/* Left Section */}
      <div className="w-full lg:w-2/5 text-center lg:text-left">
        <div className="text-black text-3xl sm:text-4xl font-bold">
          {page && page[0]?.[locale]?.[2]?.title || ""}
        </div>
        <div className="text-black text-sm text-justify mt-2 lg:mt-10">
          {page && page[0]?.[locale]?.[2]?.content || ""}
        </div>
        {/* stats sections when */}
        <div className="hidden lg:flex bg-white text-black lg:w-fit shadow-2xl justify-between rounded-lg py-3 px-12 mt-6">
          <div className="border-r-2 pr-2 lg:pr-6 my-4 lg:my-6 border-black flex flex-col items-center">
            <div className="text-sm lg:text-3xl font-semibold">{page && page[0]?.[locale]?.[2]?.bestNumber1 || ""}</div>
            <div className="text-xs lg:text-sm">{page && page[0]?.[locale]?.[2]?.bestTitle1 || null}</div>
          </div>
          <div className="px-2 lg:px-6 my-4 lg:my-6 flex flex-col items-center">
            <div className="text-sm lg:text-3xl font-semibold">{page && page[0]?.[locale]?.[2]?.bestNumber2 || ""}</div>
            <div className="text-xs lg:text-sm">{page && page[0]?.[locale]?.[2]?.bestTitle2 || null}</div>
          </div>
          <div className="border-l-2 pl-2 lg:pl-6 my-4 lg:my-6 border-black flex flex-col items-center">
            <div className="text-sm lg:text-3xl font-semibold">{page && page[0]?.[locale]?.[2]?.bestNumber3 || ""}</div>
            <div className="text-xs lg:text-sm">{page && page[0]?.[locale]?.[2]?.bestTitle3 || null}</div>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full lg:w-2/5 flex justify-center lg:justify-start lg:mt-0">
        <Image
          src={`${process.env.BACK_BASE_URL}${page[0]?.[locale]?.[2]?.photo}`}
          width={550}
          height={550}
          alt="logo pic"
          className="rounded-tl-banner w-[90%] max-w-[350px] lg:max-w-[550px] h-[85%]"
        />
      </div>

      {/* Stats Section */}
      <div className="flex lg:hidden bg-white text-black lg:w-fit shadow-2xl justify-between rounded-lg py-3 px-12 mt-6">
          <div className="border-r-2 pr-2 lg:pr-6 my-4 lg:my-6 border-black flex flex-col items-center">
            <div className="text-sm lg:text-3xl font-semibold">{page && page[0]?.[locale]?.[2]?.bestNumber1 || ""}</div>
            <div className="text-xs lg:text-sm">{page && page[0]?.[locale]?.[2]?.bestTitle1 || null}</div>
          </div>
          <div className="px-2 lg:px-6 my-4 lg:my-6 flex flex-col items-center">
            <div className="text-sm lg:text-3xl font-semibold">{page && page[0]?.[locale]?.[2]?.bestNumber2 || ""}</div>
            <div className="text-xs lg:text-sm">{page && page[0]?.[locale]?.[2]?.bestTitle2 || null}</div>
          </div>
          <div className="border-l-2 pl-2 lg:pl-6 my-4 lg:my-6 border-black flex flex-col items-center">
            <div className="text-sm lg:text-3xl font-semibold">{page && page[0]?.[locale]?.[2]?.bestNumber3 || ""}</div>
            <div className="text-xs lg:text-sm">{page && page[0]?.[locale]?.[2]?.bestTitle3 || null}</div>
          </div>
        </div>
      </div>
  );
};

export default BestItem;
