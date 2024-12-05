"use client";
import React, { useEffect, useState, useRef } from "react";
import { deleteTokenCookie, getTokenCookie } from "../utilities/token";
import { Link } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";

const NavigationBar = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const clientToken = getTokenCookie();
    setToken(clientToken);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
        <Link href="/post" className="text-lg font-semibold text-white hover:underline">
          Post
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
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <Link href="/cart">
              <FontAwesomeIcon icon={faCartShopping} className="text-white text-xl cursor-pointer hover:text-gray-300" />
            </Link>

            <div onClick={toggleDropdown} className="cursor-pointer">
              <FontAwesomeIcon icon={faUser} className="text-white text-xl hover:text-gray-300" />
            </div>

            {isDropdownVisible && (
              <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md w-40">
                <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  View Profile
                </Link>
                <Link href="/address" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Address
                </Link>
                <Link onClick={deleteTokenCookie} href="/auth/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Logout
                </Link>
              </div>
            )}
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
