"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import { toastError } from "@/app/utilities/toast";
import { Loading } from "@/app/utilities/loading";
import { ProductCard } from "@/app/model/productCard";
import StarRating from "@/app/utilities/rating";

// Declare fbq for TypeScript
declare global {
  interface Window {
    fbq: any;
  }
}

const OurProductSection = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.PRODUCTS}/category`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log(data)
        setProducts(data.products);

        // Set the first category as active by default
        if (data.products.length > 0) {
          setActiveCategoryId(data.products[0].productCategoryId);
          // Track initial category view
          trackViewCategory(data.products[0].productCategoryName);
        }
      } catch (error: any) {
        toastError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Track category view
  const trackViewCategory = (categoryName: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_type: 'product_category',
        content_name: categoryName
      });
    }
  };

  // Track product view
  const trackViewProduct = (product: ProductCard) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_type: 'product',
        content_ids: [product.productId],
        content_name: product.productName,
        content_category: activeCategory?.productCategoryName,
        currency: 'IDR',
        value: product.promo_details[0] 
          ? parseInt(product.product_variants[0].productPrice) - product.promo_details[0].promo?.promoAmount 
          : parseInt(product.product_variants[0].productPrice)
      });
    }
  };

  // Handle category change with tracking
  const handleCategoryChange = (categoryId: string, categoryName: string) => {
    setActiveCategoryId(categoryId);
    trackViewCategory(categoryName);
  };

  if (loading) {
    return <Loading />;
  }

  const activeCategory = products.find(
    (category) => category.productCategoryId === activeCategoryId
  );

  return (
    <div className="w-screen flex flex-col items-center my-6">
      <div className="text-3xl font-bold text-black">Our Product</div>

      <div className="mt-8 w-full px-10 flex flex-col">
        <div className="md:w-full flex justify-center">
          <div 
            className="flex flex-row gap-8 mb-10 pb-4 overflow-x-auto mx-2 md:mx-8"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "gray transparent",
            }}
          >
            {products.map((category) => (
              <button
                key={category.productCategoryId}
                onClick={() => handleCategoryChange(category.productCategoryId, category.productCategoryName)}
                className={`text-xs md:text-md text-secondary font-semibold p-2 rounded ${
                  activeCategoryId === category.productCategoryId
                    ? "border-secondary border-b-2"
                    : null
                }`}
              >
                {category.productCategoryName}
              </button>
            ))}
          </div>
        </div>

        {activeCategory ? (
          <>
            <div className="grid grid-cols-2 text-black md:grid-cols-3 lg:px-24 lg:grid-cols-4 gap-16">
              {activeCategory.products.map((product: ProductCard) => (
                <Link 
                  key={product.productId} 
                  onClick={() => trackViewProduct(product)}
                  href={`/product/${product.productId}`}
                >
                  <div className="text-xs">
                    <Image
                      src={`${process.env.BACK_BASE_URL}${product.defaultImage}`}
                      alt={product.productName}
                      width={200}
                      height={200}
                      className="w-full object-fill aspect-square"
                    />
                    
                    <div className="text-lg font-semibold text-black w-full text-left p-2">
                    <div className="flex gap-2 text-xs items-center">
                      <StarRating rating={parseFloat(product?.averageRating) ? parseFloat(product?.averageRating) : 0} disabled />
                      <p>{product.countRating} reviews</p>
                    </div>
                      <p>{product.productName}</p>
                      {product.promo_details[0] && product.promo_details[0].promo != null ? (
                        <div className="flex text-xs font-normal justify-start">
                          <span className="line-through mr-2 text-gray-600">
                            Rp. {product.product_variants[0].productPrice}
                          </span>
                          <span className="font-semibold">
                            Rp. {parseInt(product.product_variants[0].productPrice) - product.promo_details[0].promo?.promoAmount > 0 
                              ? parseInt(product.product_variants[0].productPrice) - product.promo_details[0].promo?.promoAmount 
                              : 0}
                          </span>
                        </div>
                      ) : (
                        <div className="flex text-xs font-normal justify-start">
                          <p>Rp. {product.product_variants[0].productPrice}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-gray-500">No products available in this category</div>
        )}
      </div>
    </div>
  );
};

export default OurProductSection;