"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import { toastError } from "@/app/utilities/toast";
import Loading from "@/app/utilities/loading";

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
      <div className="mt-8 w-full px-10">
        <div className="flex gap-8 mb-8 w-full justify-center">
          {products.map((category) => (
            <button
              key={category.productCategoryId}
              onClick={() => setActiveCategoryId(category.productCategoryId)}
              className={`text-md text-secondary font-semibold p-2 rounded ${
                activeCategoryId === category.productCategoryId
                  ? "border-secondary border-b-2"
                  : null
              }`}
            >
              {category.productCategoryName}
            </button>
          ))}
        </div>

        {/* Products of the active category */}
        {activeCategory ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:px-40 lg:grid-cols-5 gap-16">
              {activeCategory.products.map((product: any) => (
                <Link href={`/product/${product.productId}`}>
                <div key={product.productId}>
                    <Image
                      src={`${process.env.BACK_BASE_URL}${product.defaultImage}`}
                      alt={product.productName}
                      width={200}
                      height={200}
                      className="w-full"
                    />
                    <div className="text-lg font-semibold text-black w-full text-center mt-6">{product.productName}</div>
                    <p className="text-sm text-black w-full text-center">{product.productDescription}</p>
                  {/* <CardHeader>
                  </CardHeader>
                  <CardBody>
                  </CardBody> */}
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
