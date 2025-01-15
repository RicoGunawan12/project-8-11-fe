export interface ProductCard {
  defaultImage: string,
  productDescription : string,
  productId : string,
  productName : string,
  product_category : {
    productCatgoryName : string
  },
  product_covers: [{
    productCover: string
  }]
  product_variants:[{
    productColor : string,
    productHeight : string,
    productLength : string
    productImage : string,
    productWeight : string,
    productWidth : string,
    productPrice : string,
    productStock : number,
    productSize : string,
    productVariantId : string,
    sku : string
  }],
  productSize : string,
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
  ratings: [
    {
      averageRating : string,
      countRating : string
    }
  ],
  averageRating : string,
  countRating : string
}