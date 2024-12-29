export interface ProductCard {
  defaultImage: string,
  productDescription : string,
  productId : string,
  productName : string,
  product_category : {
    productCatgoryName : string
  },
  product_variants:[{
    productColor : string,
    productHeight : string,
    productLength : string
    productImage : string,
    productWeight : string,
    productWidth : string,
    productPrice : string,
    productStock : string,
    productSize : string,
    productVariantId : string,
    sku : string
  }],
  averageRating : string
}