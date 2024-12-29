"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import NavigationBar from "@/app/component/navbar";
import { Button, Input } from "@nextui-org/react";
import { ProductCard } from "@/app/model/productCard";
import { Loading } from "@/app/utilities/loading";
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
  const [quantity, setQuantity] = useState(1);
  const [ratingData, setRatingData] = useState<Rating[]>([])
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [buyVariant, setBuyVariant] = useState(0)

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

      console.log(data)
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

        const promo_details = data?.promo_details[0]?.promo
          ? [
            {
              promo: {
                promoAmount: data.promo_details[0].promo.promoAmount,
              },
            },
          ]
          : [];

        const fullVariantData = {
          cartItemId: "",
          productVariantId:
            data?.product_variants[variantChosen].productVariantId,
          quantity: payload.quantity,
          product_variant: {
            ...data?.product_variants[variantChosen],
            product: {
              productName: data?.productName,
              promo_details: promo_details
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

        {/* Center Column: Selected Product */}
        <div className="w-full py-6 lg:w-1/2 h-auto flex flex-col justify-center items-center mt-4 md:mt-0">
          {/* Main Product Image */}
          <div className="w-full flex justify-center items-center mb-6">
            <Image
              src={`${process.env.BACK_BASE_URL}${data?.product_variants[variantChosen]?.productImage || "/placeholder.png"}`}
              width={400}
              height={400}
              style={{ objectFit: "contain" }}
              alt="Product Image"
              className="border-2 rounded-lg w-3/4 lg:w-3/5 aspect-square"
            />
          </div>

          {/* Variant Thumbnails */}
          <div className="w-full lg:w-3/4 h-auto text-black overflow-x-auto py-4 flex gap-4 border-b-2">
            <div className="flex flex-nowrap justify-start items-center gap-4">
              {data?.product_variants.map((product, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col justify-center items-center cursor-pointer w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] p-2 rounded-lg border-2 transition-all ${variantChosen === idx ? "border-secondary shadow-md" : "border-gray-300"}`}
                  onClick={() => setVariantChosen(idx)}
                >
                  <Image
                    src={`${process.env.BACK_BASE_URL}${product.productImage || "/placeholder.png"}`}
                    width={150}
                    height={150}
                    alt="Variant Image"
                    className="object-contain w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="w-full justify-center items-start lg:w-1/2 text-black pr-4 md:pr-16 flex flex-col gap-8 lg:h-full overflow-y-auto">
          <div className="w-3/4">
            <h2 className="text-2xl md:text-3xl font-bold border-b-2 pb-2">
              {data?.productName}
            </h2>
            <div className="mt-2 text-lg md:text-xl font-light border-b-2 pb-2">
              {
                data.promo_details[0] ? (
                  <div>
                    <span className="line-through mr-2 text-gray-600">Rp. {data.product_variants[buyVariant].productPrice}</span>
                    <span className="font-semibold">Rp. {parseInt(data.product_variants[buyVariant].productPrice) - data.promo_details[0].promo.promoAmount > 0 ? parseInt(data.product_variants[buyVariant].productPrice) - data.promo_details[0].promo.promoAmount : 0}</span>
                  </div>
                ) : (
                  <div>
                    Rp. {data.product_variants[buyVariant].productPrice}
                  </div>
                )
              }
            </div>
            <div>
              <StarRating rating={parseFloat(data?.averageRating) ? parseFloat(data?.averageRating) : 0} disabled />
            </div>
          </div>

          <div className="flex flex-wrap w-3/4 gap-4">
            {data?.product_variants.map((product, idx) => (
              <div
                key={idx}
                className={`flex justify-center cursor-pointer border-2 px-4 py-2 rounded-md transition-all ${buyVariant === idx ? "border-secondary shadow-lg" : ""}`}
                onClick={() => setBuyVariant(idx)}
              >
                <Image
                  src={`${process.env.BACK_BASE_URL}${product.productImage}`}
                  width={120}
                  height={120}
                  alt="Not Found"
                  className="w-8 h-6 object-contain"
                />
                {product.productColor}
              </div>
            ))}
          </div>

          <div className="w-3/4">
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
                {data?.product_variants[buyVariant].productStock === "0" ? (
                  <span className="text-red-500">Out of Stock</span>
                ) : (
                  <span className="text-green-400">
                    In Stock: {data?.product_variants[buyVariant].productStock}
                  </span>
                )}
              </div>
            </div>
            <div className=" hidden lg:block font-light text-sm mt-4">
              Rp. {quantity * (data.promo_details[0] ? (Number(data?.product_variants[buyVariant].productPrice) - data.promo_details[0].promo.promoAmount > 0 ? Number(data?.product_variants[buyVariant].productPrice) - data.promo_details[0].promo.promoAmount : 0) : Number(data?.product_variants[buyVariant].productPrice))}
            </div>
            <Button
              onClick={addToCart}
              className="hidden lg:block w-full bg-secondary text-white font-semibold text-lg mt-6 py-2"
            >
              Add to Cart
            </Button>
          </div>

          <div className="w-3/4">
            <h3 className="text-2xl font-bold mb-4">
              Descriptions
            </h3>
            <p><span className="font-semibold">Size: </span>{data?.productSize} mL</p>
            <p className="pt-4">{data?.productDescription}</p>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-center text-black justify-center">
        <div className="w-1/2 mt-8">
          <strong>Rating:</strong>
          <StarRating
            rating={rating}
            onRatingChange={setRating} // Update rating
          />
        </div>
        <div className="w-1/2 mt-4">
          <strong>Comment:</strong>
          <textarea
            className="w-full p-2 mt-2 border rounded-lg text-black"
            placeholder="Write your comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)} // Update comment
          />
          <Button
            onClick={submitRating}
            className="mt-4 w-full bg-secondary text-white font-semibold text-lg py-2"
          >
            Submit Rating
          </Button>
        </div>

        <div className=" w-1/2 mt-8">
          <h4 className="text-xl font-semibold mb-4">What Customers are Saying:</h4>
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
            <p className="pb-4 mb-4">No reviews yet.</p>
          )}
        </div>
      </div>
      <Footer className="lg:mb-0 pb-16 "/>
      <div className="lg:hidden w-full p-2  flex justify-around fixed bottom-2">
        <button
          onClick={addToCart}
          className={`text-white rounded-xl bg-secondary flex shadow-2xl border-1 justify-between font-semibold text-lg px-6 py-2 w-3/5 ${data?.product_variants[buyVariant].productStock === "0" ? "bg-gray-300 cursor-not-allowed" : ""}`}
          disabled={data?.product_variants[buyVariant].productStock === "0"}
        >
          <span>Add to Cart</span>
          <span>
            Rp. {quantity * (data.promo_details[0] ? (Number(data?.product_variants[buyVariant].productPrice) - data.promo_details[0].promo.promoAmount > 0 ? Number(data?.product_variants[buyVariant].productPrice) - data.promo_details[0].promo.promoAmount : 0) : Number(data?.product_variants[buyVariant].productPrice))}
          </span>
          {data?.product_variants[buyVariant].productStock === "0" && (
            <span className="text-red-500 ml-2">Out of Stock</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
