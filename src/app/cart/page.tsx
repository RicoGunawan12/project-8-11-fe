"use client";
import React, { useCallback, useEffect, useState } from "react";
import NavigationBar from "../component/navbar";
import Image from "next/image";
import { getTokenCookie } from "../utilities/token";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "../utilities/toast";
import { Cart } from "../model/cart";
import { Loading, LoadingOverlay } from "../utilities/loading";
import { UserAddress } from "../model/address";
import { Shipping } from "../model/shipping";
import { useDebounce } from "use-debounce";
import { Payment } from "../model/transactions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Footer from "../component/footer";
import { useLocaleStore } from "../component/locale";
import DeleteConfirmationModal from "../component/modal/deleteConfirmation";
import { pre } from "framer-motion/client";
import { Ongkir } from "../model/ongkir";

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
  });
  const [update, setUpdate] = useState(false);
  const { locale } = useLocaleStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removedProduct, setRemoveProduct] = useState<{
    name: string;
    id: string;
  }>();
  const [maxCOD, setMaxCOD] = useState<number>(0);
  const [isCOD, setIsCOD] = useState<boolean>(false);
  const [ongkir, setOngkir] = useState<Ongkir>();
  const [bogoSelections, setBogoSelections] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const token = getTokenCookie();
    setClientToken(token);

    const fetchCartAndAddressData = async () => {
      try {
        const cartResponse = await fetch(`${process.env.CART}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartData = await cartResponse.json();
        if (!cartResponse.ok) {
          throw new Error(cartData.message || "Failed to fetch cart data");
        }

        console.log("Cart: ", cartData)

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

        console.log("addressData: ", addressData)

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
              ? item.product_variant.productPrice -
                item.product_variant.product?.promo_details[0].promo
                  .promoAmount >
                0
                ? item.product_variant.productPrice -
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

        console.log("COD Data: ", codData)

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
        console.log("Ongkir: ", ongkirResponse)
        setOngkir(ongkirData.freeOngkir);

        setLoading(false);
      } catch (error: any) {
        // toastError(error.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

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
          (item.product_variant.productPrice -
            item.product_variant.product?.promo_details[0].promo.promoAmount >
            0
            ? item.product_variant.productPrice -
            item.product_variant.product?.promo_details[0].promo.promoAmount
            : 0) *
          quantity
        );
      } else {
        return total + item.product_variant.productPrice * quantity;
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
          (item.product_variant.productPrice -
            item.product_variant.product?.promo_details[0].promo.promoAmount >
            0
            ? item.product_variant.productPrice -
            item.product_variant.product?.promo_details[0].promo.promoAmount
            : 0) *
          quantity
        );
      } else {
        return total + item.product_variant.productPrice * quantity;
      }
    }, 0);

    var literalTotal = 0;
    data.forEach((item) => {
      literalTotal += item.product_variant.productPrice;
    });

    const response = await fetch(`${process.env.ADDRESS}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${clientToken}` },
    });

    const resp = await response.json();
    if (!response.ok) throw new Error(resp.message);

    setPrice((prev) => ({ ...prev, totalPrice: cartTotal }));

    const url = `${process.env.ADDRESS
      }/calculate?shipperDestinationId=1&receiverDestinationId=${chosenAddress.komshipAddressId
      }&weight=${totalWeight}&itemValue=${literalTotal}&cod=${isCOD ? "yes" : "no"
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
    if (!selectedShipping) {
      toastError("Please select a shipping option and payment method.");
      return;
    }

    console.log(bogoSelections)

    try {
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
          deliveryFee:
            ongkir?.status === "Active"
              ? ongkir?.minimumPaymentAmount < price.shippingFee &&
                ongkir?.maximumFreeOngkir >= price.shippingFee
                ? price.shippingFee
                : 0
              : price.shippingFee,
          deliveryCashback: selectedShipping?.shipping_cashback,
          notes: "",
          voucherCode: voucherCode,
          customerNotes: customerNotes,
          productNotes: productNotes,
          bogo : bogoSelections
        }),
      });

      const resp = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login");
        }
        throw new Error(resp.message);
      }

      if (!isCOD) {
        router.push(resp.payTransactionResponse.actions[0].url);
      }
      else {
        router.push(`/transactions/${resp.transaction.transactionId}`);
      }
    } catch (error: any) {
      toastError(error.message || "Failed to complete the checkout process");
    }
  };

  const checkVoucher = async () => {
    const url = new URL(`${process.env.VOUCHER}/getByCode`);

    url.searchParams.append("code", String(voucherCode));

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
    } else {
      discount = result.discount ? result.discount : 0;
    }

    setPrice((prev) => ({ ...prev, voucher: discount }));
    setLoading(false);
    if (result.errors || result.message) {
      toastError(result.message || "Voucher not found");
    } else {
      toastSuccess("Voucher found");
    }
  };

  const handleRemoveCart = async (cartItemId: string) => {
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
      window.location.reload();
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
                  className="flex flex-col w-full p-4 bg-gray-50 rounded-2xl shadow-sm"
                >
                  <div className="flex w-full">
                    <Image
                      src={
                        item.product_variant.productImage
                          ? process.env.BACK_BASE_URL + item.product_variant.productImage
                          : "/placeholder.webp"
                      }
                      alt="Product"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover"
                      width={200}
                      height={200}
                    />
                    <div className="mt-4 sm:mt-0 sm:ml-4 flex-1 text-center sm:text-left">
                      <h3 className="text-sm sm:text-lg font-semibold">
                        {item.product_variant.product.productName}
                        {item.product_variant.productImage}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {locale === "contentJSONEng" ? "Color" : "Warna"}:{" "}
                        {item.product_variant.productColor} |{" "}
                        {locale === "contentJSONEng" ? "Size" : "Ukuran"}:{" "}
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
                  </div>
                  <div className="text-gray-800 font-bold mt-2 sm:mt-0">
                    {item.product_variant.product?.promo_details[0] &&
                      quantities[item.productVariantId] === 1 ? (
                      <div>
                        <span className="line-through mr-2 text-gray-600">
                          Rp. {item.product_variant.productPrice}
                        </span>
                        <span className="font-semibold">
                          Rp.{" "}
                          {item.product_variant.productPrice -
                            item.product_variant.product?.promo_details[0].promo
                              .promoAmount >
                            0
                            ? item.product_variant.productPrice -
                            item.product_variant.product?.promo_details[0].promo
                              .promoAmount
                            : 0}
                        </span>
                      </div>
                    ) : (
                      <div>Rp. {item.product_variant.productPrice}</div>
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
                      }}
                      className="p-2 bg-gray-300 rounded"
                    >
                      -
                    </button>
                    <span className="px-4">
                      {quantities[item.productVariantId]}
                    </span>
                    <button
                      onClick={async () => {
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
                          });
                          setIsModalOpen(true);
                        }}
                        icon={faTrashCan}
                      />
                    </div>
                  </div>

                  {/* BOGO selection */}
                  {item.product_variant.product.bogo &&
                    item.product_variant.product.bogo.length > 0 && (
                      <div className="mt-6 border-t pt-4">
                        <h4 className="text-sm sm:text-base font-semibold mb-3">
                          {locale === "contentJSONEng"
                            ? "Select Your Free Items"
                            : "Pilih Item Gratis Anda"}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {Array.from(
                            { length: quantities[item.productVariantId] || 0 },
                            (_, i) => (
                              <div key={i} className="flex flex-col space-y-2">
                                <label className="text-sm text-gray-600">
                                  {locale === "contentJSONEng"
                                    ? `Free Item ${i + 1}`
                                    : `Item Gratis ${i + 1}`}
                                </label>
                                <select
                                  className="p-2 border rounded-md bg-white focus:ring-2 focus:ring-secondary focus:border-transparent"
                                  value={bogoSelections[item.productVariantId]?.[i] || ""}
                                  onChange={(e) => {
                                    setBogoSelections((prev) => {
                                      const currentSelections = prev[item.productVariantId] || [];
                                      const newSelections = [...currentSelections];
                                      newSelections[i] = e.target.value;
                                      return {
                                        ...prev,
                                        [item.productVariantId]: newSelections
                                      };
                                    });
                                  }}
                                >
                                  <option value="">
                                    {locale === "contentJSONEng"
                                      ? "Select variant"
                                      : "Pilih varian"}
                                  </option>
                                  {item.product_variant.product.bogo.map((bogoItem) => (
                                    <option
                                      key={bogoItem.productVariantId}
                                      value={bogoItem.productVariantId}
                                    >
                                      {bogoItem.productColor}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
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
                {shippingOptions.map((option, index) => (
                  <option key={index} value={option.shipping_name}>
                    {option.shipping_name} - Rp. {option.shipping_cost}
                  </option>
                ))}
              </select>

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

              {
                price.totalPrice <= maxCOD &&
                <div>
                  <label
                    htmlFor="voucher"
                    className="block text-sm font-medium text-gray-700 mb-2 mt-2"
                  >
                    {locale == "contentJSONEng" ? "Cash On Delivery" : "Bayar di tempat"}
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isCOD}
                      onChange={() => {
                        setIsCOD(!isCOD);
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              }

              {/* Price Summary */}
              <div className="flex flex-col space-y-2 mt-6">
                <div className="flex justify-between">
                  <span className="text-sm sm:text-lg font-semibold">
                    {locale == "contentJSONEng" ? "Total Price" : "Total Harga"}
                    :
                  </span>
                  <span className="font-light text-black">
                    Rp. {price.totalPrice}
                  </span>
                </div>
                {selectedShipping && (
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-lg font-semibold">
                      {locale == "contentJSONEng"
                        ? "Shipping Fee"
                        : "Biaya Pengiriman"}
                      :
                    </span>
                    <span className="font-light text-black">
                      {ongkir?.status == "Active" ? (
                        ongkir?.minimumPaymentAmount < price.shippingFee &&
                          ongkir?.maximumFreeOngkir >= price.shippingFee ? (
                          <div>
                            Rp.{" "}
                            <span className="line-through text-gray-400">
                              {price.shippingFee}
                            </span>{" "}
                            0
                          </div>
                        ) : (
                          "Rp. " + price.shippingFee
                        )
                      ) : (
                        "Rp. " + price.shippingFee
                      )}
                      {/* Rp. {price.shippingFee} */}
                    </span>
                  </div>
                )}
                {price.voucher != 0 ? (
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-lg font-semibold gap-2 flex">
                      <div>Voucher:</div>
                    </span>
                    <span className="font-light text-black">
                      - Rp. {price.voucher}
                    </span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span className="text-lg sm:text-xl font-semibold">
                    Grand Total:
                  </span>
                  <span className="font-light text-black">
                    Rp.{" "}
                    {price.totalPrice +
                      (ongkir?.status === "Active"
                        ? ongkir?.minimumPaymentAmount < price.shippingFee &&
                          ongkir?.maximumFreeOngkir >= price.shippingFee
                          ? 0
                          : price.shippingFee
                        : price.shippingFee) -
                      (price.voucher || 0)}
                  </span>
                </div>
              </div>

              <button
                id="checkout_event"
                className="w-full bg-secondary text-white py-2 sm:py-3 mt-4 rounded-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all"
                onClick={checkOut}
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
              handleRemoveCart(removedProduct?.id || "");
            }}
            isVisible={isModalOpen}
            onCancel={() => {
              setIsModalOpen(false);
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
