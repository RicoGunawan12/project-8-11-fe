"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import NavigationBar from "@/app/component/navbar";
import { Button, Input } from "@nextui-org/react";
import { ProductCard } from "@/app/model/productCard";
import Loading from "@/app/utilities/loading";
import { Swiper, SwiperSlide } from "swiper/react";
import { getTokenCookie } from "@/app/utilities/token";

const ProductDetailPage = () => {
  const router = useParams();
  const id = router.param;
  const [token, setToken] = useState<string | null>(null);

  const [data, setData] = useState<ProductCard>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.PRODUCTS}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      setData(data);
      const clientToken = getTokenCookie();
      setToken(clientToken);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [variantChosen, setVariantChosen] = useState(0);

  const addToCart = () => {};

  if (!data) {
    return <Loading />;
  }

  return (
    <div className="bg-white w-screen h-screen overflow-y-hidden">
      <NavigationBar />
      <div className="flex h-full">
        {/* Variant List */}
        <div className="w-1/12 h-full text-black overflow-y-auto pt-product_detail">
          {data?.product_variants.map((product, idx) => {
            return (
              <div
                key={idx}
                className="flex justify-center items-center py-2 px-6"
              >
                <Image
                  src={`${process.env.BACK_BASE_URL}${product.productImage}`}
                  width={200}
                  height={200}
                  alt="Not Found"
                  onClick={() => {
                    setVariantChosen(idx);
                  }}
                />
              </div>
            );
          })}
        </div>
        {/* Selected Variant */}
        <div className="w-5/12 h-full flex justify-center items-center">
          <Image
            src={`${process.env.BACK_BASE_URL}${data?.product_variants[variantChosen].productImage}`}
            width={500}
            height={500}
            style={{ objectFit: "contain" }}
            alt="Not Found"
            layout="fixed"
          />
        </div>

        {/* Variant Data */}
        <div className="w-5/12 h-full text-black px-6 flex flex-col justify-between pt-24 pb-12">
          <div>
            <div className="text-5xl font-bold">{data?.productName}</div>
            <div className="flex mt-2">
              {data?.product_variants[variantChosen].productDiscount ? (
                <div className="line-through text-gray-500 mr-2">
                  ${data?.product_variants[variantChosen].productPrice}
                </div>
              ) : null}
              ${data?.product_variants[variantChosen].productPrice}
            </div>
            <div>{data?.product_variants[variantChosen].sku}</div>
          </div>
          {token ? (
            <div>
              <Input
                type="number"
                label="Quantity"
                placeholder="0"
                labelPlacement="outside"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small"></span>
                  </div>
                }
              />
              <Button
                onClick={addToCart}
                className="w-full bg-secondary text-white font-semibold text-lg mt-6"
              >
                Add to Cart
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
