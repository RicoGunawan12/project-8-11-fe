"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "../model/productCard";
import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import Image from "next/image";
import NavigationBar from "../component/navbar";
import Banner from "../component/banner";
import { ExploreProduct } from "../model/product";
import Footer from "../component/footer";
import Loading from "../utilities/loading";

const ProductPage = () => {
  const [searchResults, setSearchResults] = useState<ExploreProduct[]>();
  const [limit, setLimit] = useState(40);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchedPages, setFetchedPages] = useState<{
    [key: number]: ExploreProduct[];
  }>({});

  const fetchSearchResults = async () => {
    console.log("asd");
    if (fetchedPages[currentPage]) {
      console.log("back");
      setSearchResults(fetchedPages[currentPage]);
      return;
    }

    try {
      const counturl = new URL(`${process.env.PRODUCTS}/getCount`);
      counturl.searchParams.append("search", "");
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
      console.log(countData);
      setTotalPages(Math.ceil(countData.total / limit));

      const url = new URL(`${process.env.PRODUCTS}/paginate`);
      url.searchParams.append("limit", String(limit));
      url.searchParams.append("offset", String((currentPage - 1) * limit));
      url.searchParams.append("search", "");

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
      console.log(data);

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
    fetchSearchResults();
  }, [currentPage]);

  if(!searchResults){
    return <Loading/>
  }

  return (
    <div className="w-screen h-screen bg-white">
      <NavigationBar />
      <div className="mt-20 h-full">
      <Banner page="Product Page" text="Product" />
        {searchResults.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 w-full justify-items-center py-12 lg:px-12 px-4">
            {searchResults.map((result, index) => (
              <Link
                href={`/product/${result.productId}`}
                key={index}
                className="w-11/12"
              >
                <Card className="py-4 mt-6 lg:h-[425px]">
                  <CardBody className="overflow-visible flex justify-center items-center">
                    {result ? (
                      <Image
                        alt="Card background"
                        className="object-cover rounded-xl w-[450px] lg:h-[300px] md:h-[250px] h-[200px] py-6"
                        src={`${process.env.BACK_BASE_URL}${result.product_variants[0].productImage}`}
                        width={300}
                        height={200}
                      />
                    ) : (
                      <Image
                        alt="Card background"
                        className="object-cover rounded-xl w-[450px] h-[300px] md:h-[250px] sm:h-[200px] py-6"
                        src="/d.jpg"
                        width={300}
                        height={200}
                      />
                    )}
                  </CardBody>
                  <CardFooter className="pb-0 pt-2 px-4 flex-col justify-center">
                    <p className="text-sm uppercase font-bold truncate max-w-[200px]">
                      {result.productName}
                    </p>
                    <div className="flex">
                      <div>Rp. {result.product_variants[0].productPrice}</div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination controls */}
        {totalPages == 1 ? null : (
          <div className="flex justify-center text-black gap-6 mt-4">
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
        )}
        <Footer />
      </div>
    </div>
  );
};

export default ProductPage;
