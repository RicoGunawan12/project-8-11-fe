"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import NavigationBar from "@/app/component/navbar";
import { Button, Input } from "@nextui-org/react";
import { ProductCard } from "@/app/model/productCard";
import Loading from "@/app/utilities/loading";
import { getTokenCookie } from "@/app/utilities/token";
import { toastError, toastSuccess } from "@/app/utilities/toast";

const TABS = ["Product Details", "Specifications", "Reviews"];

const ProductDetailPage = () => {
  const router = useParams();
  const id = router.param;
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<ProductCard>();
  const [variantChosen, setVariantChosen] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [quantity, setQuantity] = useState(0)

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

  const addToCart = async () => {
    try {
      const payload = {
        productVariantId: data?.product_variants[variantChosen].productVariantId,
        quantity: quantity,
      };

      const response = await fetch(`${process.env.CART}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const resp = await response.json();
      if (!response.ok) {
        throw new Error(resp.message);
      }
      toastSuccess(resp.message);
    } catch (error: any) {
      toastError(error.message);
    }
  };


  if (!data) {
    return <Loading />;
  }

  return (
    <div className="bg-white w-screen h-screen overflow-hidden">
      <NavigationBar />
      <div className="flex h-full">
        {/* Variant List */}
        <div className="w-1/12 h-full text-black overflow-y-auto pt-24">
          {data?.product_variants.map((product, idx) => (
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
          ))}
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

        {/* Variant Data with Tabs */}
        <div className="w-5/12 h-full text-black px-6 flex flex-col justify-between pt-24 pb-12">
          <div>
            <h2 className="text-5xl font-bold">{data?.productName}</h2>
            <div className="flex mt-2">
              ${data?.product_variants[variantChosen].productPrice}
            </div>
            {/* Tab Header */}
            <div className="flex space-x-4 mt-6 border-b-2">
              {TABS.map((tab, idx) => (
                <button
                  key={idx}
                  className={`px-4 py-2 ${activeTab === idx ? " rounded-t-2xl bg-gray-200 border-black font-bold" : ""
                    }`}
                  onClick={() => setActiveTab(idx)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 0 && (
                <div>
                  <h2 className="text-3xl font-bold">Product Details</h2>
                  <div>{data?.product_variants[variantChosen].sku}</div>
                </div>
              )}
              {activeTab === 1 && (
                <div>
                  <h2 className="text-3xl font-bold">Specifications</h2>
                  <p>Specs</p>
                </div>
              )}
              {activeTab === 2 && (
                <div>
                  <h2 className="text-3xl font-bold">Reviews</h2>
                  <p>Review</p>
                </div>
              )}
            </div>
          </div>

          {/* Quantity Input and Add to Cart Button */}
          {token ? (
            <div>
              <Input
                type="number"
                label="Quantity"
                placeholder="0"
                labelPlacement="outside"
                onChange={(e) => setQuantity(parseInt(e.target.value))} // Update quantity state
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
