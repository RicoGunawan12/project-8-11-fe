import React, { useEffect, useState, useRef } from "react";
import { deleteTokenCookie, getTokenCookie } from "../utilities/token";
import { Link } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faScroll, faUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Product } from "../model/product";

const NavigationBar = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchedPages, setFetchedPages] = useState<{ [key: number]: Product[] }>({});
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const clientToken = getTokenCookie();
    setToken(clientToken);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const fetchSearchResults = async () => {
    if (fetchedPages[currentPage]) {
      console.log("back")
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
      console.log(countData)
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
      console.error("Error fetching search results:", error);
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
    fetchSearchResults()
  }, [currentPage])

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
      <div className="flex items-center space-x-4">
        <button onClick={toggleModal} className="text-white">
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </button>
        
        {token ? (
          <div className="flex gap-4">
            <Link href="/transactions" className="text-white">
          <FontAwesomeIcon icon={faScroll} size="lg" />
        </Link>

        <Link href="/cart" className="text-white">
          <FontAwesomeIcon icon={faCartShopping} size="lg" />
        </Link>
            <button
              onClick={toggleDropdown}
              className="text-white font-semibold flex items-center"
            >
              <FontAwesomeIcon icon={faUser} size="lg" />
            </button>
            {isDropdownVisible && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 p-2"
              >
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
            <FontAwesomeIcon icon={faUser} size="lg" />
          </Link>
        )}
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-3/4 max-w-2xl p-6 relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={toggleModal}
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4">Search Products</h2>
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none w-full mb-4"
            />
            <button
              onClick={() => {
                setCurrentPage(1);
                setFetchedPages({})
                fetchSearchResults();
                console.log("pencet")
              }}
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              Search
            </button>

            {searchResults.length > 0 && (
              <div className="mt-4">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    {result.productName}
                  </div>
                ))}

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-primary text-white"
                    }`}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === totalPages
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-primary text-white"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationBar;
