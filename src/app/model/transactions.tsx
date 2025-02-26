interface Product {
  defaultImage: string | null;
  productCategoryId: string;
  productDescription: string;
  productId: string;
  productName: string;
  ref_product_category_id: string;
  productColor: string;
  productImage: string;
  productPrice: number;
  productPromo: number;
  productPromoExpiry: string | null;
  productSize: string;
  productStock: number;
  productVariantId: string;
  productWeight: number;
  ref_product_id: string;
  sku: string;
}

export interface TransactionDetail {
  paidProductPrice: number;
  productVariantId: string;
  product_variant: {
    productColor : string,
    productSize : string,
    sku : string,
    productPrice : string,
    productWeigth : string,
    productWidth : string
    productLength : string,
    productHeight : string,
    productStock : string,
    productImage : string,
    product: Product
  };
  quantity: number;
  realizedPromo: number;
  ref_product_variant_id: string;
  ref_transaction_id: string;
  transactionDetailId: string;
  transactionId: string;
}

interface UserAddress{
    addressId : string;
    userId : string;
    receiverName : string;
    receieverPhoneNumber: string;
    kompshipAddressId : string;
    komshipLabel : string,
    addressProvicne: string,
    addressCity : string;
    addressSubdistrict : string;
    postalCode : string,
    addressDetail : string,
    ref_user_id : string;
}

interface User {
    userId : string;
    fullName : string;
    email : string;
    user_address : UserAddress[];
}

export interface Transaction {
  addressId: string;
  readableId: string;
  deliveryCashback: number;
  deliveryFee: number;
  expedition: string;
  komshipOrderId: string | null;
  komshipOrderNumber: string | null;
  notes: string;
  paymentDeadline: string;
  paymentMethod: string;
  ref_user_id: string;
  ref_voucher_id: string | null;
  shippingType: string;
  status: string;
  totalPrice: number;
  totalWeight: number;
  transactionDate: string;
  transactionId: string;
  transaction_details: TransactionDetail[];
  userId: string;
  user: User;
  voucherId: string | null;
  paymentLink: string
  awb: string;
}

export interface Delivery {
  airway_bill: string;
  last_status: string;
  history: {
    desc: string;
    date: string;
    code: string;
    status: string;
  }[]
}

export interface Payment {
  totalPrice : number,
  shippingFee : number,
  voucher : number,
  grandTotal : number
}