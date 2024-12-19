"use client"
import React, { useEffect, useState, useRef } from "react";
import { deleteTokenCookie, getTokenCookie } from "../utilities/token";
import { Link } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faSearch, faUser, faRightToBracket, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ExploreProduct, Product } from "../model/product";
import { useLocaleStore } from "./locale";

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
  const {locale, change} = useLocaleStore()
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="w-screen bg-secondary h-20 p-6 fixed top-0 flex justify-between items-center shadow-md z-50">
  {/* Logo */}
  <div className="flex items-center">
    <Link href="/" className="text-3xl font-bold text-white">
      TYESO
    </Link>
  </div>

  {/* Desktop Menu */}
  <div className="hidden lg:flex items-center gap-6">
    {["product", "blog", "FAQ", "contact", "about"].map((item) => (
      <Link
        key={item}
        href={`/${item.toLowerCase()}`}
        className="text-lg font-semibold text-white hover:underline"
      >
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </Link>
    ))}
  </div>

  {/* Mobile Menu Button */}
  <div className="lg:hidden">
    <button
      onClick={toggleMobileMenu}
      aria-label="Toggle Mobile Menu"
      className="text-white"
    >
      <FontAwesomeIcon icon={isMobileMenuVisible ? faTimes : faBars} size="lg" />
    </button>
  </div>

  {/* Mobile Menu */}
  {isMobileMenuVisible && (
    <div className="absolute top-20 text-xs left-0 w-full bg-secondary shadow-lg z-50 lg:hidden">
      <div className="flex flex-col items-center gap-4 ">
        {["product", "blog", "faq", "contact", "about"].map((item) => (
          <Link
            key={item}
            href={`/${item}`}
            className="font-semibold text-white hover:underline text-xs"
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </Link>
        ))}
        <div className="flex flex-col items-center w-full border-t-2 border-white gap-4 mt-2 py-2">
          <button onClick={toggleModal} className="text-white">
            <FontAwesomeIcon icon={faSearch} size="xs" className="ml-2"/> Search
          </button>
          <Link href="/cart" className="text-white">
            <FontAwesomeIcon icon={faCartShopping} size="xs"/><div className="ml-1"> Cart</div>
          </Link>
          {token ? (
            <button
              onClick={toggleDropdown}
              className="text-white font-semibold flex items-center"
            >
              <FontAwesomeIcon icon={faUser} size="2xs" /> <div className="ml-1">Account</div>
            </button>
          ) : (
            <Link href="/auth/login" className="text-white">
              <FontAwesomeIcon icon={faRightToBracket} size="lg" /> Login
            </Link>
          )}
        </div>
      </div>
    </div>
  )}

  {/* Actions */}
  <div className="hidden lg:flex items-center space-x-4">
  <button
    onClick={change}
    className="w-8 h-8 aspect-square"
>
    {locale === "contentJSONEng" ? <img src="/icons/ID.png"/> : <img src="/icons/EN.png" /> }
</button>
    <button onClick={toggleModal} className="text-white">
      <FontAwesomeIcon icon={faSearch} size="lg" />
    </button>
    <Link href="/cart" className="text-white">
      <FontAwesomeIcon icon={faCartShopping} size="lg" />
    </Link>
    {token ? (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="text-white font-semibold flex items-center"
        >
          <FontAwesomeIcon icon={faUser} size="lg" />
        </button>
        {isDropdownVisible && (
          <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 p-2">
            <Link href="/profile" className="block px-4 py-2 text-gray-800">
              Profile
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 text-gray-800"
              onClick={() => {
                deleteTokenCookie();
                setToken(null);
              }}
            >
              Logout
            </Link>
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
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
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
          <Link href={`/product/${product.productId}`} className="hover:underline flex items-center space-x-4">
            <img
              src={`${process.env.BACK_BASE_URL}${product.defaultImage}`}
              alt={product.productName}
              className="w-20 h-20 object-cover"
            />
            <div className="flex flex-col">
            <span>{product.productName}</span>
            <span>Rp. {product.product_variants[0].productPrice}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <p>No products found.</p>
  )}
</div>
        {
          totalPages === 1 ? null : <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
        }
      </div>
    </div>
  )}
</div>

  );
};

export default NavigationBar;
