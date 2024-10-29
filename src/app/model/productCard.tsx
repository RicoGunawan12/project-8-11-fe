export interface ProductCard {
  productId : string,
  productName : string,
  productDescription : string,
  product_category : string,
  product_variants : [{
    productVariantId : string,
    sku : string,
    productPrice : string,
    productStock : number,
    productImage : string,
    productDiscount : boolean
  }]
  productDiscount : boolean
}
