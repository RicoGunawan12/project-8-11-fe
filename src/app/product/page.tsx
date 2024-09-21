import React from "react";
import Navbar from "../component/navbar";

import { ProductCard } from "../model/product";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import Image from "next/image";

const generateDummyData = (num: number): ProductCard[] => {
  return Array.from({ length: num }, (_, index) => ({
    product_id: index.toString(),
    photo_link:
      "https://scontent-cgk1-2.cdninstagram.com/v/t51.29350-15/449719214_797251469152405_1782651565383336025_n.heic?stp=dst-jpg_e35_p1080x1080&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTcuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=101&_nc_ohc=5Y9EyFZt01IQ7kNvgGWNdEK&_nc_gid=77692bb39e734791ac36fc19d4000751&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQwNTI5NDk5MTA1MzE5OTQxNw%3D%3D.3-ccb7-5&oh=00_AYDWVU48dQq0l3WE0Zw4fG1xOoj1gzNK0b6a9iR1ID-4KQ&oe=66E9719E&_nc_sid=0b30b7",
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
      <Navbar />
      <div className="grid-cols-5 grid w-full justify-items-center pt-12">
        {dummyProducts.map((product, index) => (
          <Link href={`/product/${product.product_id}`}>
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
