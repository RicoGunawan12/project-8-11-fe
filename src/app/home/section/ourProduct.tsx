"use client";
import {
  hotProduct,
  newArrivalProduct,
  onSaleProduct,
  trendingProduct,
} from "@/app/utilities/dummy_data";
import React, { useState, useCallback, useMemo } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { ProductCard } from "@/app/model/productCard";
import Link from "next/link";
import Image from "next/image";
import { renderStars } from "@/app/utilities/icons";

const OurProductSection = () => {
  type ProductCategory = "hot" | "onSale" | "trending" | "newArrival";

  const PRODUCT_CATEGORIES = useMemo(
    () => ({
      hot: hotProduct,
      onSale: onSaleProduct,
      trending: trendingProduct,
      newArrival: newArrivalProduct,
    }),
    []
  );

  const [products, setProducts] = useState<ProductCard[]>(
    PRODUCT_CATEGORIES.hot
  );

  const handleProductChange = useCallback(
    (category: ProductCategory) => {
      setProducts(PRODUCT_CATEGORIES[category]);
    },
    [PRODUCT_CATEGORIES]
  );

  return (
    <div className="w-screen h-screen flex items-center flex-col">
      <div className="mt-20 text-8xl font-bold text-black">Our Product</div>
      <div className="flex text-black text-lg font-medium gap-10">
        <button onClick={() => handleProductChange("hot")}>HOT</button>
        <button onClick={() => handleProductChange("onSale")}>ON SALE</button>
        <button onClick={() => handleProductChange("trending")}>
          TRENDING NOW
        </button>
        <button onClick={() => handleProductChange("newArrival")}>
          NEW ARRIVAL
        </button>
      </div>
      <div className="mt-4">
        <div className="grid-cols-4 grid-rows-2 grid w-full justify-items-center gap-6">
          {products.map((product, idx) => {
            return (
              <Link href={`/product/${product.productId}`} key={idx}>
                <Card className="py-4">
                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <p className="text-tiny uppercase font-bold">
                      {product.productName}
                    </p>
                    <small className="text-default-500">{renderStars(3)}</small>

                    <div className="flex">
                      {product.productDiscount ? (
                        <h4 className="line-through text-gray-500 mr-2">
                          $250000
                        </h4>
                      ) : null}
                      <div>$200000</div>
                    </div>
                  </CardHeader>
                  <CardBody className="overflow-visible py-1">
                    <Image
                      alt="Card background"
                      className="object-cover rounded-xl h-[200px]"
                      src={product.productImage}
                      width={200}
                      height={220}
                    />
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OurProductSection;
