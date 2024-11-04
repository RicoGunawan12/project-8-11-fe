"use client";
import React, { useEffect, useState } from "react";
import { getTokenCookie } from "../utilities/token";
import { Link } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faScroll, faUser } from "@fortawesome/free-solid-svg-icons";

const NavigationBar = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const clientToken = getTokenCookie();
    setToken(clientToken);
  }, []);

  return (
    <div className="w-full bg-secondary h-20 fixed top-0 flex justify-between items-center px-6 shadow-md z-50">

      <div className="flex items-center gap-6">
        <Link href="/" className="text-3xl font-bold text-white">
          TYESO
        </Link>
        
      </div>

      <div className="flex items-center gap-6">
      <Link href="/product" className="text-lg font-semibold text-white hover:underline">
          Product
        </Link>
        <Link href="/blog" className="text-lg font-semibold text-white hover:underline">
          Blog
        </Link>
        <Link href="/faq" className="text-lg font-semibold text-white hover:underline">
          FAQ
        </Link>
        <Link href="/contact" className="text-lg font-semibold text-white hover:underline">
          Contact Us
        </Link>
        <Link href="/about" className="text-lg font-semibold text-white hover:underline">
          About Us
        </Link>
      </div>

      <div className="flex items-center gap-6 w-auto">
        {token ? (
          <div className="flex items-center gap-4">
            <Link href="/cart"><FontAwesomeIcon icon={faCartShopping} className="text-white text-xl cursor-pointer hover:text-gray-300" /></Link>
            {/* <Link href="/history"><FontAwesomeIcon icon={faScroll} className="text-white text-xl cursor-pointer hover:text-gray-300" /></Link> */}
            <Link href="/profile"><FontAwesomeIcon icon={faUser} className="text-white text-xl cursor-pointer hover:text-gray-300" /></Link>
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="text-xl font-semibold text-white hover:underline"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;
