"use client"
import { useLocaleStore } from '@/app/component/locale';
import  Page  from '@/app/model/pageModel';
import { toastError } from '@/app/utilities/toast';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

const BestItem = () => {

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
    <div className="w-screen h-screen flex flex-col lg:flex-row-reverse relative lg:justify-center pt-6 lg:pt-32">
      {/* Left Section */}
      <div className="w-full lg:w-2/5 px-6 lg:px-0">
        <div className="text-black text-3xl lg:text-5xl font-bold">
          {page && page[0]?.[locale]?.[2]?.title || "Loading"}
        </div>
        <div className="text-black text-sm mt-2 lg:mt-10">
          {page && page[0]?.[locale]?.[2]?.content || "Loading"}
        </div>
      </div>
  
      {/* Image Section */}
      <div className="w-full lg:w-2/5 flex justify-center lg:justify-start px-6 lg:pr-6">
        <Image
          src="/a.jpg"
          width={550}
          height={550}
          alt="logo pic"
          className="rounded-tl-banner w-[90%] max-w-[350px] lg:max-w-[550px] h-4/5"
        />
      </div>
  
      {/* Stats Section */}
      <div className="flex bg-white text-black absolute bottom-6 right-4 md:right-[250px] md:bottom-[50px] w-[90%] lg:bottom-40 md:w-fit lg:w-2/5 shadow-2xl justify-between rounded-lg p-3 lg:p-4">
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
  

}

export default BestItem
