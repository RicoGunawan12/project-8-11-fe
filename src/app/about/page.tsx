"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import NavigationBar from "../component/navbar";
import Footer from "../component/footer";
import Banner from "../component/banner";
import { toastError } from "../utilities/toast";
import { useLocaleStore } from "../component/locale";
import { AboutPage } from "../model/aboutPage";

const AboutUsPage = () => {

  const [page, setPage] = useState<AboutPage[]>()
  const {locale, change} = useLocaleStore()

  useEffect(() => {

    const fetchData = async() => {

      try {
        
        const response = await fetch(`${process.env.PAGES}/about`,{
          method: "GET"
        })

        const result = await response.json()

        setPage(result.response)

      } catch (error: any) {
        toastError(error.message)
      }
      
    }

    fetchData()

  }, [])

  return (
    <div className="flex flex-col h-screen bg-white">
      <NavigationBar />
      <div className="mt-20 flex-grow">
      <Banner page="About Page" text="About Us" />
      <div className="text-black flex flex-col items-center tracking-widest leading-[2]">
  <h1 className="font-bold text-5xl mt-12">
    Hello! We make water bottles
  </h1>
  <h2 className="mt-12 font-semibold text-lg w-3/5">
    {page && (locale === "contentJSONEng" 
      ? page[0]?.titleEng 
      : page[0]?.titleIndo) || "Loading"}
  </h2>
  <div className="mt-6 w-3/5">
  {page && (locale === "contentJSONEng" 
      ? page[0]?.contentEng 
      : page[0]?.contentIndo) || "Loading"}
  </div>
  <div className="w-full flex items-center flex-col bg-secondary mt-6 py-8">
  <h1 className="text-white text-2xl font-semibold">Why you should choose TYESO?</h1>
  <div className="flex w-full justify-center flex-wrap gap-12 my-6 px-6">
    {/* Product 1 */}
    <div className="flex flex-col items-center max-w-xs">
      <img
        src="/a.jpg"
        alt="Product 1"
        className="w-32 h-32 object-cover rounded-lg shadow-md"
      />
      <p className="mt-4 text-white text-justify text-xs font-light">
        Tumbler eksklusif dengan bahan premium, memberikan kualitas tinggi dan daya tahan maksimal.
      </p>
    </div>

    {/* Product 2 */}
    <div className="flex flex-col items-center max-w-xs">
      <img
        src="/a.jpg"
        alt="Product 2"
        className="w-32 h-32 object-cover rounded-lg shadow-md"
      />
      <p className="mt-4 text-white text-justify text-xs font-light">
        Dirancang untuk menjaga suhu minuman, memberikan pengalaman minum yang optimal dalam berbagai kondisi.
      </p>
    </div>

    {/* Product 3 */}
    <div className="flex flex-col items-center max-w-xs">
      <img
        src="/a.jpg"
        alt="Product 3"
        className="w-32 h-32 object-cover rounded-lg shadow-md"
      />
      <p className="mt-4 text-white text-justify text-xs font-light">
        Tampil stylish dan modern dengan berbagai pilihan desain yang trendi, menjadikannya aksesori gaya hidup yang sempurna.
      </p>
    </div>

    {/* Product 4 */}
    <div className="flex flex-col items-center max-w-xs">
      <img
        src="/a.jpg"
        alt="Product 4"
        className="w-32 h-32 object-cover rounded-lg shadow-md"
      />
      <p className="mt-4 text-white text-justify text-xs font-light">
        Dibuat dari material ramah lingkungan yang dapat didaur ulang, mendukung gaya hidup berkelanjutan dan mengurangi penggunaan kemasan sekali pakai.
      </p>
    </div>
  </div>
</div>


          <button className="mt-6 bg-secondary text-white font-medium border-2  transition duration-500 hover:bg-white hover:border-secondary hover:border-2 hover:text-secondary py-2 px-4 rounded-full">
            See Our Product
          </button>
        </div>
      </div>
        <Footer />
    </div>
  );
};

export default AboutUsPage;
