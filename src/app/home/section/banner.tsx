"use client";
import { useLocaleStore } from "@/app/component/locale";
import Page from "@/app/model/pageModel";
import { Loading } from "@/app/utilities/loading";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
import { toastError } from "@/app/utilities/toast";

// Dummy data
const dummyPages: Page[] = [
  {
    contentJSONEng: [
      {
        content: "Discover our latest collection of premium coffee beans sourced from the finest regions around the world. Each bean is carefully selected and roasted to perfection.",
        page: "home",
        pageId: "1",
        title: "Premium Coffee Selection",
        photo: "/a.jpg",
        background: "/banner.jpg"
      },
      {
        content: "Experience the art of coffee making with our handcrafted equipment. From pour-over sets to espresso machines, we have everything you need.",
        page: "home",
        pageId: "2",
        title: "Coffee Equipment",
        photo: "/a.jpg",
        background: "/banner.jpg"
      },
      {
        content: "Join our coffee workshops and learn from expert baristas. Master the techniques of brewing the perfect cup of coffee.",
        page: "home",
        pageId: "3",
        title: "Coffee Workshops",
        photo: "/a.jpg",
        background: "/banner.jpg"
      }
    ],
    contentJSONIndo: [
      {
        content: "Temukan koleksi biji kopi premium kami yang bersumber dari wilayah terbaik di seluruh dunia. Setiap biji dipilih dengan cermat dan dipanggang hingga sempurna.",
        page: "home",
        pageId: "1",
        title: "Pilihan Kopi Premium",
        photo: "/a.jpg",
        background: "/banner.jpg"
      },
      {
        content: "Rasakan seni membuat kopi dengan peralatan buatan tangan kami. Dari set pour-over hingga mesin espresso, kami memiliki semua yang Anda butuhkan.",
        page: "home",
        pageId: "2",
        title: "Peralatan Kopi berubah",
        photo: "/a.jpg",
        background: "/banner.jpg"
      },
      {
        content: "Bergabunglah dengan workshop kopi kami dan belajar dari barista ahli. Kuasai teknik menyeduh secangkir kopi yang sempurna.",
        page: "home",
        pageId: "3",
        title: "Workshop Kopi",
        photo: "/a.jpg",
        background: "/banner.jpg"
      }
    ]
  }
];

const Banner = () => {
  const [pages, setPages] = useState<Page[]>(dummyPages);
  const { locale } = useLocaleStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const pageContents = pages[0][locale];
  const totalSlides = pageContents.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.PAGES || "", { method: "GET" });

        if (!response.ok) {
          throw new Error(`Failed to fetch pages: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data)
        // setPages(data.pages);
      } catch (error: any) {
        toastError(error.message || "An unexpected error occurred.");
      }
    };

    fetchData();
  }, []);

  if (!pages) {
    return <Loading />;
  }

  const pageData = pageContents[currentSlide];
  // const backgroundImageUrl = process.env.BACK_BASE_URL + (pageData.background || "");
  const backgroundImageUrl = pageData.background

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{
          backgroundImage: `url('${backgroundImageUrl}')`,
          // backgroundImage: {backgroundImageUrl},
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 p-6 max-w-7xl mx-auto">
        <div className="w-full lg:w-2/5 space-y-6 animate-fadeIn">
          <h1 className="text-white text-3xl lg:text-5xl font-bold text-center">
            {pageData.title}
          </h1>
          <p className="text-white text-lg leading-relaxed text-center ">
            {pageData.content}
          </p>
          <div className="flex justify-center">
            <Link
              href="/product"
              className="bg-white text-stone-800 py-3 px-8 rounded-md text-lg font-medium 
                hover:bg-stone-800 hover:text-white transition-colors duration-300"
            >
              Explore
            </Link>
          </div>
        </div>

        {/* <div className="w-full lg:w-2/5 animate-fadeIn">
          {pageData.photo && (
            <div className="relative aspect-square max-w-[500px] mx-auto">
              <Image
                // src={`${process.env.BACK_BASE_URL}${pageData.photo}`}
                src={pageData.photo}
                fill
                alt="Banner photo"
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div> */}
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
              ${currentSlide === index ? 'bg-white w-6' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;