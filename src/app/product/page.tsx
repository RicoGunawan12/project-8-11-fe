"use client"

import React, { useEffect, useState } from "react";
import { ProductCard } from "../model/productCard";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import Image from "next/image";
import NavigationBar from "../component/navbar";

const ProductPage = () => {

  const [data, setData] = useState<ProductCard[]>()

  useEffect(() => {

    const fetchData = async() => {

      const response = await fetch(
        `${process.env.PRODUCTS}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      setData(data);
    }

    fetchData()

  }, [])

  return (
    <div className="w-screen bg-white">
      <NavigationBar />
      <div className="grid-cols-7 grid w-full justify-items-center pt-16">
        {data?.map((product, index) => (
          <Link href={`/product/${product.productId}`} key={index}>
            <Card className="py-4 mt-6">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">
                  {product.productName}
                </p>
                <div className="flex">
                  {product.productDiscount ? (
                    <h4 className="line-through text-gray-500 mr-2">
                      ${product.product_variants[0].productPrice}
                    </h4>
                  ) : null}
                  <div>${product.product_variants[0].productPrice}</div>
                </div>
              </CardHeader>
              <CardBody className="overflow-visible py-1">
                <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src={`${process.env.BACK_BASE_URL}${product.product_variants[0].productImage}`}
                  width={200}
                  height={220}
                />
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
