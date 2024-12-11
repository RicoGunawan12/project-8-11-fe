import Link from "next/link";
import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="w-screen h-auto bg-black text-white p-12">
      <div className="flex w-full justify-around">
        <div className="flex w-3/4 gap-12 px-6">
          <div className="text-sm">
            <h1 className="mb-6 text-xl font-bold">COMPANY</h1>
            <div className="flex flex-col gap-y-1">
              <Link href={"/about"}>About</Link>
              <Link href={"/product"}>Product</Link>
              <Link href={"/contact"}>Contact</Link>
            </div>
          </div>
          <div>
            <h1 className="mb-6 text-xl font-bold">SUPPORT</h1>
            <div className="flex flex-col gap-y-1">
              <Link href={"/faq"}>FAQ</Link>
              <Link href={"/blog"}>Blog</Link>
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-3xl font-bold text-white">
              TYESO
            </Link>
          </div>
          <div className="flex gap-4 mt-6">
            {/* Social Media Icons */}
            <a
              href="https://placeholder.com/facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <Image
                src="/icons/facebook.svg"
                alt="Facebook"
                width={24}
                height={24}
                className="filter grayscale hover:grayscale-0"
              />
            </a>
            <a
              href="https://placeholder.com/pinterest"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <Image
                src="/icons/pinterest.svg"
                alt="Pinterest"
                width={24}
                height={24}
                className="filter grayscale hover:grayscale-0"
              />
            </a>
            <a
              href="https://placeholder.com/instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <Image
                src="/icons/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
                className="filter grayscale hover:grayscale-0"
              />
            </a>
            <a
              href="https://placeholder.com/youtube"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <Image
                src="/icons/youtube.svg"
                alt="YouTube"
                width={24}
                height={24}
                className="filter grayscale hover:grayscale-0"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-black py-6">
          <span className="text-white text-3xl font-bold">
          TYESO 
          </span>
          <span className="text-white text-xs">
          © TYESO, 2025. All rights reserved.
          </span>
      </div>
    </div>
  );
};

export default Footer;
