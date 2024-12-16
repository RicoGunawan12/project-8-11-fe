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

        const fullVariantData = {
          cartItemId: "",
          productVariantId:
            data?.product_variants[variantChosen].productVariantId,
          quantity: payload.quantity,
          product_variant: {
            ...data?.product_variants[variantChosen],
            product: {
              productName: data?.productName,
            },
          },
        };

        if (existingItemIndex !== -1) {
          cartItems[existingItemIndex].quantity += payload.quantity;
        } else {
          cartItems.push(fullVariantData);
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
    <div className="bg-white w-screen h-screen pt-20">
      <NavigationBar />
      <div className="flex flex-col md:flex-row h-full items-center">
        <div className="w-full md:w-1/6 h-full text-black overflow-y-auto pt-4 md:pt-24 flex flex-col justify-center ">
          {data?.product_variants.map((product, idx) => (
            <div
              key={idx}
              className="flex justify-center items-center py-2 px-6"
            >
              <Image
                src={`${process.env.BACK_BASE_URL}${product.productImage}`}
                width={150}
                height={150}
                alt="Not Found"
                onClick={() => {
                  setVariantChosen(idx);
                }}
                className="cursor-pointer"
              />
            </div>
          ))}
        </div>

        <div className="w-3/4 h-3/4 flex justify-center items-center mt-4 md:mt-0">
          <Image
            src={`${process.env.BACK_BASE_URL}${data?.product_variants[variantChosen].productImage}`}
            width={400}
            height={400}
            style={{ objectFit: "fill" }}
            alt="Not Found"
            layout="intrinsic"
            className="border-2 p-20 w-2/3 aspect-square"
          />
        </div>

        {/* Right Column: Product Details */}
        <div className="w-full md:w-5/12 h-full text-black px-6 flex flex-col pt-4 md:pt-24 pb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold border-b-2 pb-2">
              {data?.productName}
            </h2>
            <div className="flex mt-2 text-lg md:text-xl font-light border-b-8 pb-2 border-dotted">
              Rp {data?.product_variants[variantChosen].productPrice}
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm font-semibold">Quantity: </span>
            <div className="flex items-center">
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
            <div className="ml-2 font-semibold">{data?.product_variants[variantChosen].productStock == "0" ? <div className="text-red-500">Out of Stock</div> : <div className="text-green-400">In Stock : {data?.product_variants[variantChosen].productStock}</div>}</div>
            </div>
              <div className="font-light text-sm mt-2">Subtotal : Rp. {quantity * Number(data?.product_variants[variantChosen].productPrice)}</div>
            <Button
              onClick={addToCart}
              className="w-full bg-secondary text-white font-semibold text-lg mt-6 py-2"
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
