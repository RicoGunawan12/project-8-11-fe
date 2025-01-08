import React, { useEffect, useState } from "react";
import Image from "next/image";
import {Loading} from "../utilities/loading";

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

  useEffect(() => {
    // Fetch banners from the API (using a mock API response for now)
    const fetchBanner = async () => {
      try {
        const response = await fetch(`${process.env.BANNERS}`); // Adjust the API endpoint as needed
        const data = (await response.json()).banners;
        const selectedBanner = data.find((banner: BannerData) => banner.page === page);
        setBanner(selectedBanner || {
          image : page
        });
      } catch (error) {
        // console.error("Failed to fetch banners:", error);
      }
    };

    fetchBanner();
  }, [page]);

  if (!banner) {
    return <Loading />;
  }

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
      <Image
        src={`${process.env.BACK_BASE_URL}${banner.image}`}
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
