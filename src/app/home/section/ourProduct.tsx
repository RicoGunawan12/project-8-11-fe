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
        <div className="flex gap-8 mb-8">
          {products.map((category) => (
            <button
              key={category.productCategoryId}
              onClick={() => setActiveCategoryId(category.productCategoryId)}
              className={`text-md font-semibold p-2 rounded ${
                activeCategoryId === category.productCategoryId
                  ? "bg-secondary text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {category.productCategoryName}
            </button>
          ))}
        </div>

        {/* Products of the active category */}
        {activeCategory ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {activeCategory.products.map((product: any) => (
                <Card key={product.productId}>
                  <CardHeader>
                    <Image
                      src={`${process.env.BACK_BASE_URL}${product.defaultImage}`}
                      alt={product.productName}
                      width={200}
                      height={200}
                      className="rounded-md"
                    />
                  </CardHeader>
                  <CardBody>
                    <div className="text-lg font-semibold">{product.productName}</div>
                    <p className="text-sm text-gray-500">{product.productDescription}</p>
                  </CardBody>
                  <CardFooter>
                    <Link href={`/product/${product.productId}`} className="text-secondary font-semibold">
                      <span>View Details {">>"} </span>
                    </Link>
                  </CardFooter>
                </Card>
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
