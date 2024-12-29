"use client";
import { useLocaleStore } from '@/app/component/locale';
import Page from '@/app/model/pageModel';
import { toastError } from '@/app/utilities/toast';
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
        console.log(res.pages);
        
        setPages(res.pages);
      };
      fetchData();
    } catch (error: any) {
      toastError(error.message);
    }
  }, []);

  return (
    <div className="w-full h-auto lg:h-screen flex flex-col lg:flex-row-reverse relative lg:justify-center pt-6 lg:pt-24 px-4 lg:px-0">
      {/* Left Section */}
      <div className="w-full lg:w-2/5 text-center lg:text-left">
        <div className="text-black text-3xl sm:text-4xl font-bold">
          {page && page[0]?.[locale]?.[2]?.title || "Loading"}
        </div>
        <div className="text-black text-sm text-justify mt-2 lg:mt-10">
          {page && page[0]?.[locale]?.[2]?.content || "Loading"}
        </div>
        {/* stats sections when */}
        <div className="hidden lg:flex bg-white text-black lg:w-fit shadow-2xl justify-between rounded-lg py-3 px-12 mt-6">
        <div className="border-r-2 pr-2 lg:pr-6 my-4 lg:my-6 border-black flex flex-col items-center">
          <div className="text-sm lg:text-3xl font-semibold">{page && page[0]?.[locale]?.[2]?.bestNumber1 || "Loading"}</div>
          <div className="text-xs lg:text-sm">{page && page[0]?.[locale]?.[2]?.bestTitle1 || "Loading"}</div>
        </div>
        <div className="px-2 lg:px-6 my-4 lg:my-6 flex flex-col items-center">
          <div className="text-sm lg:text-3xl font-semibold">{page && page[0]?.[locale]?.[2]?.bestNumber2 || "Loading"}</div>
          <div className="text-xs lg:text-sm">{page && page[0]?.[locale]?.[2]?.bestTitle2 || "Loading"}</div>
        </div>
        <div className="border-l-2 pl-2 lg:pl-6 my-4 lg:my-6 border-black flex flex-col items-center">
          <div className="text-sm lg:text-3xl font-semibold">{page && page[0]?.[locale]?.[2]?.bestNumber3 || "Loading"}</div>
          <div className="text-xs lg:text-sm">{page && page[0]?.[locale]?.[2]?.bestTitle3 || "Loading"}</div>
        </div>
      </div>
      </div>

      {/* Image Section */}
      <div className="w-full lg:w-2/5 flex justify-center lg:justify-start my-6 lg:mt-0">
        <Image
          src="/a.jpg"
          width={550}
          height={550}
          alt="logo pic"
          className="rounded-tl-banner w-[90%] max-w-[350px] lg:max-w-[550px] h-4/5"
        />
      </div>

      {/* Stats Section */}
      <div className=" lg:hidden flex bg-white text-black absolute bottom-8 left-1/2 transform -translate-x-1/2 py-3 px-6 justify-between rounded-lg shadow-2xl">
        <div className="border-r-2 pr-2 lg:pr-6 my-4 lg:my-6 border-black flex flex-col items-center">
          <div className="text-sm lg:text-3xl font-semibold">8900+</div>
          <div className="text-xs lg:text-sm">Interact</div>
        </div>
        <div className="px-2 lg:px-6 my-4 lg:my-6 flex flex-col items-center">
          <div className="text-sm lg:text-3xl font-semibold">3105+</div>
          <div className="text-xs lg:text-sm">Purchase</div>
        </div>
        <div className="border-l-2 pl-2 lg:pl-6 my-4 lg:my-6 border-black flex flex-col items-center">
          <div className="text-sm lg:text-3xl font-semibold">2014</div>
          <div className="text-xs lg:text-sm">Reviews</div>
        </div>
      </div>
    </div>
  );
};

export default BestItem;
