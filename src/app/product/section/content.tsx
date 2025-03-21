"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import NavigationBar from "../../component/navbar";
import Banner from "../../component/banner";
import { ExploreProduct } from "../../model/product";
import Footer from "../../component/footer";
import { Loading } from "../../utilities/loading";
import { Categories } from "../../model/category";
import { useSearchParams } from "next/navigation";
import StarRating from "../../utilities/rating";
import { formatCurrency } from "@/app/utilities/converter";

const ProductPageContent = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const [searchResults, setSearchResults] = useState<ExploreProduct[]>();
  const [categories, setCategories] = useState<Categories[]>();
  const [activeCategory, setActiveCategory] = useState(category ? category : "All");
  const [limit, setLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchedPages, setFetchedPages] = useState<{
    [key: number]: ExploreProduct[];
  }>({});

  const fetchSearchResults = async () => {

    try {
      const counturl = new URL(`${process.env.PRODUCTS}/getCount`);
      counturl.searchParams.append("search", "");
      counturl.searchParams.append("category", activeCategory === "All" ? "" : activeCategory);
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
      url.searchParams.append("search", "");
      url.searchParams.append("category", activeCategory === "All" ? "" : activeCategory);

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

  const getCategories = async () => {
    try {
      const categoriesUrl = new URL(`${process.env.CATEGORIES}`);
      const categoriesResponse = await fetch(categoriesUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await categoriesResponse.json();
      if (!categoriesResponse.ok) {
        throw new Error(data.message);
      }
      setCategories(data);
    } catch (error) {
      console.error("Error fetching search results:", error);

    }
  }

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

  }, [currentPage, activeCategory]);

  useEffect(() => {
    getCategories();
  }, []);

  if (!searchResults) {
    return <Loading />
  }

  return (
    <div className="w-screen min-h-screen bg-white">
      <NavigationBar />
      <div className="mt-20 flex-grow">
        <Banner page="Product Page" text="Product" />

        <div className="w-full flex justify-center">
          <div
            className="flex gap-8 mt-6 mb-2 pb-4 overflow-x-auto mx-8"
            style={{
              scrollbarWidth: "thin", // For Firefox
              scrollbarColor: "gray transparent", // For Firefox
            }}
          >
            <button
              onClick={() => setActiveCategory("All")}
              className={`text-md text-secondary font-semibold p-2 rounded ${activeCategory === "All"
                  ? "border-secondary border-b-2"
                  : null
                }`}
            >
              All
            </button>
            {
              categories?.map((category) => (
                <button
                  key={category.productCategoryId}
                  onClick={() => setActiveCategory(category.productCategoryName)}
                  className={`text-md text-secondary font-semibold p-2 rounded ${activeCategory === category.productCategoryName
                      ? "border-secondary border-b-2"
                      : null
                    }`}
                >
                  {category.productCategoryName}
                </button>
              ))
            }
          </div>
        </div>
        {
          searchResults.length == 0 &&
          <div className="text-center h-20 my-12">There is no product in {activeCategory} category</div>
        }
        {searchResults.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 w-full justify-items-center pb-12 lg:px-12 px-4">
            {searchResults.map((result: ExploreProduct, index) => (
              <Link
                href={`/product/${result.productId}`}
                key={index}
                className="w-11/12"
              >
                <div className="py-4 mt-6 lg:h-[500px]">
                  <div className="overflow-visible flex justify-center items-center">
                    {result ? (
                      <Image
                        alt="Card background"
                        className="object-fill w-full aspect-square"
                        src={(result?.product_covers[0]?.productCover ? process.env.BACK_BASE_URL + result?.product_covers[0]?.productCover : "/placeholder.webp")}
                        width={500}
                        height={500}
                        priority
                      />
                    ) : (
                      <Image
                        alt="Card background"
                        className="object-fill w-[450px] h-full md:h-[250px] sm:h-[200px]"
                        src="/d.jpg"
                        width={500}
                        height={500}
                        priority
                      />
                    )}
                  </div>
                  <div className="pb-0 p-4 flex-col text-xs text-black justify-start items-start">
                    <div className="flex flex-col lg:flex-row gap-2 text-xs items-start lg:items-center">
                      <StarRating rating={parseFloat(result?.averageRating) ? parseFloat(result?.averageRating) : 0} disabled />
                      <p>{result.countRating} reviews</p>
                    </div>
                    <p className="text-lg uppercase font-bold truncate max-w-full">
                      {result.productName}
                    </p>
                    <p>
                    </p>
                    {
                      result.promo_details[0] && result.promo_details[0].promo != null ?
                        <div className="flex flex-wrap">
                          <span className="line-through mr-2 text-gray-600">{formatCurrency(result.product_variants[0]?.productPrice)}</span>
                          <span className="font-semibold">{result.product_variants[0]?.productPrice - result.promo_details[0].promo?.promoAmount > 0 ? formatCurrency(result.product_variants[0]?.productPrice - result.promo_details[0].promo?.promoAmount) : formatCurrency(0)}</span>
                        </div>
                        :
                        <div >
                          {formatCurrency(result.product_variants[0]?.productPrice)}
                        </div>
                    }
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination controls */}
        {totalPages <= 1 ? null : (
          <div className="flex justify-center items-center text-black gap-6 mt-4 mb-20">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg w-[100px] bg-secondary text-white ${currentPage === 1
                  ? "cursor-not-allowed"
                  : ""
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
              className={`px-4 py-2 rounded-lg w-[100px] bg-secondary text-white ${currentPage === totalPages
                  ? "cursor-not-allowed"
                  : ""
                }`}
            >
              Next
            </button>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}

const SuspenseWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductPageContent />
    </Suspense>
  );
};

export default SuspenseWrapper;