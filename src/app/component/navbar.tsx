"use client";
import React, { useEffect, useState, useRef } from "react";
import { deleteTokenCookie, getTokenCookie } from "../utilities/token";
import { Link } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faScroll,
  faUser,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Product } from "../model/product";

const NavigationBar = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const searchResultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const clientToken = getTokenCookie();
    setToken(clientToken);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const fetchSearchResults = async () => {
    try {
      const response = await fetch(`${process.env.PRODUCTS}`);
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();

      console.log(data);

      setSearchResults(data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
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
        <Link
          href="/product"
          className="text-lg font-semibold text-white hover:underline"
        >
          Product
        </Link>
        <Link
          href="/blog"
          className="text-lg font-semibold text-white hover:underline"
        >
          Blog
        </Link>
        <Link
          href="/faq"
          className="text-lg font-semibold text-white hover:underline"
        >
          FAQ
        </Link>
        <Link
          href="/contact"
          className="text-lg font-semibold text-white hover:underline"
        >
          Contact Us
        </Link>
        <Link
          href="/about"
          className="text-lg font-semibold text-white hover:underline"
        >
          About Us
        </Link>
      </div>

      <div className="flex items-center gap-6 w-auto relative">
        <div className="relative" ref={searchRef}>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-full px-4 py-1 focus:outline-none w-64 text-secondary"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={fetchSearchResults}
          />
          {searchResults.length > 0 && (
            <div 
              ref={searchResultsRef}
              className="absolute top-full mt-2 bg-white shadow-lg rounded-md w-full"
            >
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  {result.productName}
                </div>
              ))}
            </div>
          )}
        </div>

        {token ? (
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <Link href="/transactions">
              <FontAwesomeIcon
                icon={faScroll}
                className="text-white text-xl cursor-pointer hover:text-gray-300"
              />
            </Link>
            <Link href="/cart">
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-white text-xl cursor-pointer hover:text-gray-300"
              />
            </Link>

            <div onClick={toggleDropdown} className="cursor-pointer">
              <FontAwesomeIcon
                icon={faUser}
                className="text-white text-xl hover:text-gray-300"
              />
            </div>

            {isDropdownVisible && (
              <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md w-40">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  View Profile
                </Link>
                <Link
                  href="/address"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Address
                </Link>
                <Link
                  onClick={deleteTokenCookie}
                  href="/auth/login"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
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