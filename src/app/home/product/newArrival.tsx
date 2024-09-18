import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import Link from "next/link";
import { OUR_PRODUCT_DATA } from "@/app/utilities/dummy_data";

const NewArrivalProduct = () => {
  const products = OUR_PRODUCT_DATA;

  return (
    <div className="grid-cols-4 grid-rows-2 grid w-full justify-items-center gap-6">
      {products.map((product, idx) => {
        return (
          <Link href={`/product/${product.product_id}`} key={idx}>
            <Card className="py-4">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">
                  {product.product_name}
                </p>
                <small className="text-default-500">{product.rating}</small>
                <h4 className="font-bold text-large">{product.price}</h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src={product.photo_link}
                  width={270}
                  height={270}
                />
              </CardBody>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default NewArrivalProduct;
