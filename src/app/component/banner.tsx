"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Loading } from "../utilities/loading";

interface BannerProps {
  page: string;
  text: string;
}

interface BannerData {
  bannerId: string;
  page: string;
  image: string;
}

const Banner: React.FC<BannerProps> = ({ page, text }) => {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [mobileBanner, setMobileBanner] = useState<BannerData | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Handle window resize and set initial mobile state
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // 640px is Tailwind's 'sm' breakpoint
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Fetch banners from the API
    const fetchBanner = async () => {
      try {
        const response = await fetch(`${process.env.BANNERS}`);
        const data = (await response.json()).banners;
        const selectedBanner = data.find((banner: BannerData) => banner.page === page);
        const selectedBannerMobile = data.find((banner: BannerData) => banner.page === page + " Mobile");
        
        setBanner(selectedBanner || {
          image: page
        });
        setMobileBanner(selectedBannerMobile || {
          image: page
        });
      } catch (error) {
        // Handle error silently as per original code
      }
    };

    fetchBanner();
  }, [page]);

  if (!banner || !mobileBanner) {
    return <Loading />;
  }

  const bannerImage = isMobile ? mobileBanner.image : banner.image;

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
      <Image
        src={`${process.env.BACK_BASE_URL}${bannerImage}`}
        alt={banner.page || ""}
        width={1000}
        height={500}
        className="w-full h-full object-cover brightness-50"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold px-4 py-2 rounded-md">
          {text}
        </h1>
      </div>
    </div>
  );
};

export default Banner;