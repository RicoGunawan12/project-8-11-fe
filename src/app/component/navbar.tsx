"use client"
import React, { useEffect, useState, useRef } from "react";
import { deleteTokenCookie, getTokenCookie } from "../utilities/token";
import { Link } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faSearch, faUser, faRightToBracket, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ExploreProduct, Product } from "../model/product";
import { useLocaleStore } from "./locale";
import Image from "next/image";
import DeleteConfirmationModal from "./modal/deleteConfirmation";
import { useRouter } from "next/navigation";
import { formatCurrency } from "../utilities/converter";

const NavigationBar = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ExploreProduct[]>([]);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchedPages, setFetchedPages] = useState<{ [key: number]: ExploreProduct[] }>({});
  const { locale, change } = useLocaleStore()
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter();

  const options = [
    { value: "contentJSONEng", label: "EN", icon: "/icons/EN.png" },
    { value: "contentJSONIndo", label: "ID", icon: "/icons/ID.png" },
  ];

  const selectedOption = options.find((option) => option.value === locale);

  useEffect(() => {
    const clientToken = getTokenCookie();
    setToken(clientToken);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const closeDropdown = () => {
    setIsDropdownVisible(false);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuVisible(!isMobileMenuVisible);
  };

  const fetchSearchResults = async () => {

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return
    }

    if (fetchedPages[currentPage]) {
      setSearchResults(fetchedPages[currentPage]);
      return;
    }

    try {
      const counturl = new URL(`${process.env.PRODUCTS}/getCount`);
      counturl.searchParams.append("search", searchQuery);
      const countResponse = await fetch(counturl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!countResponse.ok) {
        throw new Error("Failed to fetch total product count");
      }

      const countData = await countResponse.json();
      setTotalPages(Math.ceil(countData.total / limit));

      const url = new URL(`${process.env.PRODUCTS}/paginate`);
      url.searchParams.append("limit", String(limit));
      url.searchParams.append("offset", String((currentPage - 1) * limit));
      url.searchParams.append("search", searchQuery);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setFetchedPages((prev) => ({
        ...prev,
        [currentPage]: data,
      }));

      setSearchResults(data);
    } catch (error) {
      setSearchResults([]);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-screen bg-secondary h-20 p-6 fixed top-0 flex justify-between items-center shadow-md z-40 text-black">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="text-3xl font-bold text-white">
          <Image src="/logo.png" width={75} height={75} alt="not found" />
        </Link>
      </div>


      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-6">
        {[
          { en: "product", id: "produk" },
          { en: "blog", id: "blog" },
          { en: "FAQ", id: "FAQ" },
          { en: "contact", id: "kontak" },
          { en: "about", id: "tentang" },
          { en: "location", id: "lokasi" }
        ].map((item) => (
          <Link
            key={item.en}
            href={`/${item.en.toLowerCase()}`}
            className="text-lg font-semibold text-white hover:underline"
          >
            {(locale === "contentJSONIndo" ? item.id : item.en).charAt(0).toUpperCase() +
              (locale === "contentJSONIndo" ? item.id : item.en).slice(1)}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-4 lg:hidden">
        <Link href="/cart" className="text-white flex items-center h-6 hover:underline lg:hidden">
          <FontAwesomeIcon icon={faCartShopping} size="lg" className="mr-2" />
        </Link>
        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle Mobile Menu"
            className="text-white"
          >
            <FontAwesomeIcon icon={isMobileMenuVisible ? faTimes : faBars} size="lg" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* Cart */}
      {isMobileMenuVisible && (
        <div className="absolute top-20 left-0 w-full bg-secondary shadow-lg z-50 lg:hidden text-xs">
          <div className="flex flex-col items-center gap-4 py-4">
            {/* Navigation Links */}
            {[
              { en: "product", id: "produk", path: "product" },
              { en: "blog", id: "blog", path: "blog" },
              { en: "faq", id: "faq", path: "faq" },
              { en: "contact", id: "kontak", path: "contact" },
              { en: "about", id: "tentang", path: "about" },
              { en: "location", id: "lokasi", path: "location" }
            ].map((item) => (
              <Link
                key={item.path}
                href={`/${item.path}`}
                className="font-semibold text-white hover:underline"
              >
                {(locale === "contentJSONIndo" ? item.id : item.en).charAt(0).toUpperCase() +
                  (locale === "contentJSONIndo" ? item.id : item.en).slice(1)}
              </Link>
            ))}

            {/* Divider */}
            <div className="w-full border-t-2 border-white mt-4"></div>

            {/* Action Buttons */}
            <div className="flex flex-col text-sm items-center w-full gap-4 py-2">
              <div className="relative inline-block text-secondary">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-20 h-8 text-white rounded-lg text-md flex items-center justify-between px-2"
                >
                  <img
                    src={selectedOption?.icon}
                    alt={selectedOption?.label}
                    className="w-6 h-6 mr-2"
                  />
                  {selectedOption?.label}
                  <span className="ml-2">&#x25BC;</span>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    {options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100 text-xs"
                        onClick={() => {
                          change(option.value);
                          setIsOpen(false);
                        }}
                      >
                        <img
                          src={option.icon}
                          alt={option.label}
                          className="w-4 h-4 mr-2"
                        />
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Search */}
              <button
                onClick={toggleModal}
                className="text-white flex items-center hover:underline h-6"
              >
                <FontAwesomeIcon icon={faSearch} size="sm" className="mr-2" />
                <span className="text-medium h-full">Search</span>
              </button>

              {/* User Account */}
              {token ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button" // Prevent default form submission behavior
                    onClick={toggleDropdown}
                    className="text-white gap-2 text-medium flex items-center"
                  >
                    <FontAwesomeIcon icon={faUser} size="sm" />
                    <span>
                      Account
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  {isDropdownVisible && (
                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 p-2">
                      <Link href="/profile" className="block px-4 py-2 text-gray-800">
                        Profile
                      </Link>
                      <button
                        className="block px-4 py-2 text-gray-800"
                        onClick={() => {
                          setIsModalOpen(true)
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/login" className="text-white">
                  <FontAwesomeIcon icon={faRightToBracket} size="lg" />
                </Link>
              )}
            </div>


          </div>
        </div>
      )}

      {/* Actions */}
      <div className="hidden lg:flex items-center space-x-4">
        {/* Language Selector */}
        <div className="relative inline-block text-secondary">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-20 h-8 text-white rounded-lg text-md flex items-center justify-between px-2"
          >
            <img
              src={selectedOption?.icon}
              alt={selectedOption?.label}
              className="w-6 h-6 mr-2"
            />
            {selectedOption?.label}
            <span className="ml-2">&#x25BC;</span>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-md">
              {options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100 text-xs"
                  onClick={() => {
                    change(option.value);
                    setIsOpen(false);
                  }}
                >
                  <img
                    src={option.icon}
                    alt={option.label}
                    className="w-4 h-4 mr-2"
                  />
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button onClick={toggleModal} className="text-white">
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </button>

        {/* Cart Link */}
        <Link href="/cart" className="text-white">
          <FontAwesomeIcon icon={faCartShopping} size="lg" />
        </Link>

        {/* User Dropdown or Login */}
        {token ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="text-white font-semibold flex items-center"
            >
              <FontAwesomeIcon icon={faUser} size="lg" />
            </button>

            {/* User Dropdown Menu */}
            {isDropdownVisible && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 p-2">
                <Link href="/profile" className="block px-4 py-2 text-gray-800">
                  Profile
                </Link>
                <button
                  className="block px-4 py-2 text-gray-800"
                  onClick={() => {
                    setIsModalOpen(true)
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/auth/login" className="text-white">
            <FontAwesomeIcon icon={faRightToBracket} size="lg" />
          </Link>
        )}
      </div>


      {/* Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black rounded-lg shadow-lg w-4/5 h-[95%] p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 text-3xl hover:text-gray-700"
              onClick={toggleModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-black">Search Products</h2>
            <div className="flex gap-6">
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border h-full rounded-lg px-4 py-2 focus:outline-none w-full mb-4"
              />
              <button
                onClick={() => {
                  setCurrentPage(1);
                  setFetchedPages({});
                  fetchSearchResults();
                }}
                className="bg-secondary h-full text-white px-4 py-2 rounded-lg "
              >
                Search
              </button>
            </div>
            <div className="mt-4 h-3/4 overflow-y-scroll">
              {searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((product) => (
                    <li key={product.productId} className="border-b py-2">
                      <Link href={`/product/${product.productId}`} className="hover:underline flex items-center space-x-4 text-black">
                        <img
                          src={product.product_covers[0].productCover ? process.env.BACK_BASE_URL + product.product_covers[0].productCover : "/placeholder.webp"}
                          alt={product.productName}
                          className="w-20 h-20 object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="text-black">{product.productName}</span>
                          {
                            product.promo_details[0] && product.promo_details[0].promo != null ?
                              <div className="flex justify-start">
                                <span className="line-through mr-2 text-gray-600">{formatCurrency(product.product_variants[0]?.productPrice)}</span>
                                <span className="font-semibold text-black">{product.product_variants[0]?.productPrice - product.promo_details[0].promo?.promoAmount > 0 ? formatCurrency(product.product_variants[0]?.productPrice - product.promo_details[0].promo?.promoAmount) : formatCurrency(0)}</span>
                              </div>
                              :
                              <div className="text-black">
                                {formatCurrency(product.product_variants[0]?.productPrice)}
                              </div>
                          }
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  No products found.
                  {/* {searchQuery.trim()
                  ? "No products found."
                  : "Please insert what you want to search."} */}
                  {/* Please insert what you want to search. */}
                </p>
              )}
            </div>
            {
              totalPages <= 1 ? null : <div className="flex justify-between mt-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${currentPage === 1 ? "bg-gray-300" : "bg-secondary text-white hover:bg-blue-600"
                    }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? "bg-gray-300" : "bg-secondary text-white hover:bg-blue-600"
                    }`}
                >
                  Next
                </button>
              </div>
            }
          </div>
        </div>
      )}
      <div className="fixed">
        <DeleteConfirmationModal header={"Are you sure you want to log out?"} description={`Are you sure you want to log out ?`} onDelete={() => {
          deleteTokenCookie()
          router.push("/auth/login")
        }} isVisible={isModalOpen} onCancel={() => { setIsModalOpen(false) }} />
      </div>
    </div>

  );
};

export default NavigationBar;
