import { useParams } from "next/navigation";
import React from "react";
import ProductDetailContent from "./section/content";
import { Metadata } from "next";

type Props = {
  params: Promise<{ param: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const clearHtmlTags = (strToSanitize: string) => {
  return strToSanitize.replace(/(<([^>]+)>)/gi, '');
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const id = (await params).param;
  const metadataResponse = await fetch(`${process.env.METADATA}/default`); 

  if (!metadataResponse.ok) {
    return {
      title: "TYESO Indonesia",
      description: "TYESO Official Indonesia Website",
      keywords: ["Tyeso", "Product", "Bottle"],
    };
  }

  const productResponse = await fetch(`${process.env.PRODUCTS}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!productResponse.ok) {
    throw new Error("Internal server error, please inquire this issue to developer");
  }
  
  const metadata = await metadataResponse.json();
  const productData = await productResponse.json();

  return {
    title: productData.productName + " - " + metadata.title,
    description: clearHtmlTags(productData.productDescription),
    metadataBase: metadata.metadataBase,
    alternates: metadata.alternates,
    icons: metadata.icons,
    openGraph: metadata.openGraph,
    keywords: metadata.keywords,
  };
}

const ProductDetailPage = () => {

  return (
    <ProductDetailContent />
  );
};

export default ProductDetailPage;
