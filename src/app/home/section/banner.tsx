"use client";
import { useLocaleStore } from "@/app/component/locale";
import Page from "@/app/model/pageModel";
import { Loading } from "@/app/utilities/loading";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toastError } from "@/app/utilities/toast";
import { CarouselItem } from "@/app/model/carousel";

const Banner = () => {
  const [pages, setPages] = useState<CarouselItem[]>();
  const { locale } = useLocaleStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.CAROUSELS || "", { method: "GET" });

        if (!response.ok) {
          throw new Error(`Failed to fetch carousel items: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data)
        setPages(data.carousels);
      } catch (error: any) {
        toastError(error.message || "An unexpected error occurred.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
    return () => clearInterval(interval);
  }, [pages]);

  const totalSlides = pages?.length || 0;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  if (!pages || pages.length === 0) {
    return <Loading />;
  }

  const pageData = pages[currentSlide];
  const isEnglish = locale === "contentJSONEng";

  const title = isEnglish ? pageData.titleEng : pageData.titleIndo;
  const content = isEnglish ? pageData.contentEng : pageData.contentIndo;
  const buttonText = isEnglish ? pageData.buttonEng : pageData.buttonIndo;
  const backgroundImageUrl = process.env.BACK_BASE_URL + pageData.carouselImage;
  const backgroundImageUrlMobile = process.env.BACK_BASE_URL + pageData.carouselImageMobile;

  console.log(backgroundImageUrl, backgroundImageUrlMobile)

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 transition-transform duration-500 ease-out">
        {/* Default Background for Mobile */}
        <div
          className="absolute inset-0 bg-black/40"
          style={{
            backgroundImage: `url('${backgroundImageUrlMobile}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Background for Larger Screens */}
        <div
          className="hidden sm:block absolute inset-0 bg-black/40"
          style={{
            backgroundImage: `url('${backgroundImageUrl}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>


      {/* Content */}
      <div className="relative h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 p-6 max-w-7xl mx-auto">
        <div className="w-full lg:w-2/5 space-y-6 animate-fadeIn">
          <h1 className="text-white text-3xl lg:text-5xl font-bold text-center">
            {title}
          </h1>
          <p className="text-white text-lg leading-relaxed text-center">
            {content}
          </p>
          <div className="flex justify-center items-center">
            <Link
              href={pageData.link}
              className="bg-white text-stone-800 py-3 px-8 rounded-md text-lg font-medium 
                hover:bg-stone-800 hover:text-white transition-colors duration-300"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 
          rounded-full text-white transition-colors duration-300"
      >
        &lt;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 
          rounded-full text-white transition-colors duration-300"
      >
        &gt;
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {[...Array(totalSlides)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 
              ${currentSlide === index ? "bg-white w-6" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
