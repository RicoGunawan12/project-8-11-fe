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
  const [paymentMethod, setPaymentMethod] = useState<string>("checkout-va");
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [isShippingEnabled, setIsShippingEnabled] = useState(false);
  const [clientToken, setClientToken] = useState<string | null>();
  const [loading, setLoading] = useState(false)
  const [debouncedChosenAddress] = useDebounce(chosenAddress, 3000);
  const [debouncedQuantities] = useDebounce(quantities, 3000);
  const [price, setPrice] = useState<Payment>({
    totalPrice: 0,
    shippingFee: 0,
    voucher: 0,
    grandTotal: 0
  })
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const token = getTokenCookie();

    setClientToken(token);

    const fetchCartAndAddressData = async () => {
      setLoading(true)
      try {
        const cartResponse = await fetch(`${process.env.CART}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartData = await cartResponse.json();
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
        console.log(cartData)
        setData(cartData);
        setQuantities(
          cartData.reduce((acc: { [key: string]: number }, item: Cart) => {
            acc[item.productVariantId] = item.quantity || 1;
            return acc;
          }, {})
        );
        setAddress(addressData);
        
        const cartTotal = data.reduce((total, item) => total + (item.product_variant.productPrice - item.product_variant.product.promo_details[0].promo.promoAmount > 0 ? - item.product_variant.product.promo_details[0].promo.promoAmount : 0) * item.quantity, 0);
        setPrice((prev) => ({ ...prev, totalPrice: cartTotal }))
      } catch (error: any) {
        // toastError(error.message || "An unexpected error occurred");
      } finally {
        setLoading(false)
      }
    };

    if (token) {
      fetchCartAndAddressData();
    } else {
      const cartData = JSON.parse(localStorage.getItem("cartItem") || "{}");

      if (!Array.isArray(cartData) || cartData.length === 0) {
        return;
      }
      console.log(cartData)
      setData(cartData);
      setQuantities(
        cartData?.reduce((acc: { [key: string]: number }, item: Cart) => {
          acc[item.productVariantId] = item.quantity || 1;
          return acc;
        }, {})
      );
      setLoading(false)
    }
  }, [router, clientToken, update]);

  const recalculateTotalPrice = () => {
    const cartTotal = data.reduce((total, item) => {
      const quantity = quantities[item.productVariantId] || 1;
      return total + (item.product_variant.productPrice - item.product_variant.product.promo_details[0].promo.promoAmount > 0 ? - item.product_variant.product.promo_details[0].promo.promoAmount : 0) * quantity;
    }, 0);
    setPrice((prev) => ({ ...prev, totalPrice: cartTotal }))
  }

  useEffect(() => {
    recalculateTotalPrice();
  }, [quantities,data]);

  const calculateShippingOptions = useCallback(async () => {
    if (!chosenAddress) return;

    setLoading(true);

    let totalWeight = 0;
    const cartTotal = data.reduce((total, item) => {
      console.log(item);
      
      const quantity = quantities[item.productVariantId] || 1;
      totalWeight += item.product_variant.product.productWeight * quantity;
      return total + (item.product_variant.productPrice - item.product_variant.product.promo_details[0].promo.promoAmount > 0 ? - item.product_variant.product.promo_details[0].promo.promoAmount : 0) * quantity;
    }, 0);

    var literalTotal = 0;
    data.forEach((item) => {
      literalTotal += item.product_variant.productPrice
    })

    const response = await fetch(`${process.env.ADDRESS}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${clientToken}` },
    });

    const resp = await response.json();
    if (!response.ok) throw new Error(resp.message);

    setPrice((prev) => ({ ...prev, totalPrice: cartTotal }))
    console.log(chosenAddress)
    console.log(chosenAddress.komshipAddressId)
    console.log(totalWeight)

    const url = `${process.env.ADDRESS}/calculate?shipperDestinationId=1&receiverDestinationId=${chosenAddress.komshipAddressId}&weight=${totalWeight}&itemValue=${literalTotal}`;
    console.log(url)
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
  }, [clientToken, data, quantities, chosenAddress]);

  useEffect(() => {
    if (clientToken && debouncedChosenAddress && debouncedQuantities) {
      console.log("test")
      calculateShippingOptions();
    }
  }, [debouncedChosenAddress, debouncedQuantities, clientToken]);

  const checkOut = async () => {
    if (!selectedShipping || !paymentMethod) {
      toastError("Please select a shipping option and payment method.");
      return;
    }

    try {
      const response = await fetch(`${process.env.TRANSACTIONS}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${clientToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: chosenAddress?.addressId,
          paymentMethod: paymentMethod,
          expedition: selectedShipping?.shipping_name,
          shippingType: selectedShipping?.service_name,
          deliveryFee: selectedShipping?.grandtotal,
          deliveryCashback: selectedShipping?.shipping_cashback,
          notes: "",
          voucherCode: voucherCode
        }),
      });

      const resp = await response.json();
      if (!response.ok) {
        throw new Error(resp.message);
      }

      router.push(
        resp.payTransactionResponse.actions[0].url
      );

    } catch (error: any) {
      toastError(error.message || "Failed to complete the checkout process");
    }
  };

  const checkVoucher = async () => {
    const url = new URL(`${process.env.VOUCHER}/getByCode`);

    url.searchParams.append("code", String(voucherCode));

    console.log(url)
    const fetchData = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clientToken}`
      },
    })

    const result = await fetchData.json()
    console.log(fetchData)
    let discount = 0

    if (result.voucherType == "percentage") {
      discount = (price.totalPrice + price.shippingFee) * result.discount / 100

      if (discount > result.maxDiscount) {
        discount = result.maxDiscount
      }
    }
    else {
      discount = result.discount
    }

    setPrice((prev) => ({ ...prev, voucher: discount }))

    if (result.errors || result.message) {
      toastError(result.message || "Voucher not found")
    } else {
      toastSuccess("Voucher found")
    }
  }

  const handleRemoveCart = async (cartItemId: string) => {
    const url = new URL(`${process.env.CART}/${cartItemId}`);
    const fetchData = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clientToken}`
      },
    })
    const result = await fetchData.json()

    if (fetchData.ok) {
      setUpdate(!update);
      toastSuccess("Item removed")
    } else {
      console.log(result);
      
      if (result.status === 401) {
        router.push("/login");
      }
      toastError(result.message || "Something went wrong")
    }
  }

  if (!data) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col text-black">
      <NavigationBar />
      <div className="flex flex-col flex-grow lg:flex-row gap-8 px-4 mt-24 sm:px-6 lg:px-8 min-h-[80vh] mb-[50px]">
        {/* Shopping Bag Section */}
        {
          loading ? <LoadingOverlay/> : null
        }
        <div className="flex-1 h-full bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Shopping Bag</h2>
          <p className="text-sm sm:text-base text-gray-500 mb-6">{data.length} items in your bag</p>
          {data.length > 0 ? (
            <div className="space-y-4">
              {data.map((item) => (
                <div
                  key={item.productVariantId}
                  className="flex flex-col sm:flex-row items-center p-4 bg-gray-50 rounded-2xl shadow-sm"
                >
                  <Image
                    src={`${process.env.BACK_BASE_URL}${item.product_variant.productImage}`}
                    alt="Product"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover"
                    width={200}
                    height={200}
                  />
                  <div className="mt-4 sm:mt-0 sm:ml-4 flex-1 text-center sm:text-left">
                    <h3 className="text-sm sm:text-lg font-semibold">
                      {item.product_variant.product.productName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Color: {item.product_variant.productColor} | Size:{" "}
                      {item.product_variant.product.productSize}
                    </p>
                  </div>
                  <div className="text-gray-800 font-bold mt-2 sm:mt-0">
                  {
                        item.product_variant.product.promo_details[0]? 
                        <div>
                          <span className="line-through mr-2 text-gray-600">Rp. {item.product_variant.productPrice}</span>
                          <span className="font-semibold">Rp. {item.product_variant.productPrice - item.product_variant.product.promo_details[0].promo.promoAmount  > 0 ? item.product_variant.productPrice - item.product_variant.product.promo_details[0].promo.promoAmount : 0}</span>
                        </div>
                        :
                        <div >
                        Rp. {item.product_variant.productPrice}
                        </div>
                      }
                  </div>
                  <div className="flex items-center justify-center mt-2 sm:mt-0 sm:ml-4">
                    <button
                      onClick={() => {
                        setQuantities((prev) => ({
                          ...prev,
                          [item.productVariantId]: Math.max(
                            (prev[item.productVariantId] || 1) - 1,
                            1
                          ),
                        }))

                        recalculateTotalPrice()
                      }
                      }
                      className="p-2 bg-gray-300 rounded"
                    >
                      -
                    </button>
                    <span className="px-4">{quantities[item.productVariantId]}</span>
                    <button
                      onClick={() => {
                        setQuantities(prevQuantities => ({
                          ...prevQuantities,
                          [item.productVariantId]: (prevQuantities[item.productVariantId] || 0) + 1,
                        }));
                      }
                      }
                      className="p-2 bg-gray-300 rounded"
                    >
                      +
                    </button>

                    <div className="ml-4"> 
                    <FontAwesomeIcon color="red" className="hover:cursor-pointer" onClick={() => handleRemoveCart(item.cartItemId)} icon={faTrashCan}/>
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
                Explore Our Products
              </button>
            </div>
          )}
        </div>

        {/* Shipping and Payment Section */}
        <div className="w-full lg:w-1/3 space-y-6">
          {clientToken ? (
            <div className="bg-white p-6 rounded-md shadow-md">
              <h3 className="text-lg font-semibold mb-4">Shipping and Payment</h3>
              {address.length === 0 ? (
                <button
                  onClick={() => router.push("/address/create")}
                  className="w-full bg-secondary text-white py-2 rounded-md mb-2 text-sm sm:text-base"
                >
                  Create Address
                </button>
              ) : (
                <div>
                  <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">
                    Shipping Address
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
                    <option value="">Select an Address</option>
                    {address.map((addr) => (
                      <option key={addr.addressId} value={addr.addressDetail}>
                        {addr.addressDetail}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <label htmlFor="shippingOption" className="block text-sm font-medium text-gray-700">
                Shipping Option
              </label>
              <select
                id="shippingOption"
                className="w-full p-2 mb-4 border rounded-md focus:outline-none"
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
                <option value="">Select a Shipping Option</option>
                {shippingOptions.map((option, index) => (
                  <option key={index} value={option.shipping_name}>
                    {option.shipping_name} - Rp. {option.grandtotal}
                  </option>
                ))}
              </select>

              {/* Voucher Section */}
              <label htmlFor="voucher" className="block text-sm font-medium text-gray-700">
                Voucher Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="voucher"
                  className="w-full p-2 border rounded-md focus:outline-none"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Enter Voucher Code"
                />
                <button
                  className="p-2 bg-secondary rounded-md text-white text-sm sm:text-base"
                  onClick={checkVoucher}
                >
                  Check
                </button>
              </div>

              {/* Price Summary */}
              <div className="flex flex-col space-y-2 mt-6">
                <div className="flex justify-between">
                  <span className="text-sm sm:text-lg font-semibold">Total Price:</span>
                  <span className="font-light text-primary">Rp. {price.totalPrice}</span>
                </div>
                {selectedShipping && (
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-lg font-semibold">Shipping Fee:</span>
                    <span className="font-light text-primary">Rp. {price.shippingFee}</span>
                  </div>
                )}
                {price.voucher !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-lg font-semibold">Voucher:</span>
                    <span className="font-light text-primary">- Rp. {price.voucher}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-lg sm:text-xl font-semibold">Grand Total:</span>
                  <span className="font-light text-primary">
                    Rp. {price.totalPrice + price.shippingFee - (price.voucher ? price.voucher : 0)}
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-secondary text-white py-2 sm:py-3 mt-4 rounded-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all"
                onClick={checkOut}
              >
                Checkout
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-md shadow-md h-full flex flex-col items-center justify-center">
              <p className="text-gray-600 mb-6">You need to login first to access this feature.</p>
              <button
                onClick={() => (window.location.href = "/auth/login")}
                className="bg-secondary text-white py-2 px-4 rounded-md"
              >
                Login Now
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
