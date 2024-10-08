export interface Product {
  categoryName: string;
  productName: string;
  productDescription: string;

  variants: [
    {
      productVariantName: string;
      productPrice: number;
      productStock: number;
      sku: string;
    }
  ];
  productImage: File[]
}