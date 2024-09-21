import React from "react";

import { ProductCard } from "../model/product";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import Image from "next/image";
import NavigationBar from "../component/navbar";

const generateDummyData = (num: number): ProductCard[] => {
  return Array.from({ length: num }, (_, index) => ({
    product_id: index.toString(),
    photo_link: "/a.jpg",
    rating: Math.floor(Math.random() * 5) + 1,
    product_name: `Product ${index + 1}`,
    discount: Math.random() > 0.5,
    price: Math.floor(Math.random() * 500) + 10000,
    original_price: Math.floor(Math.random() * 500) + 15000,
  }));
};

const dummyProducts = generateDummyData(40);

const ProductPage = () => {
  return (
    <div className="w-screen bg-white">
      <NavigationBar />
      <div className="grid-cols-5 grid w-full justify-items-center pt-12">
        {dummyProducts.map((product, index) => (
          <Link href={`/product/${product.product_id}`} key={index}>
            <Card className="py-4">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">
                  {product.product_name}
                </p>
                <small className="text-default-500">{product.rating}</small>

                <div className="flex">
                  {product.discount ? (
                    <h4 className="line-through text-gray-500 mr-2">
                      ${product.original_price}
                    </h4>
                  ) : null}
                  <div>${product.price}</div>
                </div>
              </CardHeader>
              <CardBody className="overflow-visible py-1">
                <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src={product.photo_link}
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
