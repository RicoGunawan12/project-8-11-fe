"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import { toastError } from "@/app/utilities/toast";
import {Loading} from "@/app/utilities/loading";
import { ProductCard } from "@/app/model/productCard";

const OurProductSection = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null); // State for active tab

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.PRODUCTS}/category`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setProducts(data.products);
        console.log(data.products)

        // Set the first category as active by default
        if (data.products.length > 0) {
          setActiveCategoryId(data.products[0].productCategoryId);
        }
      } catch (error: any) {
        toastError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // If loading, show loading spinner
  if (loading) {
    return <Loading />;
  }

  // Get the products of the active category
  const activeCategory = products.find(
    (category) => category.productCategoryId === activeCategoryId
  );

  return (
    <div className="w-screen flex flex-col items-center py-20">
      <div className=" text-3xl font-bold text-black">Our Product</div>

      {/* Category Tabs */}
      <div className="mt-8 w-full px-10 flex flex-col">
        <div className="md:w-full flex justify-center">
          <div 
            className="flex flex-row gap-8 mb-10 pb-4 overflow-x-auto mx-2 md:mx-8"
            style={{
              scrollbarWidth: "thin", // For Firefox
              scrollbarColor: "gray transparent", // For Firefox
            }}
          >
            {/* Category Dummy Data */}
            {/* <button
              key={1}
              onClick={() => setActiveCategoryId("1")}
              className={`text-xs md:text-md text-secondary font-semibold p-2 rounded ${activeCategoryId === "1"
                  ? "border-secondary border-b-2"
                  : null
                }`}
            >
              {"Category 1"}
            </button>
            <button
              key={2}
              onClick={() => setActiveCategoryId("2")}
              className={`text-xs md:text-md text-secondary font-semibold p-2 rounded ${activeCategoryId === "2"
                  ? "border-secondary border-b-2"
                  : null
                }`}
            >
              {"Category 2"}
            </button>
            <button
              key={3}
              onClick={() => setActiveCategoryId("3")}
              className={`text-xs md:text-md text-secondary font-semibold p-2 rounded ${activeCategoryId === "3"
                  ? "border-secondary border-b-2"
                  : null
                }`}
            >
              {"Category 3"}
            </button>
            <button
              key={4}
              onClick={() => setActiveCategoryId("4")}
              className={`text-xs md:text-md text-secondary font-semibold p-2 rounded ${activeCategoryId === "4"
                  ? "border-secondary border-b-2"
                  : null
                }`}
            >
              {"Category 4"}
            </button>
            <button
              key={5}
              onClick={() => setActiveCategoryId("5")}
              className={`text-xs md:text-md text-secondary font-semibold p-2 rounded ${activeCategoryId === "5"
                  ? "border-secondary border-b-2"
                  : null
                }`}
            >
              {"Category 5"}
            </button> */}

            {/* Category Real Data */}
            {products.map((category) => (
              <button
                key={category.productCategoryId}
                onClick={() => setActiveCategoryId(category.productCategoryId)}
                className={`text-xs md:text-md text-secondary font-semibold p-2 rounded ${activeCategoryId === category.productCategoryId
                    ? "border-secondary border-b-2"
                    : null
                  }`}
              >
                {category.productCategoryName}
              </button>
            ))}
          </div>
        </div>

        {/* Our Product dummy data */}
        {/* <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:px-24 lg:grid-cols-4 gap-16 ml-3 md:ml-0">
          <Link key={`1`} href={`/product/1`}>
            <div>
              <Image
                src={`${process.env.BACK_BASE_URL}`}
                alt={"product 1"}
                width={200}
                height={200}
                className="w-full"
              />
              <div className="text-lg font-semibold text-black w-full text-center mt-6">{"Product 1"}</div>
              <p className="text-sm text-black w-full text-center">Rp. {100000}</p>
            </div>
          </Link>

          <Link key={`2`} href={`/product/1`}>
            <div>
              <Image
                src={`${process.env.BACK_BASE_URL}`}
                alt={"product 1"}
                width={200}
                height={200}
                className="w-full"
              />
              <div className="text-lg font-semibold text-black w-full text-center mt-6">{"Product 1"}</div>
              <p className="text-sm text-black w-full text-center">Rp. {100000}</p>
            </div>
          </Link>

          <Link key={`3`} href={`/product/1`}>
            <div>
              <Image
                src={`${process.env.BACK_BASE_URL}`}
                alt={"product 1"}
                width={200}
                height={200}
                className="w-full"
              />
              <div className="text-lg font-semibold text-black w-full text-center mt-6">{"Product 1"}</div>
              <p className="text-sm text-black w-full text-center">Rp. {100000}</p>
            </div>
          </Link>

          <Link key={`4`} href={`/product/1`}>
            <div>
              <Image
                src={`${process.env.BACK_BASE_URL}`}
                alt={"product 1"}
                width={200}
                height={200}
                className="w-full"
              />
              <div className="text-lg font-semibold text-black w-full text-center mt-6">{"Product 1"}</div>
              <p className="text-sm text-black w-full text-center">Rp. {100000}</p>
            </div>
          </Link>

          <Link key={`5`} href={`/product/1`}>
            <div>
              <Image
                src={`${process.env.BACK_BASE_URL}`}
                alt={"product 1"}
                width={200}
                height={200}
                className="w-full"
              />
              <div className="text-lg font-semibold text-black w-full text-center mt-6">{"Product 1"}</div>
              <p className="text-sm text-black w-full text-center">Rp. {100000}</p>
            </div>
          </Link>

          <Link key={`6`} href={`/product/1`}>
            <div>
              <Image
                src={`${process.env.BACK_BASE_URL}`}
                alt={"product 1"}
                width={200}
                height={200}
                className="w-full"
              />
              <div className="text-lg font-semibold text-black w-full text-center mt-6">{"Product 1"}</div>
              <p className="text-sm text-black w-full text-center">Rp. {100000}</p>
            </div>
          </Link>
        </div> */}

        {/* Products of the active category */}
        {activeCategory ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 text-black md:grid-cols-3 lg:px-24 lg:grid-cols-4 gap-16">
              {activeCategory.products.map((product: ProductCard) => (
                <Link key={product.productId} href={`/product/${product.productId}`}>
                  <div>
                    <Image
                      src={`${process.env.BACK_BASE_URL}${product.defaultImage}`}
                      alt={product.productName}
                      width={200}
                      height={200}
                      className="w-full object-contain"
                    />
                    <div className="text-lg font-semibold text-black w-full text-center mt-6">{product.productName}</div>
                    {
                        product.promo_details[0]? 
                        <div className="flex justify-center">
                          <span className="line-through mr-2 text-gray-600">Rp. {product.product_variants[0].productPrice}</span>
                          <span className="font-semibold">Rp. {parseInt(product.product_variants[0].productPrice) - product.promo_details[0].promo.promoAmount > 0 ? parseInt(product.product_variants[0].productPrice) - product.promo_details[0].promo.promoAmount : 0}</span>
                        </div>
                        :
                        <div className="flex justify-center">
                        Rp. {product.product_variants[0].productPrice}
                        </div>
                      }
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-gray-500">No products available in this category</div>
        )}
      </div>
    </div>
  );
};

export default OurProductSection;
