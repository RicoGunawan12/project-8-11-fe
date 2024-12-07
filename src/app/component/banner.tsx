import Image from "next/image";
import React from "react";

interface BannerProps {
  title: string;
  imagePath: string;
}

const Banner: React.FC<BannerProps> = ({ title, imagePath }) => {
  return (
    <div className="relative w-screen h-[85%]">
      <Image
        src={imagePath}
        alt={title}
        width={1000}
        height={500}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white text-8xl font-bold px-4 py-2 rounded-md">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default Banner;