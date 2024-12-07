"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "../model/productCard";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import Image from "next/image";
import NavigationBar from "../component/navbar";
import Banner from "../component/banner";

const ProductPage = () => {
  const [data, setData] = useState<ProductCard[]>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.PRODUCTS}`, {
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
      setData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="w-screen h-screen bg-white">
      <NavigationBar />
      <div className="mt-20 h-full">
        <Banner title="Product" imagePath="/a.jpg" />
        <div className="grid-cols-6 grid w-full justify-items-center p-12">
          {data?.map((product, index) => (
            <Link href={`/product/${product.productId}`} key={index}>
              <Card className="py-4 mt-6">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start ">
                  <p className="text-tiny uppercase font-bold truncate max-w-[200px]">
                    {product.productName}
                  </p>
                  <div className="flex">
                    <div>${product.product_variants[0].productPrice}</div>
                  </div>
                </CardHeader>
                <CardBody className="overflow-visible py-1 flex justify-center items-center">
                  {product.product_variants[0].productImage ? (
                    <Image
                      alt="Card background"
                      className="object-cover rounded-xl w-[200px] h-[150px]"
                      src={`${process.env.BACK_BASE_URL}${product.product_variants[0].productImage}`}
                      width={200}
                      height={150}
                    />
                  ) : (
                    <Image
                      alt="Card background"
                      className="object-cover rounded-xl w-[200px] h-[150px]"
                      src="/d.jpg"
                      width={200}
                      height={150}
                    />
                  )}
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
