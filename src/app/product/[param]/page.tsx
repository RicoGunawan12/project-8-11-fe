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
import Footer from "@/app/component/footer";
import StarRating from "@/app/utilities/rating";
import { Rating } from "@/app/model/rating";

const TABS = ["Product Descriptions", "Product Review"];

const ProductDetailPage = () => {
  const router = useParams();
  const id = router.param;
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<ProductCard>();
  const [variantChosen, setVariantChosen] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [ratingData, setRatingData] = useState<Rating[]>([])
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

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

      const ratingResponse = await fetch(`${process.env.RATINGS}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const ratingData = await ratingResponse.json();
      if (!ratingResponse.ok) {
        throw new Error(ratingData.message);
      }

      console.log(ratingData)
      setData(data);
      setRatingData(ratingData.ratings); // Set fetched rating
      const clientToken = getTokenCookie();
      setToken(clientToken);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
        toastSuccess("Product added to cart!");
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

      toastSuccess("Product added to cart!");
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const submitRating = async () => {
    try {
      const payload = {
        productId: id,
        rating: rating,
        comment: comment,
      };

      const response = await fetch(`${process.env.RATINGS}`, {
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

      toastSuccess("Rating submitted successfully!");
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
      <div className="px-4 flex flex-col lg:flex-row lg:h-full items-start md:items-center space-y-8 md:space-y-0">
        {/* Left Column: Product Variants */}
        <div className="w-full lg:w-1/6 h-1/6 lg:h-full text-black overflow-y-auto py-4 flex items-center lg:flex-col border-b-2 lg:border-b-0 lg:border-r-2 justify-center lg:space-y-4">
          {data?.product_variants.map((product, idx) => (
            <div
              key={idx}
              className="flex h-full w-1/4 lg:w-full lg:h-[15%] justify-center items-center lg:py-2 px-2 cursor-pointer"
              onClick={() => setVariantChosen(idx)}
            >
              <Image
                src={`${process.env.BACK_BASE_URL}${product.productImage}`}
                width={150}
                height={150}
                alt="Not Found"
                className={`border-2 w-3/4 h-full object-contain ${
                  variantChosen === idx ? "border-secondary" : "border-transparent"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Center Column: Selected Product */}
        <div className="w-full py-6 lg:w-3/6 h-1/3 lg:h-3/4 flex justify-center items-center mt-4 md:mt-0">
          <Image
            src={`${process.env.BACK_BASE_URL}${data?.product_variants[variantChosen].productImage}`}
            width={400}
            height={400}
            style={{ objectFit: "cover" }}
            alt="Not Found"
            className="border-2 w-5/6 aspect-square"
          />
        </div>

        {/* Right Column: Product Details */}
        <div className="w-full justify-center items-center lg:w-2/6 text-black pr-4 md:pr-8 flex flex-col gap-4 pt-4 lg:h-3/4 lg:pt-32">
          <div className="w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold border-b-2 pb-2">
              {data?.productName}
            </h2>
            <div className="mt-2 text-lg md:text-xl font-light border-b-2 pb-2">
              Rp {data?.product_variants[variantChosen].productPrice}
            </div>
          </div>
          <div className="w-1/2">
            <span className="text-sm font-semibold">Quantity: </span>
            <div className="flex items-center mt-2">
              <button
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
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
              <div className="ml-4 font-semibold">
                {data?.product_variants[variantChosen].productStock === "0" ? (
                  <span className="text-red-500">Out of Stock</span>
                ) : (
                  <span className="text-green-400">
                    In Stock: {data?.product_variants[variantChosen].productStock}
                  </span>
                )}
              </div>
            </div>
            <div className=" hidden lg:block font-light text-sm mt-4">
              Rp. {quantity * Number(data?.product_variants[variantChosen].productPrice)}
            </div>
            <Button
              onClick={addToCart}
              className="hidden lg:block w-full bg-secondary text-white font-semibold text-lg mt-6 py-2"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full my-12 px-4 flex flex-col items-center">
        <div className="flex space-x-4 border-b-2 w-1/2">
          {TABS.map((tab, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 ${
                activeTab === idx
                  ? "rounded-t-2xl bg-secondary text-white font-bold"
                  : "text-black"
              }`}
              onClick={() => setActiveTab(idx)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 text-black flex justify-start w-1/2">
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
                    <div className="w-1/2 mt-8">
                      <strong>Rating:</strong>
                      <StarRating
                        rating={rating}
                        onRatingChange={setRating} // Update rating
                      />
                    </div>
                    <div className="mt-4">
                      <strong>Comment:</strong>
                      <textarea
                        className="w-full p-2 mt-2 border rounded-lg"
                        placeholder="Write your comment here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)} // Update comment
                      />
                    </div>
                    <Button
                      onClick={submitRating}
                      className="mt-4 w-full bg-secondary text-white font-semibold text-lg py-2"
                    >
                      Submit Rating
                    </Button>
          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-4">All Reviews</h4>
            {ratingData.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {ratingData.map((review, index) => (
                  <div key={index} className="border-b-2 pb-4 mb-4">
                    <div className="flex items-center">
                      <StarRating rating={parseInt(review.rating)} />
                      <span className="ml-2 text-sm text-gray-500">{review.user.fullName}</span>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
                  </div>
                );
              default:
                return <div>Tab content not found.</div>;
            }
          })()}
        </div>
      </div>
      <Footer />
      <div className="lg:hidden w-full p-2 bg-secondary flex justify-around">
        <button
          onClick={addToCart}
          className="bg-white rounded-xl text-secondary flex justify-between font-semibold text-lg px-6 py-2 w-1/2"
        >
          <span>Add to Cart</span>
          <span>
            Rp. {quantity * Number(data?.product_variants[variantChosen].productPrice)}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
