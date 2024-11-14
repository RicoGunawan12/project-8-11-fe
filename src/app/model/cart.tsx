export interface Cart{
    cartItemId: string;
    productVariantId: string;
    product_variant: ProductVariant;
    quantity : number
}

interface ProductVariant {
    productVariantId: string;
    productId: string;
    productColor: string;
    productSize: string | null;
    sku: string;
    productImage: string;
    productPrice: number;
    productWeight: number;
    productStock: number;
    productPromo: number;
    productPromoExpiry: string | null;
    ref_product_id: string;
}