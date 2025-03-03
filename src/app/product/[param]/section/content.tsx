"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import NavigationBar from "@/app/component/navbar";
import { Button, Input } from "@nextui-org/react";
import { ProductCard } from "@/app/model/productCard";
import { Loading, LoadingOverlay } from "@/app/utilities/loading";
import { getTokenCookie, getUserId } from "@/app/utilities/token";
import { toastError, toastSuccess } from "@/app/utilities/toast";
import Footer from "@/app/component/footer";
import StarRating from "@/app/utilities/rating";
import { Rating, RatingCount } from "@/app/model/rating";
import Link from "next/link";

const TABS = ["Product Descriptions", "Product Review"];

const ProductDetailContent = () => {
  const route = useRouter();
  const router = useParams();
  const id = router.param;
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<ProductCard>();
  const [variantChosen, setVariantChosen] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [ratingData, setRatingData] = useState<Rating[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [buyVariant, setBuyVariant] = useState(0);
  const [relatedProduct, setRelatedProduct] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [ratingDistribution, setRatingDistribution] = useState<RatingCount>();
  const [chosenImage, setChosenImage] = useState<string>("");
  const [userId, setUserId] = useState<string>("")

  const fetchProductDetail = async () => {
    const response = await fetch(`${process.env.PRODUCTS}/related/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    const defaultRatingDistribution: RatingCount = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    const ratingDistribution = {
      ...defaultRatingDistribution,
      ...data.ratingDistributionObject,
    };
    setData(data.product);
    setChosenImage(
      data.product.product_covers[0]?.productCover
        ? process.env.BACK_BASE_URL +
            data.product.product_covers[0].productCover
        : "/placeholder.webp"
    );
    setRelatedProduct(data.relatedProducts);
    setRatingDistribution(ratingDistribution);
  };

  const fetchRating = async () => {
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

    setRatingData(ratingData.ratings);
  };

  useEffect(() => {
    const fetchData = async () => {
      const clientToken = getTokenCookie();
      setToken(clientToken);
      fetchProductDetail();
      fetchRating();
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {

    // Wait a bit to ensure gtag is fully loaded
    const checkGtagInterval = setInterval(() => {

      if (
        typeof window !== "undefined" &&
        window.gtag &&
        typeof window.gtag === "function"
      ) {
        window.gtag("event", "view_product_detail", {
          product_name: data?.productName,
          page_location: window.location.href,
          page_path: `/product/${id}`,
          user_id : getUserId()
        });
        clearInterval(checkGtagInterval);
      }
    }, 1000); // Check every second

    // Clean up the interval
    return () => clearInterval(checkGtagInterval);
  }, [data?.productName, id]);

  const addToCart = async () => {
    try {
      const payload = {
        productVariantId: data?.product_variants[buyVariant].productVariantId,
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
                  promoAmount: data.promo_details[0].promo?.promoAmount,
                },
              },
            ]
          : [];

        const fullVariantData = {
          cartItemId: "",
          productVariantId: data?.product_variants[buyVariant].productVariantId,
          quantity: payload.quantity,
          product_variant: {
            ...data?.product_variants[buyVariant],
            product: {
              productName: data?.productName,
              promo_details: promo_details,
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
      } else {
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
          if (response.status === 401) {
            route.push("/auth/login");
          }
          throw new Error(resp.message);
        }

        toastSuccess("Product added to cart!");
      }
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Add to Cart', {
          content_type: 'Cart',
          content_product: [data],
          user_id : getUserId() || "guest"
        });
      }

      setQuantity(1);
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const submitRating = async () => {
    setLoading(true);
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
      setComment("");
      setRating(0);
      toastSuccess("Rating submitted successfully!");
      fetchProductDetail();
      fetchRating();
      setLoading(false);
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const trackViewProduct = (product: ProductCard) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "View Product", {
        content_type: "product",
        content_ids: [product.productId],
        content_name: product.productName,
        currency: "IDR",
        value: product.promo_details[0]
          ? parseInt(product.product_variants[0]?.productPrice) -
            product.promo_details[0].promo?.promoAmount
          : parseInt(product.product_variants[0]?.productPrice),
        user_id : getUserId()
      });
    }
  };

  if (!data) {
    return <Loading />;
  }

  return (
    <div className="bg-white w-screen h-screen pt-20">
      <NavigationBar />
      <div className="w-screen overflow-hidden px-4 py-8">
        <div className="w-full grid lg:grid-cols-2 px-6 gap-8 min-h-[600px]">
          {/* Left Column: Product Images */}
          <div
            className="flex flex-col w-full h-full overflow-hidden min-w-0"
            id="help"
          >
            {/* Main Product Image */}
            <div className="flex items-center justify-center mb-6">
              <Image
                src={chosenImage}
                width={500}
                height={500}
                style={{ objectFit: "contain" }}
                alt="Product Image"
                className="border rounded-lg w-2/3 max-w-full lg:max-w-[400px] aspect-square shadow-lg"
                priority
              />
            </div>

            {/* Variant Thumbnails */}
            <div className="flex gap-4 w-full overflow-x-auto py-4 border-t px-6 scrollbar-hide">
              {data?.product_covers.map((product, idx) => (
                <button
                  key={idx}
                  aria-label={`Select variant ${idx + 1}`}
                  className={`flex-shrink-0 cursor-pointer w-20 h-20 p-2 rounded-lg border-2 transition-transform transform ${
                    variantChosen === idx
                      ? "border-secondary shadow-md scale-105"
                      : "border-gray-300 hover:scale-105"
                  }`}
                  onClick={() => {
                    setVariantChosen(idx);
                    setChosenImage(
                      `${process.env.BACK_BASE_URL}${product.productCover}`
                    );
                  }}
                >
                  <Image
                    src={
                      product.productCover
                        ? `${process.env.BACK_BASE_URL}${product.productCover}`
                        : "/placeholder.webp"
                    }
                    width={150}
                    height={150}
                    alt={`Variant ${idx + 1}`}
                    className="object-contain w-full h-full rounded-md"
                    priority
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col text-black space-y-6">
            {/* Product Name and Price */}
            <div>
              <h2 className="text-3xl font-bold border-b pb-2">
                {data?.productName}
              </h2>
              <div className="mt-4 text-xl">
                {data.promo_details[0] &&
                data.promo_details[0].promo != null ? (
                  <div>
                    <span className="line-through mr-2 text-gray-600">
                      Rp. {data.product_variants[buyVariant]?.productPrice}
                    </span>
                    <span className="font-semibold text-black">
                      Rp.{" "}
                      {Math.max(
                        parseInt(
                          data.product_variants[buyVariant]?.productPrice
                        ) - data.promo_details[0].promo?.promoAmount,
                        0
                      )}
                    </span>
                  </div>
                ) : (
                  <div>
                    Rp. {data.product_variants[buyVariant]?.productPrice}
                  </div>
                )}
              </div>
            </div>

            {/* Product Variants */}
            <div className="flex flex-wrap gap-4">
              {data?.product_variants.map((product, idx) => (
                <button
                  key={idx}
                  aria-label={`Select color ${product.productColor}`}
                  className={`relative flex items-center border-2 gap-2 px-4 py-2 rounded-md transition-all ${
                    buyVariant === idx
                      ? "border-secondary shadow-lg"
                      : "border-gray-300"
                  } ${
                    product.productStock <= 0
                      ? "bg-gray-100 text-gray-500 opacity-50"
                      : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setBuyVariant(idx);
                    setQuantity(1);
                    setChosenImage(
                      `${process.env.BACK_BASE_URL}/assets/product/${data.productName.replace(/\//g, "")}/${product.productImage}`
                    );
                  }}
                  disabled={product.productStock <= 0}
                >
                  <Image
                    src={
                      product.productImage
                        ? `${process.env.BACK_BASE_URL}/assets/product/${data.productName.replace(/\//g, "")}/${product.productImage}`
                        
                        : "/placeholder.webp"
                    }
                    width={40}
                    height={40}
                    alt={product.productColor}
                    className="w-8 h-6 object-contain"
                    priority
                  />
                  <span>{product.productColor}</span>
                </button>
              ))}
            </div>

            {/* Quantity Selector */}
            <div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 border rounded-l bg-gray-100 hover:bg-gray-200"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <div className="px-4 py-2 border-t border-b w-16 text-center">
                    {quantity}
                  </div>
                  <button
                    onClick={() => {
                      if (
                        quantity <
                        data?.product_variants[buyVariant]?.productStock
                      ) {
                        setQuantity((prev) => prev + 1);
                      }
                    }}
                    className="px-4 py-2 border rounded-r bg-gray-100 hover:bg-gray-200"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <div className="font-semibold">
                  {data?.product_variants[buyVariant]?.productStock === 0 ? (
                    <span className="text-red-500">Out of Stock</span>
                  ) : (
                    <span className="text-green-400">
                      In Stock:{" "}
                      {data?.product_variants[buyVariant]?.productStock}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-6">
                <Button
                  onClick={addToCart}
                  className="w-1/2 bg-white border-secondary border-1 text-secondary hover:bg-gray-50"
                  disabled={
                    data?.product_variants[buyVariant]?.productStock <= 0
                  }
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={async () => {
                    setLoading(true);
                    await addToCart();
                    route.push("/cart");
                  }}
                  className="w-1/2 bg-secondary border-1 border-secondary text-white hover:bg-secondary-dark"
                  disabled={
                    data?.product_variants[buyVariant]?.productStock <= 0
                  }
                >
                  Buy Now
                </Button>
              </div>
            </div>


          </div>
        </div>
      </div>

                  {/* Product Description */}
            <div className="w-full p-6 flex flex-col justify-between items-center text-black">
              <div className="w-5/6 sm:w-1/2">
                <h3 className="text-2xl font-bold mb-4">Product Description</h3>
                <p className="mb-2">
                  <span className="font-semibold">Size: </span>
                  {data?.productSize} mL
                </p>
                <div
                  dangerouslySetInnerHTML={{ __html: data?.productDescription }}
                ></div>
              </div>
            </div>

      <div className="w-full p-6 flex flex-col justify-between items-center">
        <div className="text-2xl w-full lg:w-1/2 flex justify-between text-black font-bold mb-8">
          CUSTOMER REVIEWS
        </div>

        <div className="flex flex-col lg:flex-row w-4/5 md:w-1/2 justify-center lg:items-center gap-8 mb-8 text-black">
          {/* Rating Summary */}
          <div className="w-full lg:w-1/3">
            <div className="text-6xl font-bold">
              {parseFloat(
                data?.averageRating ? data.averageRating : "0"
              )?.toFixed(1)}
            </div>
            <div className="text-xl text-gray-500 mb-2">/ 5</div>
            <StarRating
              rating={
                parseFloat(data?.averageRating)
                  ? parseFloat(data?.averageRating)
                  : 0
              }
              disabled
            />
            <div className="text-sm text-gray-500 mt-2">
              {data?.countRating} reviews
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="w-full lg:w-1/3 text-black">
            {ratingDistribution ? (
              Object.entries(ratingDistribution)
                .sort(([a], [b]) => Number(b) - Number(a)) // Sort by rating descending
                .map(([rating, count]) => {
                  const total = Object.values(ratingDistribution).reduce(
                    (sum, val) => sum + val,
                    0
                  );
                  const percentage =
                    total > 0 ? ((count / total) * 100).toFixed(1) : "0";

                  return (
                    <div key={rating} className="flex items-center gap-2 mb-2">
                      <span className="w-8">{rating}★</span>
                      <div className="flex-1 bg-gray-200 h-2">
                        <div
                          className="h-full bg-black"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-12 text-right">{percentage}%</span>
                    </div>
                  );
                })
            ) : (
              <p>Loading ratings...</p> // Display a fallback while data is loading
            )}
          </div>

          {/* Write Review Button */}
          <div className="w-full lg:w-1/3 mt-4">
            <strong>Rating:</strong>
            <StarRating
              rating={rating}
              onRatingChange={setRating} // Update rating
            />
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
        </div>

        {/* Reviews List */}
        <div className="space-y-6 w-1/2 max-h-96 overflow-y-auto">
          {ratingData.map((review, index) => (
            <div key={index} className="border-b pb-6">
              <StarRating
                rating={
                  parseFloat(review.rating) ? parseFloat(review.rating) : 0
                }
                disabled
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="font-medium">{review.user.fullName}</span>
              </div>
              <p className="mt-2 text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-black text-xl font-bold px-6 mb-6 lg:px-24">
          Related Products
        </h1>
        <div className="grid grid-cols-2 text-black md:grid-cols-3 px-6  lg:px-24 lg:grid-cols-4 gap-16 mb-6">
          {relatedProduct.map((product: ProductCard) => (
            <Link
              key={product.productId}
              onClick={() => trackViewProduct(product)}
              href={`/product/${product.productId}`}
            >
              <div className="text-xs">
                <Image
                  src={
                    product.product_covers[0]
                      ? process.env.BACK_BASE_URL +
                        product.product_covers[0].productCover
                      : "/placeholder.webp"
                  }
                  alt={product.productName}
                  width={500}
                  height={500}
                  className="w-full object-fill aspect-square"
                  priority
                />

                <div className="text-lg font-semibold text-black w-full text-left p-2">
                  <p>
                    <StarRating
                      rating={
                        parseFloat(product?.averageRating)
                          ? parseFloat(product?.averageRating)
                          : 0
                      }
                      disabled
                    />
                  </p>
                  <p className="truncate text-lg">{product.productName}</p>
                  {product.promo_details[0] &&
                  product.promo_details[0].promo != null ? (
                    <div className="flex flex-wrap text-xs font-normal justify-start">
                      <span className="line-through mr-2 text-gray-600">
                        Rp. {product.product_variants[0]?.productPrice}
                      </span>
                      <span className="font-semibold">
                        Rp.{" "}
                        {parseInt(product.product_variants[0]?.productPrice) -
                          product.promo_details[0].promo?.promoAmount >
                        0
                          ? parseInt(
                              product.product_variants[0]?.productPrice
                            ) - product.promo_details[0].promo?.promoAmount
                          : 0}
                      </span>
                    </div>
                  ) : (
                    <div className="flex text-xs font-normal justify-start">
                      <p>Rp. {product.product_variants[0]?.productPrice}</p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer className="lg:mb-0 pb-16 " />
      <div className="lg:hidden w-full p-2 flex justify-around fixed bottom-2">
        <button
          onClick={addToCart}
          className={`text-white rounded-xl bg-secondary flex shadow-2xl border-1 justify-center font-semibold text-xs px-6 py-2 w-2/5 ${
            data?.product_variants[buyVariant].productStock === 0
              ? "bg-gray-300 cursor-not-allowed"
              : null
          }`}
          disabled={data?.product_variants[buyVariant].productStock === 0}
        >
          <span>Add to Cart</span>
        </button>
        <button
          onClick={async () => {
            setLoading(true);
            await addToCart();
            route.push("/cart");
          }}
          className={`text-white rounded-xl bg-secondary flex shadow-2xl border-1 justify-center font-semibold text-xs px-6 py-2 w-2/5 ${
            data?.product_variants[buyVariant].productStock === 0
              ? "bg-gray-300 cursor-not-allowed"
              : null
          }`}
          disabled={data?.product_variants[buyVariant].productStock === 0}
        >
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
};

export default ProductDetailContent;
