"use client";
import React, { useCallback, useEffect, useState } from "react";
import NavigationBar from "../component/navbar";
import Image from "next/image";
import {
  deleteTokenCookie,
  getTokenCookie,
  getUserId,
} from "../utilities/token";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "../utilities/toast";
import { Cart } from "../model/cart";
import { Loading, LoadingOverlay } from "../utilities/loading";
import { UserAddress } from "../model/address";
import { Shipping } from "../model/shipping";
import { useDebounce } from "use-debounce";
import { Payment } from "../model/transactions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTrashCan,
  faExclamationCircle,
  faPercentage,
  faMoneyBill,
  faShippingFast,
  faBottleWater,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../component/footer";
import { useLocaleStore } from "../component/locale";
import DeleteConfirmationModal from "../component/modal/deleteConfirmation";
import { pre } from "framer-motion/client";
import { Ongkir } from "../model/ongkir";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Voucher } from "../model/voucher";
import { formatCurrency } from "../utilities/converter";

const CartPage = () => {
  const router = useRouter();
  const [data, setData] = useState<Cart[]>([]);
  const [address, setAddress] = useState<UserAddress[]>([]);
  const [chosenAddress, setChosenAddress] = useState<UserAddress>();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [shippingOptions, setShippingOptions] = useState<Shipping[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<Shipping | null>(
    null
  );
  const [customerNotes, setCustomerNotes] = useState("");
  const [productNotes, setProductNotes] = useState<string[]>([]);
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [isShippingEnabled, setIsShippingEnabled] = useState(false);
  const [clientToken, setClientToken] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const [debouncedChosenAddress] = useDebounce(chosenAddress, 3000);
  const [debouncedQuantities] = useDebounce(quantities, 3000);
  const [price, setPrice] = useState<Payment>({
    totalPrice: 0,
    shippingFee: 0,
    voucher: 0,
    grandTotal: 0,
    visibleVoucher: 0,
  });
  const [update, setUpdate] = useState(false);
  const { locale } = useLocaleStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [removedProduct, setRemoveProduct] = useState<{
    name: string;
    id: string;
    price: number;
    quantity: number;
  }>();
  const [maxCOD, setMaxCOD] = useState<number>(0);
  const [isCOD, setIsCOD] = useState<boolean>(false);
  const [ongkir, setOngkir] = useState<Ongkir>();
  const [totalWeight, setTotalweight] = useState<number>(0);

  const [visibleVoucher, setVisibleVoucher] = useState<Voucher[]>([]);
  const [selectedVouchers, setSelectedVouchers] = useState<Voucher[]>([]);
  const [appliedVouchers, setAppliedVouchers] = useState<Voucher[]>([]);
  const [modalSize, setModalSize] = useState('2xl');

  const checkWindowSize = () => {
    if (window.innerWidth <= 768) {
      setModalSize('md'); // Mobile screen
    } else {
      setModalSize('5xl'); // Larger screen
    }
  };


  const handleSelect = (voucher: Voucher) => {
    if (price.totalPrice < voucher.minimumPayment) return;
    if (voucher.voucherSpecialEvent) {
    } else if (voucher.voucherType === "ongkir" && selectedShipping === null) {
      return;
    } else if (
      !checkVariantVoucherExist(voucher) &&
      voucher.voucherType === "product"
    ) {
      return;
    } else if (
      selectedVouchers.some(
        (v) =>
          v.voucherType === voucher.voucherType &&
          v.voucherId !== voucher.voucherId &&
          !v.voucherSpecialEvent
      )
    ) {
      return;
    }
    setSelectedVouchers((prev: Voucher[]) => {
      // const filteredVouchers = prev.filter((v) => v.voucherType !== voucher.voucherType);

      if (prev.some((v) => v.voucherId === voucher.voucherId)) {
        return prev.filter((v) => v.voucherId !== voucher.voucherId);
      } else {
        return [...prev, voucher];
      }
    });
  };

  const handleApplyVoucher = async () => {
    setAppliedVouchers([...selectedVouchers]);
    setIsVoucherOpen(false);

    let totalVoucherDiscount = 0;
    let totalVoucherFreeOngkir = 0;
    let totalVoucherProduct = 0;

    selectedVouchers.forEach((voucher: Voucher) => {
      if (voucher.voucherType === "fixed") {
        totalVoucherDiscount += voucher.maxDiscount;
      } else if (voucher.voucherType === "percentage") {
        const discountAmount = (price.totalPrice * voucher.discount) / 100;
        totalVoucherDiscount += Math.min(discountAmount, voucher.maxDiscount);
      } else if (voucher.voucherType === "ongkir") {
        totalVoucherFreeOngkir += Math.min(
          voucher.discount,
          Math.min(price.shippingFee, price.totalPrice)
        );
      } else if (voucher.voucherType === "product") {
        totalVoucherProduct += voucher.discount;
        totalVoucherFreeOngkir += Math.min(
          voucher.discount,
          selectedShipping?.service_fee ?? 0
        );
      }
    });
    setPrice((prev) => ({
      ...prev,
      // shippingFee: prev.shippingFee - totalVoucherFreeOngkir,

      visibleVoucher:
        totalVoucherDiscount + totalVoucherFreeOngkir + totalVoucherProduct,
      grandTotal:
        prev.totalPrice -
        totalVoucherDiscount -
        totalVoucherFreeOngkir -
        totalVoucherProduct, // Subtract voucher from grand total
    }));
  };

  //   visibleVoucher: totalVoucherDiscount + totalVoucherFreeOngkir,
  //   grandTotal: prev.totalPrice - totalVoucherDiscount - totalVoucherFreeOngkir, // Subtract voucher from grand total
  // }));
  // }

  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'View Cart Page', {
        user_id : getUserId()
      });
    }
  }, [])

  useEffect(() => {
    const token = getTokenCookie();
    setClientToken(token);

    checkWindowSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkWindowSize);

    // Cleanup on component unmoun

    const fetchCartAndAddressData = async () => {
      try {
        const cartResponse = await fetch(`${process.env.CART}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cartResponse.status === 401) {
          deleteTokenCookie();
          router.push("/auth/login");
        }
        const cartData: Cart[] = await cartResponse.json();
        if (!cartResponse.ok) {
          throw new Error(cartData.message || "Failed to fetch cart data");
        }

        const addressResponse = await fetch(`${process.env.ADDRESS}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const addressData = await addressResponse.json();
        if (!addressResponse.ok) {
          throw new Error(
            addressData.message || "Failed to fetch address data"
          );
        }
        setData(cartData);
        setQuantities(
          cartData.reduce((acc: { [key: string]: number }, item: Cart) => {
            acc[item.productVariantId] = item.quantity || 1;
            return acc;
          }, {})
        );
        setAddress(addressData);

        const cartTotal = data.reduce(
          (total, item) =>
            total + item.quantity === 1
              ? item.product_variant?.productPrice -
                  item.product_variant.product?.promo_details[0].promo
                    .promoAmount >
                0
                ? item.product_variant?.productPrice -
                  item.product_variant.product?.promo_details[0].promo
                    .promoAmount
                : 0
              : 0 * item.quantity,
          0
        );
        setPrice((prev) => ({ ...prev, totalPrice: cartTotal }));

        const codResponse = await fetch(`${process.env.COD}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const codData = await codResponse.json();
        if (!codResponse.ok) {
          throw new Error(addressData.message || "Failed to fetch cod data");
        }
        setMaxCOD(codData.codData ? codData.codData.maximumPaymentAmount : 0);
        const ongkirResponse = await fetch(`${process.env.FREE_ONGKIR}`, {
          method: "GET",
        });
        const ongkirData = await ongkirResponse.json();

        if (!ongkirResponse.ok) {
          throw new Error(
            addressData.message || "Failed to fetch address free ongkir"
          );
        }
        setOngkir(ongkirData.freeOngkir);

        const voucherResponse = await fetch(`${process.env.VOUCHER}/visible`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!voucherResponse.ok) {
          throw new Error("Failed to fetch visible voucher");
        }
        const fetchedVisibleVoucher = await voucherResponse.json();
        console.log(fetchedVisibleVoucher);

        const vc: Voucher[] = fetchedVisibleVoucher.vouchers;

        const vf: Voucher[] = [];

        for (const v of vc) {
          if (v.voucherType === "product") {
            for (const p of cartData) {
              console.log("this: ", p.productVariantId, v);
              if (v.variantsId == p.productVariantId) {
                console.log("push");
                v.discount = p.product_variant.productPrice;
              }
            }
          }

          vf.push(v);
        }
        console.log(vf);
        setVisibleVoucher(vf);
        // setVisibleVoucher(fetchedVisibleVoucher.vouchers)

        setLoading(false);
      } catch (error: any) {
        // toastError(error.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    const getVisibleVoucher = async () => {
      try {
        const voucherResponse = await fetch(`${process.env.VOUCHER}/visible`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!voucherResponse.ok) {
          throw new Error("Failed to fetch visible voucher");
        }
        const fetchedVisibleVoucher = await voucherResponse.json();
        console.log(fetchedVisibleVoucher);

        setVisibleVoucher(fetchedVisibleVoucher.vouchers);
      } catch (error: any) {
        // toastError(error.message || "An unexpected error occurred");
      }
    };
    getVisibleVoucher();

    if (token) {
      setLoading(true);
      fetchCartAndAddressData();
    } else {
      const cartData = JSON.parse(localStorage.getItem("cartItem") || "{}");

      if (!Array.isArray(cartData) || cartData.length === 0) {
        return;
      }
      setData(cartData);
      setQuantities(
        cartData?.reduce((acc: { [key: string]: number }, item: Cart) => {
          acc[item.productVariantId] = item.quantity || 1;
          return acc;
        }, {})
      );
    }
    setLoading(false);
    return () => {
      window.removeEventListener('resize', checkWindowSize);
    };
  }, [router, clientToken, update]);

  const recalculateTotalPrice = () => {
    const cartTotal = data.reduce((total, item) => {
      const quantity = quantities[item.productVariantId] || 1;
      if (
        item.product_variant.product?.promo_details[0]?.promo &&
        quantity === 1
      ) {
        return (
          total +
          (item.product_variant?.productPrice -
            item.product_variant.product?.promo_details[0].promo.promoAmount >
          0
            ? item.product_variant?.productPrice -
              item.product_variant.product?.promo_details[0].promo.promoAmount
            : 0) *
            quantity
        );
      } else {
        return total + item.product_variant?.productPrice * quantity;
      }
    }, 0);
    setSelectedShipping(null);
    setPrice((prev) => ({ ...prev, totalPrice: cartTotal, shippingFee: 0 }));
  };

  useEffect(() => {
    recalculateTotalPrice();
  }, [quantities, data]);

  const calculateShippingOptions = useCallback(async () => {
    if (!chosenAddress) return;

    setLoading(true);

    let totalWeight = 0;
    const cartTotal = data.reduce((total, item) => {
      const quantity = quantities[item.productVariantId] || 1;
      totalWeight += item.product_variant.product.productWeight * quantity;
      if (
        item.product_variant.product?.promo_details[0]?.promo &&
        quantity === 1
      ) {
        return (
          total +
          (item.product_variant?.productPrice -
            item.product_variant.product?.promo_details[0].promo.promoAmount >
          0
            ? item.product_variant?.productPrice -
              item.product_variant.product?.promo_details[0].promo.promoAmount
            : 0) *
            quantity
        );
      } else {
        return total + item.product_variant?.productPrice * quantity;
      }
    }, 0);

    setTotalweight(totalWeight);

    var literalTotal = 0;
    data.forEach((item) => {
      literalTotal += item.product_variant?.productPrice;
    });

    const response = await fetch(`${process.env.ADDRESS}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${clientToken}` },
    });

    const resp = await response.json();
    if (!response.ok) throw new Error(resp.message);

    setPrice((prev) => ({ ...prev, totalPrice: cartTotal }));

    const url = `${
      process.env.ADDRESS
    }/calculate?shipperDestinationId=1&receiverDestinationId=${
      chosenAddress.komshipAddressId
    }&weight=${totalWeight}&itemValue=${literalTotal}&cod=${
      isCOD ? "yes" : "no"
    }`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${clientToken}` },
      });

      const resp = await response.json();
      if (!response.ok) throw new Error(resp.message);

      setShippingOptions(resp.calculationResult.data.calculate_reguler);
      setIsShippingEnabled(true);
    } catch (error: any) {
      console.error(error.message || "Failed to calculate shipping options");
    } finally {
      setLoading(false);
    }
  }, [clientToken, data, quantities, chosenAddress, isCOD]);

  useEffect(() => {
    if (clientToken && debouncedChosenAddress && debouncedQuantities) {
      calculateShippingOptions();
    }
  }, [debouncedChosenAddress, debouncedQuantities, clientToken]);

  const checkOut = async () => {
    // if (!selectedShipping) {
    //   toastError("Please select a shipping option and payment method.");
    //   return;
    // }

    try {
      const vouchers = [];
      appliedVouchers.forEach((voucher: Voucher) => {
        vouchers.push(voucher.voucherId);
      });
      vouchers.push(voucherCode === "" ? "0" : voucherCode);
      const response = await fetch(`${process.env.TRANSACTIONS}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${clientToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: chosenAddress?.addressId,
          paymentMethod: isCOD ? "COD" : "Non COD",

          expedition: selectedShipping?.shipping_name,
          shippingType: selectedShipping?.service_name,

          deliveryFee: price?.shippingFee || 0,
          // ongkir?.status === "Active"
          //   ? ongkir?.minimumPaymentAmount < price.totalPrice - price.voucher
          //     ? price.shippingFee > ongkir?.maximumFreeOngkir
          //       ? price.shippingFee - ongkir?.maximumFreeOngkir
          //       : 0
          //     : price.shippingFee
          //   : price.shippingFee,
          deliveryCashback: selectedShipping?.shipping_cashback || 0,
          notes: "",
          weight: totalWeight,
          voucherCode: vouchers,
          customerNotes: customerNotes,
          productNotes: productNotes,
        }),
      });

      const resp = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login");
        }
        throw new Error(resp.message);
      }

      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Purchase Successful", {
          content_type: "Purchase",
          currency: "IDR",
          grand_total:
            price.totalPrice +
            (ongkir?.status === "Active"
              ? ongkir?.minimumPaymentAmount < price.totalPrice - price.voucher
                ? price.shippingFee > ongkir?.maximumFreeOngkir
                  ? price.shippingFee - ongkir?.maximumFreeOngkir
                  : 0
                : price.shippingFee
              : price.shippingFee) -
            (price.voucher > price.totalPrice
              ? price.totalPrice
              : price.voucher),
          user_id: getUserId(),
        });
      }

      if (
        !isCOD &&
        price.totalPrice +
          (ongkir?.status === "Active"
            ? ongkir?.minimumPaymentAmount < price.totalPrice - price.voucher
              ? price.shippingFee > ongkir?.maximumFreeOngkir
                ? price.shippingFee - ongkir?.maximumFreeOngkir
                : 0
              : price.shippingFee
            : price.shippingFee) -
          (price.voucher || 0) >=
          1000 &&
        price.totalPrice +
          (ongkir?.status === "Active"
            ? ongkir?.minimumPaymentAmount < price.totalPrice - price.voucher
              ? price.shippingFee > ongkir?.maximumFreeOngkir
                ? price.shippingFee - ongkir?.maximumFreeOngkir
                : 0
              : price.shippingFee
            : price.shippingFee) -
          (price.voucher > price.totalPrice
            ? price.totalPrice
            : price.voucher) -
          Math.min(
            price.totalPrice +
              (ongkir?.status === "Active"
                ? ongkir?.minimumPaymentAmount <
                  price.totalPrice - price.voucher
                  ? price.shippingFee > ongkir?.maximumFreeOngkir
                    ? price.shippingFee - ongkir?.maximumFreeOngkir
                    : 0
                  : price.shippingFee
                : price.shippingFee) -
              (price.voucher > price.totalPrice
                ? price.totalPrice
                : price.voucher),

            price.visibleVoucher
          ) !=
          0
      ) {
        router.push(resp.payTransactionResponse.invoice_url);
      } else {
        router.push(`/transactions/${resp.transaction.transactionId}`);
      }
    } catch (error: any) {
      toastError(error.message || "Failed to complete the checkout process");
    }
  };

  const checkVoucher = async () => {
    const url = new URL(`${process.env.VOUCHER}/getByCode`);

    url.searchParams.append("code", String(voucherCode));
    url.searchParams.append("totalPrice", String(price.totalPrice));

    const fetchData = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clientToken}`,
      },
    });

    const result = await fetchData.json();

    let discount = 0;

    if (result.voucherType == "percentage") {
      discount = (price.totalPrice * result.discount) / 100;

      if (discount > result.maxDiscount) {
        discount = result.maxDiscount;
      }
    } else if (result.voucherType == "fixed") {
      discount = result.maxDiscount ? result.maxDiscount : 0;
    } else if (result.voucherType == "ongkir") {
      discount = Math.min(
        price.shippingFee,
        Math.min(price.totalPrice, result.discount)
      );
    }
    // else if (result.voucherType == "product") {
    //   discount = result.maxDiscount ? result.maxDiscount : 0;
    // }

    setPrice((prev) => ({ ...prev, voucher: discount }));
    setLoading(false);
    if (result.errors || result.message) {
      toastError(result.message || "Voucher not found");
    } else {
      toastSuccess("Voucher found");
    }
  };

  const handleRemoveCart = async (cartItemId: string) => {
    if (!clientToken) {
      const cartData = JSON.parse(localStorage.getItem("cartItem") || "[]");

      // Filter out the item with the given `cartItemId`
      const updatedCartData = cartData.filter(
        (item: any) => item.cartItemId !== cartItemId
      );

      // Save the updated cart back to local storage
      localStorage.setItem("cartItem", JSON.stringify(updatedCartData));

      toastSuccess("Item removed");
      setUpdate(!update);
      setIsModalOpen(false);
      window.location.reload();
      return;
    }

    const url = new URL(`${process.env.CART}/${cartItemId}`);
    const fetchData = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clientToken}`,
      },
    });
    const result = await fetchData.json();

    if (fetchData.ok) {
      setUpdate(!update);
      toastSuccess("Item removed");
      setIsModalOpen(false);
      // window.location.reload();
    } else {
      if (fetchData.status === 401) {
        router.push("/auth/login");
      }
      toastError(result.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const updateCartQuantity = async () => {
      if (!clientToken || !debouncedQuantities) return;

      setLoading(true);
      try {
        const updates = data.map(async (item) => {
          const quantity = debouncedQuantities[item.productVariantId];
          if (!quantity) return;

          const url = new URL(`${process.env.CART}/${item.cartItemId}`);
          const result = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${clientToken}`,
            },
            body: JSON.stringify({ quantity }),
          });

          const resp = await result.json();

          if (!result.ok) {
            if (result.status === 401) {
              router.push("/auth/login");
            }
            throw new Error(resp.message || "Something went wrong");
          }
        });

        await Promise.all(updates);
        if (voucherCode) {
          checkVoucher();
        }
        recalculateTotalPrice();
      } catch (error: any) {
        toastError(error.message);
      } finally {
        setLoading(false);
      }
    };

    updateCartQuantity();
  }, [debouncedQuantities, clientToken]);

  const trackCheckOut = () => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Initiate Checkout", {
        content_type: "Cart",
        content_product: [data],
        voucher: [appliedVouchers],
        currency: "IDR",
        grand_total:
          price.totalPrice +
          (ongkir?.status === "Active"
            ? ongkir?.minimumPaymentAmount < price.totalPrice - price.voucher
              ? price.shippingFee > ongkir?.maximumFreeOngkir
                ? price.shippingFee - ongkir?.maximumFreeOngkir
                : 0
              : price.shippingFee
            : price.shippingFee) -
          (price.voucher > price.totalPrice ? price.totalPrice : price.voucher),
        user_id: getUserId(),
      });
    }

    if (
      typeof window !== "undefined" &&
      window.gtag &&
      typeof window.gtag === "function"
    ) {
      window.gtag("event", "checkout", {
        product: [data],
        page_location: window.location.href,
        // page_path: `/cart`,
        user_id: getUserId(),
        voucherCode: [appliedVouchers],
        currency: "IDR",
        grand_total:
          price.totalPrice +
          (ongkir?.status === "Active"
            ? ongkir?.minimumPaymentAmount < price.totalPrice - price.voucher
              ? price.shippingFee > ongkir?.maximumFreeOngkir
                ? price.shippingFee - ongkir?.maximumFreeOngkir
                : 0
              : price.shippingFee
            : price.shippingFee) -
          (price.voucher > price.totalPrice ? price.totalPrice : price.voucher),
      });
    }
  };

  const checkVariantVoucherExist = (voucher: Voucher) => {
    console.log(voucher.voucherType, voucher.voucherName);
    console.log(data);

    if (voucher.voucherType !== "product") {
      console.log("exit not product");
      return false;
    }

    for (const p of data) {
      console.log("comparing: ", p.productVariantId, voucher.variantsId)
      if (p.productVariantId == voucher.variantsId) {
        console.log(voucher, p.product_variant.productPrice);
        voucher.discount = p.product_variant.productPrice;
        return true;
      }
    }

    return false;
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col text-black">
      <NavigationBar />
      <div className="flex flex-col flex-grow lg:flex-row gap-8 px-4 mt-24 sm:px-6 lg:px-8 min-h-[80vh] mb-[50px]">
        {/* Shopping Bag Section */}
        {loading ? <LoadingOverlay /> : null}
        <div className="flex-1 h-full bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            {locale == "contentJSONEng" ? "Shopping Bag" : "Keranjang"}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mb-6">
            {data.length}{" "}
            {locale == "contentJSONEng"
              ? "items in your bag"
              : "jumlah barang di keranjang"}
          </p>
          {data.length > 0 ? (
            <div className="space-y-4">
              {data.map((item, index) => (
                <div
                  key={item.productVariantId}
                  className="flex flex-col sm:flex-row items-center p-4 bg-gray-50 rounded-2xl shadow-sm"
                >
                  <Image
                    src={
                      item.product_variant.productImage
                        ? process.env.BACK_BASE_URL +
                          "/assets/product/" +
                          item.product_variant.product.productName.replace(
                            /\//g,
                            ""
                          ) +
                          (item.product_variant.productImage.startsWith("/")
                            ? item.product_variant.productImage
                            : "/" + item.product_variant.productImage)
                        : "/placeholder.webp"
                    }
                    alt="Product"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover"
                    width={200}
                    height={200}
                    priority
                  />
                  <div className="mt-4 sm:mt-0 sm:ml-4 flex-1 text-center sm:text-left">
                    <h3 className="text-sm sm:text-lg font-semibold">
                      {item.product_variant.product.productName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {locale == "contentJSONEng" ? "Color" : "Warna"}:{" "}
                      {item.product_variant.productColor} |{" "}
                      {locale == "contengJSONEng" ? "Size" : "Ukuran"}:{" "}
                      {item.product_variant.product.productSize}
                    </p>
                    {clientToken && (
                      <input
                        type="text"
                        id="voucher"
                        className="w-1/2 mt-2 p-2 border rounded-md focus:outline-none"
                        value={productNotes[index] || ""}
                        onChange={(e) =>
                          setProductNotes((prevNotes) => {
                            const updatedNotes = [...prevNotes];
                            updatedNotes[index] = e.target.value;
                            return updatedNotes;
                          })
                        }
                        placeholder="Notes"
                      />
                    )}
                  </div>
                  <div className="text-gray-800 font-bold mt-2 sm:mt-0">
                    {item.product_variant.product?.promo_details[0] &&
                    quantities[item.productVariantId] === 1 ? (
                      <div>
                        <span className="line-through mr-2 text-gray-600">
                          {formatCurrency(item.product_variant?.productPrice)}
                        </span>
                        <span className="font-semibold">
                          {item.product_variant?.productPrice -
                            item.product_variant.product?.promo_details[0].promo
                              .promoAmount >
                          0
                            ? formatCurrency(item.product_variant?.productPrice -
                              item.product_variant.product?.promo_details[0]
                                .promo.promoAmount)
                            : formatCurrency(0)}
                        </span>
                      </div>
                    ) : (
                      <div>{formatCurrency(item.product_variant?.productPrice)}</div>
                    )}
                  </div>
                  <div className="flex items-center justify-center mt-2 sm:mt-0 sm:ml-4">
                    <button
                      onClick={async () => {
                        setQuantities((prev) => ({
                          ...prev,
                          [item.productVariantId]: Math.max(
                            (prev[item.productVariantId] || 1) - 1,
                            1
                          ),
                        }));
                        for (const voucher of appliedVouchers) {
                          if (
                            price.totalPrice -
                              item.product_variant.productPrice <
                            voucher.minimumPayment
                          ) {
                            setAppliedVouchers([]);
                            setSelectedVouchers([]);
                            setVoucherCode("");
                            toastError(
                              "There is change in voucher! Please check your voucher"
                            );
                            break;
                          }
                        }
                      }}
                      className="p-2 bg-gray-300 rounded"
                    >
                      -
                    </button>
                    <span className="px-4">
                      {quantities[item.productVariantId]}
                    </span>
                    <button
                      onClick={async (e) => {
                        if (
                          quantities[item.productVariantId] <
                          item.product_variant.productStock
                        ) {
                          setQuantities((prevQuantities) => ({
                            ...prevQuantities,
                            [item.productVariantId]:
                              (prevQuantities[item.productVariantId] || 0) + 1,
                          }));
                        }
                      }}
                      className="p-2 bg-gray-300 rounded"
                    >
                      +
                    </button>

                    <div className="ml-4">
                      <FontAwesomeIcon
                        color="red"
                        className="hover:cursor-pointer"
                        onClick={() => {
                          setRemoveProduct({
                            name: item.product_variant.product.productName,
                            id: item.cartItemId,
                            price: item.product_variant.productPrice,
                            quantity: item.quantity,
                          });
                          setIsModalOpen(true);
                        }}
                        icon={faTrashCan}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-64 flex justify-center items-center">
              <button
                onClick={() => router.push("/product")}
                className="bg-secondary py-2 px-4 rounded-xl text-white text-sm sm:text-base"
              >
                {locale == "contentJSONEng"
                  ? "Explore Our Products"
                  : "Jelajahi Produk Kami"}
              </button>
            </div>
          )}
        </div>

        {/* Shipping and Payment Section */}
        <div className="w-full lg:w-1/3 space-y-6">
          {clientToken ? (
            <div className="bg-white p-6 rounded-md shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Shipping and Payment
              </h3>
              {address.length === 0 ? (
                <button
                  onClick={() => router.push("/address/create")}
                  className="w-full bg-secondary text-white py-2 rounded-md mb-2 text-sm sm:text-base"
                >
                  {locale == "contentJSONEng"
                    ? "Create Address"
                    : "Daftarkan Alamat"}
                </button>
              ) : (
                <div>
                  <label
                    htmlFor="shippingAddress"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {locale == "contentJSONEng"
                      ? "Shipping Address"
                      : "Alamat Pengiriman"}
                  </label>
                  <select
                    id="shippingAddress"
                    className="w-full p-2 mb-4 border rounded-md focus:outline-none"
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedAddress = address.find(
                        (addr) => addr.addressDetail === selectedId
                      );

                      setChosenAddress(selectedAddress);
                    }}
                    disabled={data.length === 0}
                    value={chosenAddress?.addressDetail || ""}
                  >
                    <option value="">
                      {locale == "contentJSONEng"
                        ? "Select an Address"
                        : "Pilih alamat"}
                    </option>
                    {address.map((addr) => (
                      <option key={addr.addressId} value={addr.addressDetail}>
                        {addr.addressDetail}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <label
                htmlFor="shippingOption"
                className="block text-sm font-medium text-gray-700"
              >
                {locale == "contentJSONEng"
                  ? "Shipping Option"
                  : "Opsi Pengiriman"}
              </label>
              <select
                id="shippingOption"
                className="w-full p-2 mb-4 border rounded-md focus:outline-none"
                value={selectedShipping ? selectedShipping.shipping_name : ""}
                onChange={(e) => {
                  const selectedOption = shippingOptions.find(
                    (option) => option.shipping_name === e.target.value
                  );
                  if (selectedOption) {
                    setSelectedShipping(selectedOption);
                    setPrice((prev) => ({
                      ...prev,
                      shippingFee: selectedOption.shipping_cost,
                    }));
                  } else {
                    setSelectedShipping(null);
                  }
                }}
              >
                <option value="">
                  {locale == "contentJSONEng"
                    ? "Select a Shipping Option"
                    : "Pilih Opsi Pengiriman"}
                </option>
                {shippingOptions
                  .filter((option) => option.shipping_name == "JNT" || option.shipping_name == "JNE")
                  .map((option, index) => (
                    <option key={index} value={option.shipping_name}>
                      <div className="flex justify-between w-full">
                        <div>
                          {option.shipping_name} - {formatCurrency(option.shipping_cost)}
                        </div>
                        {/* <div className="text-red-500">{option?.is_cod ? "" : "X COD"}</div> */}
                      </div>
                    </option>
                  ))}
              </select>

              <button
                className="w-full bg-secondary text-white py-2 rounded-md mb-4 text-sm sm:text-base"
                onClick={() => {
                  setIsVoucherOpen(true);
                }}
              >
                {/* {locale == "contentJSONEng" ? "Available vouchers" : "Voucher tersedia"} */}
                {/* </button>
                > */}
                {appliedVouchers.length === 0 ? (
                  locale == "contentJSONEng" ? (
                    "Available vouchers"
                  ) : (
                    "Voucher tersedia"
                  )
                ) : appliedVouchers.some(
                    (v) => v.minimumPayment > price.totalPrice
                  ) ? (
                  <div>
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      className="text-red-500"
                    />
                  </div>
                ) : locale == "contentJSONEng" ? (
                  `${appliedVouchers.length} voucher applied`
                ) : (
                  `${appliedVouchers.length} voucher digunakan`
                )}
              </button>

              {/* Voucher Section */}
              <label
                htmlFor="voucher"
                className="block text-sm font-medium text-gray-700"
              >
                {locale == "contentJSONEng" ? "Voucher Code" : "Kode Voucher"}
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  id="voucher"
                  className="w-full p-2 border rounded-md focus:outline-none"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Enter Voucher Code"
                />
                <button
                  className="p-2 bg-secondary rounded-md text-white h-full text-sm sm:text-base"
                  onClick={() => {
                    setLoading(true);
                    checkVoucher();
                  }}
                >
                  {locale == "contentJSONEng" ? "Check" : "Cek"}
                </button>
                <button
                  className="p-2 bg-red-500 rounded-md text-white h-full text-sm sm:text-base"
                  onClick={() => {
                    setPrice((prev) => ({ ...prev, voucher: 0 }));
                    setVoucherCode("");
                  }}
                >
                  {locale == "contentJSONEng" ? "Remove" : "Hapus"}
                </button>
              </div>

              <label
                htmlFor="voucher"
                className="block text-sm font-medium text-gray-700"
              >
                {locale == "contentJSONEng" ? "Notes" : "Catatan"}
              </label>

              <div>
                <textarea
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none"
                  placeholder="Notes"
                ></textarea>
              </div>

              {price.totalPrice <= maxCOD && (
                <div>
                  <label
                    htmlFor="voucher"
                    className="block text-sm font-medium text-gray-700 mb-2 mt-2"
                  >
                    {locale == "contentJSONEng"
                      ? "Cash On Delivery"
                      : "Bayar di tempat"}
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isCOD}
                      disabled={!selectedShipping?.is_cod}
                      onChange={() => {
                        setIsCOD(!isCOD);
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                  {selectedShipping ? (
                    !selectedShipping?.is_cod ? (
                      <div className="text-sm text-red-400">
                        COD is not available for this shipping option
                      </div>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                </div>
              )}

              {/* Price Summary */}
              <div className="flex flex-col space-y-2 mt-6">
                <div className="flex justify-between">
                  <span className="text-sm sm:text-lg font-semibold">
                    {locale == "contentJSONEng" ? "Total Price" : "Total Harga"}
                    :
                  </span>
                  <span className="font-light text-black">
                    {formatCurrency(price.totalPrice)}
                  </span>
                </div>
                {selectedShipping && (
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm sm:text-lg font-semibold">
                        {locale == "contentJSONEng"
                          ? "Shipping Fee"
                          : "Biaya Pengiriman"}
                        :
                      </span>
                      <span className="font-light text-black">
                        {ongkir?.status === "Active" ? (
                          ongkir?.minimumPaymentAmount <
                          price.totalPrice - price.voucher ? (
                            price.shippingFee > ongkir?.maximumFreeOngkir ? (
                              <span>
                                <span className="line-through text-gray-300 mx-2">
                                  {formatCurrency(price.shippingFee)}
                                </span>
                                {formatCurrency(price.shippingFee - ongkir?.maximumFreeOngkir)}
                              </span>
                            ) : locale == "contentJSONEng" ? (
                              <span>
                                <span className="line-through text-gray-300 mx-2">
                                  {formatCurrency(price.shippingFee)}
                                </span>{" "}
                                {formatCurrency(0)} (Free Delivery)
                              </span>
                            ) : (
                              <span>
                                <span className="line-through text-gray-300 mx-2">
                                  {price.shippingFee}
                                </span>{" "}
                                {formatCurrency(0)} (Gratis)
                              </span>
                            )
                          ) : (
                            formatCurrency(price.shippingFee)
                          )
                        ) : (
                          formatCurrency(price.shippingFee)
                        )}
                      </span>
                    </div>
                    {ongkir?.status === "Active" ? (
                      ongkir?.minimumPaymentAmount >
                      price.totalPrice - price.voucher ? (
                        locale === "contentJSONEng" ? (
                          <span>
                            Add 
                            {formatCurrency(ongkir?.minimumPaymentAmount -
                              price.totalPrice -
                              price.voucher)}{" "}
                            more to get free delivery
                          </span>
                        ) : (
                          <span>
                            Tambah 
                            {formatCurrency(ongkir?.minimumPaymentAmount -
                              price.totalPrice -
                              price.voucher)}{" "}
                            untuk mendapatkan gratis biaya pengiriman
                          </span>
                        )
                      ) : null
                    ) : null}
                  </div>
                )}
                {price.voucher != 0 ? (
                  <div className="flex justify-between">
                    <span className="text-sm gap-2 flex">
                      <div>Voucher - {voucherCode}</div>
                    </span>
                    <span className="font-light text-sm text-green-500">
                      - 
                      {price.voucher > price.totalPrice
                        ? formatCurrency(price.totalPrice)
                        : formatCurrency(price.voucher)}
                    </span>
                  </div>
                ) : null}

                {appliedVouchers.map((voucher: Voucher) => {
                  return (
                    <div
                      className="flex justify-between"
                      key={voucher.voucherId}
                    >
                      {/* <span className="text-sm sm:text-lg font-semibold gap-2 flex"> */}

                      <span className="text-sm gap-2 flex">
                        <div>{voucher.voucherName}</div>
                      </span>
                      <span className="font-light text-sm text-green-500">
                        - 
                        {(() => {
                          if (voucher.voucherType === "fixed") {
                            return formatCurrency(Math.min(
                              price.totalPrice,
                              voucher.maxDiscount
                            ));
                          }
                          if (voucher.voucherType === "percentage") {
                            return formatCurrency(Math.min(
                              price.totalPrice * (voucher.discount / 100),
                              voucher.maxDiscount
                            ));
                          }
                          if (voucher.voucherType === "ongkir") {
                            return formatCurrency(Math.min(
                              price.shippingFee,
                              Math.min(price.totalPrice, voucher.discount)
                            ));
                          }
                          if (voucher.voucherType === "product") {
                            return formatCurrency(voucher.discount);
                          }
                          return formatCurrency(0);
                        })()}
                      </span>
                    </div>
                  );
                })}

                <div className="flex justify-between">
                  <span className="text-lg sm:text-xl font-semibold">
                    Grand Total:
                  </span>
                  <span className="font-light text-black">
                    {formatCurrency(price.totalPrice +
                      (ongkir?.status === "Active"
                        ? ongkir?.minimumPaymentAmount <
                          price.totalPrice - price.voucher
                          ? price.shippingFee > ongkir?.maximumFreeOngkir
                            ? price.shippingFee - ongkir?.maximumFreeOngkir
                            : 0
                          : price.shippingFee
                        : price.shippingFee) -
                      (price.voucher > price.totalPrice
                        ? price.totalPrice
                        : price.voucher) -
                      Math.min(
                        price.totalPrice +
                          (ongkir?.status === "Active"
                            ? ongkir?.minimumPaymentAmount <
                              price.totalPrice - price.voucher
                              ? price.shippingFee > ongkir?.maximumFreeOngkir
                                ? price.shippingFee - ongkir?.maximumFreeOngkir
                                : 0
                              : price.shippingFee
                            : price.shippingFee) -
                          (price.voucher > price.totalPrice
                            ? price.totalPrice
                            : price.voucher),
                        price.visibleVoucher
                      ))}
                  </span>
                </div>
              </div>

              <button
                id="checkout_event"
                className="w-full bg-secondary text-white py-2 sm:py-3 mt-4 rounded-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all"
                onClick={() => {
                  trackCheckOut();
                  checkOut();
                }}
              >
                Checkout
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-md shadow-md h-full flex flex-col items-center justify-center">
              <p className="text-gray-600 mb-6">
                {locale == "contentJSONEng"
                  ? "You need to login first to access this feature."
                  : "Kamu butuh login terlebih dahulu untuk menggunakan fitur ini"}
              </p>
              <button
                onClick={() => (window.location.href = "/auth/login")}
                className="bg-secondary text-white py-2 px-4 rounded-md"
              >
                {locale == "contentJSONEng" ? "Login Now" : "Login Sekarang"}
              </button>
            </div>
          )}
        </div>
        <div className="fixed">
          <DeleteConfirmationModal
            header={"Remove product from cart"}
            description={`Are you sure you want to remove ${removedProduct?.name}?`}
            onDelete={() => {
              for (const voucher of appliedVouchers) {
                if (
                  price.totalPrice -
                    (removedProduct?.price ?? 0) *
                      (removedProduct?.quantity ?? 0) <
                  voucher.minimumPayment
                ) {
                  setAppliedVouchers([]);
                  setSelectedVouchers([]);
                  setVoucherCode("");
                  toastError(
                    "There is change in voucher! Please check your voucher"
                  );
                  break;
                }
              }
              handleRemoveCart(removedProduct?.id || "");
            }}
            isVisible={isModalOpen}
            onCancel={() => {
              setIsModalOpen(false);
            }}
          />
        </div>

        <div className="fixed items-center z-50">
  <Modal
    size={modalSize}
    backdrop="opaque"
    isOpen={isVoucherOpen}
    onClose={() => setIsVoucherOpen(false)}
    closeButton={false}
    className="text-black h-[600px] fixed"
  >
    <ModalContent>
      {/* Modal Header */}
      <ModalHeader>
        <h4 className="font-bold text-lg">Vouchers</h4>
      </ModalHeader>

      {/* Modal Body */}
      <ModalBody>
        {visibleVoucher.length === 0 ? (
          <p className="text-center text-gray-600">
            <FontAwesomeIcon icon={faSearch} size="sm" className="mr-2" />
            {locale === "contentJSONEng" ? "There is no voucher" : "Tidak ada voucher"}
          </p>
        ) : (
          <div className="overflow-y-scroll h-[420px]">
            {Object.entries(
              visibleVoucher.reduce((acc: any, voucher: any) => {
                if (voucher.voucherType === "fixed" || voucher.voucherType === "percentage") {
                  if (!acc["discount"]) acc["discount"] = [];
                  acc["discount"].push(voucher);
                } else {
                  if (!acc[voucher.voucherType]) acc[voucher.voucherType] = [];
                  acc[voucher.voucherType].push(voucher);
                }
                return acc;
              }, { "ongkir": [], "discount": [], "product": [] })
            ).map(([voucherType, vouchers]) => (
              <div key={voucherType}>
                <div className="text-xl font-semibold mt-4">
                  {voucherType === "ongkir" && "Free Shipping"}
                  {voucherType === "discount" && "Discount"}
                  {voucherType === "product" && "Product Vouchers"}
                </div>

                {vouchers.map((voucher: Voucher) => (
                  <div
                    key={voucher.voucherId}
                    className={`p-4 h-[120px] flex items-center cursor-pointer justify-between border-b-1 "border-gray-300"
                      ${voucher.voucherSpecialEvent === true ? "" : price.totalPrice < voucher.minimumPayment ||
                        selectedVouchers.some(
                          (v) => v.voucherType === voucher.voucherType && v.voucherId !== voucher.voucherId && !v.voucherSpecialEvent
                        ) ? "opacity-50 cursor-auto" : !checkVariantVoucherExist(voucher) && voucher.voucherType === "product"
                        ? "opacity-50 cursor-auto" : voucher.voucherType === "ongkir" && selectedShipping === null ? "opacity-50 cursor-auto" : ""
                    }`}
                    onClick={() => handleSelect(voucher)}
                  >
                    <div className="flex items-center w-4/5 gap-4">
                      {/* Voucher Icons */}
                      {voucher.voucherType === "percentage" && (
                        <FontAwesomeIcon
                          icon={faPercentage}
                          width={80}
                          height={80}
                          className="rounded-md text-3xl"
                        />
                      )}
                      {voucher.voucherType === "fixed" && (
                        <FontAwesomeIcon
                          icon={faMoneyBill}
                          width={80}
                          height={80}
                          className="rounded-md text-3xl"
                        />
                      )}
                      {voucher.voucherType === "ongkir" && (
                        <FontAwesomeIcon
                          icon={faShippingFast}
                          width={80}
                          height={80}
                          className="rounded-md text-3xl"
                        />
                      )}
                      {voucher.voucherType === "product" && (
                        <FontAwesomeIcon
                          icon={faBottleWater}
                          width={80}
                          height={80}
                          className="rounded-md text-3xl"
                        />
                      )}

                      <div className="truncate w-full">
                        <div className="text-lg font-medium truncate">{voucher.voucherName}</div>
                        <div className="text-sm text-gray-600 truncate">
                          {voucher.voucherType === "percentage" && `Discount ${voucher.discount}%`}
                          {voucher.voucherType === "fixed" && `Discount ${formatCurrency(voucher.maxDiscount)}`}
                          {voucher.voucherType === "ongkir" && `Free shipping ${formatCurrency(voucher.discount)}`}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          Min. payment {formatCurrency(voucher.minimumPayment)}
                        </div>
                        {voucher.voucherType === "percentage" && (
                          <div className="text-sm text-gray-500 truncate">
                            Max. discount {formatCurrency(voucher.maxDiscount)}
                          </div>
                        )}
                        {voucher.voucherType === "product" && (
                          <div className="text-sm text-gray-500 truncate">
                            Free {voucher.productVariant?.product.productName || "product"} - {voucher.productVariant?.productColor || "color"}
                          </div>
                        )}

                        {price.totalPrice < voucher.minimumPayment && (
                          <div className="text-xs mt-2 text-red-500">
                            Add {formatCurrency(voucher.minimumPayment - price.totalPrice)} more to use this voucher
                          </div>
                        )}
                        {voucher.voucherType === "ongkir" && selectedShipping === null && (
                          <div className="text-xs mt-2 text-red-500">
                            Please select the shipping expedition first
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedVouchers.some(
                        (v) => v.voucherId === voucher.voucherId
                      )}
                      readOnly
                      className="h-5 w-5 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </ModalBody>

      {/* Modal Footer */}
      <ModalFooter>
        <Button color="secondary" onClick={handleApplyVoucher}>
          Apply Voucher
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
</div>

      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
