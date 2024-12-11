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

const TABS = ["Product Descriptions", "Product Detail"];

const ProductDetailPage = () => {
  const router = useParams();
  const id = router.param;
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<ProductCard>();
  const [variantChosen, setVariantChosen] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [quantity, setQuantity] = useState(0);

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
        productVariantId:
          data?.product_variants[variantChosen].productVariantId,
        quantity: quantity,
      };

      if (!token) {
        const existingCart = localStorage.getItem("cartItem");
        let cartItems = existingCart ? JSON.parse(existingCart) : [];

        const existingItemIndex = cartItems.findIndex(
          (item: any) => item.productVariantId === payload.productVariantId
        );
  
        if (existingItemIndex !== -1) {
          cartItems[existingItemIndex].quantity += payload.quantity;
        } else {
          cartItems.push(payload);
        }

        localStorage.setItem("cartItem", JSON.stringify(cartItems));
        toastSuccess("Item added to storage for later!");
        return;
      }

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
    <div className="bg-white w-screen h-screen">
      <NavigationBar />
      <div className="flex h-full">
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

        <div className="w-5/12 h-full text-black px-6 flex flex-col pt-24 pb-12">
          <div>
            <h2 className="text-5xl font-bold">{data?.productName}</h2>
            <div className="flex mt-2">
              ${data?.product_variants[variantChosen].productPrice}
            </div>
          </div>
          <div>
            <div className="flex items-center mt-4">
              <button
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))} // Ensure quantity stays >= 1
                className="px-4 py-2 border border-gray-300 rounded-l bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                -
              </button>
              <div className="px-4 py-2 border-t border-b w-16 border-gray-300 text-center">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-4 py-2 border border-gray-300 rounded-r bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                +
              </button>
            </div>
            <div className="mt-2 text-green-600">In Stock</div>

            <Button
              onClick={addToCart}
              className="w-full bg-secondary text-white font-semibold text-lg mt-6"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      <div className="flex space-x-4 mx-6 border-b-2">
        {TABS.map((tab, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 ${
              activeTab === idx
                ? " rounded-t-2xl  bg-secondary border-black font-bold"
                : " text-black"
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6 text-black">
        {(() => {
          switch (activeTab) {
            case 0:
              return (
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    Product Descriptions
                  </h3>
                  <p>{data?.productDescription}</p>
                </div>
              );
            case 1:
              return (
                <div>
                  <h3 className="text-2xl font-bold mb-4">Variant Details</h3>
                  {data?.product_variants ? (
                    <div className="mt-4 space-y-8">
                      {data.product_variants.map((variant, idx) => (
                        <div key={idx} className="border p-4 rounded-lg">
                          <h4 className="text-lg font-bold">
                            Variant {idx + 1}
                          </h4>
                          <div className="mt-2">
                            <div>
                              <strong>SKU:</strong> {variant.sku}
                            </div>
                            <div>
                              <strong>Height:</strong> {variant.productHeight}{" "}
                              cm
                            </div>
                            <div>
                              <strong>Length:</strong> {variant.productLength}{" "}
                              cm
                            </div>
                            <div>
                              <strong>Width:</strong> {variant.productWidth} cm
                            </div>
                            <div>
                              <strong>Weight:</strong> {variant.productWeight}{" "}
                              kg
                            </div>
                            <div>
                              <strong>Price:</strong> ${variant.productPrice}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No variant details available.</p>
                  )}
                </div>
              );
            default:
              return <div>Tab content not found.</div>;
          }
        })()}
      </div>
    </div>
  );
};

export default ProductDetailPage;
