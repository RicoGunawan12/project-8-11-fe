export interface ProductCard {
  productId : string,
  productName : string,
  productDescription : string,
  product_category : {
    productCatgoryName : string
  },
  product_variants:[{
    productImage : string,
    productPrice : number,
    productStock : number,
    productVariantId : string,
    sku : string
  }]
}
