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
      <div className="w-full lg:w-2/5">
        <div className="text-black pl-6 lg:pl-0 text-3xl lg:text-5xl font-bold">{page && page[0]?.[locale]?.[2]?.title || "No Title Available"}</div>
        <div className="text-black pl-6 lg:pl-0 text-sm mt-2 lg:mt-10">
        {page && page[0]?.[locale]?.[2]?.content || "No Content Available"}
        </div>
      </div>
      <div className="w-full lg:w-2/5 flex justify-start pl-6">
        <Image
          src="/a.jpg"
          width={550}
          height={550}
          alt="logo pic"
          className="rounded-tl-banner w-[350px] h-[600px] lg:w-[550px] lg:h-[550px]"
        />
      </div>
      <div className="flex bg-white text-black absolute bottom-10 right-6 lg:bottom-80 w-4/5 lg:w-1/3 lg:right-[510px] shadow-2xl justify-around">
        <div className="border-r-2 pr-2 lg:pr-6 my-6 border-black flex flex-col items-center">
          <div className="text-md lg:text-3xl font-semibold">8900+</div>
          <div className='text-sm'>Interact</div>
        </div>
        <div className="pr-1 pl-1 lg:pr-3 lg:pl-3 my-6 border-black flex flex-col items-center">
          <div className="text-md lg:text-3xl font-semibold">3105+</div>
          <div className='text-sm'>Purchase</div>
        </div>
        <div className="border-l-2 pl-2 lg:pl-6 my-6 border-black flex flex-col items-center">

          <div className="text-md lg:text-3xl font-semibold">2014</div>
          <div className='text-sm'>Reviews</div>
        </div>
      </div>
    </div>
  );
}

export default BestItem
