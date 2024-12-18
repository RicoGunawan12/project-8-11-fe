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
    product_color : string,
  product_size : string,
  sku : string,
  productPrice : string,
  productWeigth : string,
  productWidth : string
  productLength : string,
  productHeight : string,
  productStock : string,
  productImage : string
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
    username : string;
    email : string;
    user_address : UserAddress[];
}

export interface Transaction {
  addressId: string;
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
}

export interface Payment {
  totalPrice : number,
  shippingFee : number,
  voucher : number,
  grandTotal : number
}