import { ProductVariant } from "./product";

export interface Voucher {
    voucherId : string,
    voucherCode : string,
    voucherName : string,
    voucherType: string,
    voucherEndDate: Date,
    voucherStartDate: Date,
    maxDiscount: number,
    discount: number,
    quota: number,
    minimumPayment: number,
    variantsId: string,
    voucherVisibility: boolean,

    voucherSpecialEvent: boolean,
    productVariant : ProductVariant
}