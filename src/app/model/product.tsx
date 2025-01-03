export interface Product {
  productCategoryName: string;
  productName: string;
  productDescription: string;
  productVariants: {
    key: string;
    productColor?: string;
    productSize?: string;
    sku: string;
    productPrice: number;
    productWeight: number;
    productStock: number;
  }[];
  productImage: File[];
}

export interface NewVariant {
  productColor: string;
  productSize: string;
  sku: string;
  productPrice: number;
  productWeight: number;
  productStock: number;
}

export interface ProductVariant {
  productSize: string;
  productColor: string;
  productPrice: string;
  productStock: string;
  productWeight: string;
  sku: string;
}

export interface CreateProductResponse {
  message: string;
  product: {
    productId: string;
    productName: string;
    productDescription: string;
    productCategoryName: string;
  };
}

export interface ExploreProduct {
  productId: string;
  productName: string;
  productDescription: string;
  defaultImage: string;
  product_category: {
    productCategoryName: string;
  };
  product_variants: [
    {
      productVariantId: string;
      productSize: string;
      productColor: string;
      sku: string;
      productPrice: number;
      productStock: number;
      productImage: string;
      productWeight: number;
      productLength: number;
      productWidth: number;
      productHeight: number;
    }
  ];
  promo_details:[
    {
      promo:{
        endDate : string,
        promoAmount : number,
        promoId : string,
        promoName : string,
        startDate : string
      }
    }
  ],
  averageRating: string
}
