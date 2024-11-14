export interface Product {
  productCategoryName: string;
  productName: string;
  productDescription: string;
  productVariants: {
    key : string
    productColor?: string;
    productSize?: string;
    sku: string;
    productPrice: number;
    productWeight: number;
    productStock: number;
  }[];
  productImage: File[];
}

export interface NewVariant{
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