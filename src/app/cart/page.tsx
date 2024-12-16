"use client";
import React, { useCallback, useEffect, useState } from "react";
import NavigationBar from "../component/navbar";
import Image from "next/image";
import { getTokenCookie } from "../utilities/token";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "../utilities/toast";
import { Cart } from "../model/cart";
import Loading from "../utilities/loading";
import { UserAddress } from "../model/address";
import { Shipping } from "../model/shipping";

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

        setData(cartData);
        console.log(cartData);
        setQuantities(
          cartData.reduce((acc: { [key: string]: number }, item: Cart) => {
            acc[item.productVariantId] = item.quantity || 1;
            return acc;
          }, {})
        );
        setAddress(addressData);

        toastSuccess("Cart and address data loaded successfully");
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

      setData(cartData);
      setQuantities(
        cartData?.reduce((acc: { [key: string]: number }, item: Cart) => {
          acc[item.productVariantId] = item.quantity || 1;
          return acc;
        }, {})
      );
      setLoading(false)
    }
  }, [router, clientToken]);

  const calculateShippingOptions = useCallback(async () => {
    if (!chosenAddress) {
      // toastError("Please select a shipping address.");
      return;
    }
    setLoading(true)
    let totalWeight = 0;
    const cartTotal = data.reduce((total, item) => {
      totalWeight +=
        item.product_variant.productWeight * quantities[item.productVariantId];
      return (
        total +
        item.product_variant.productPrice * quantities[item.productVariantId]
      );
    }, 0);

    const url = `${process.env.ADDRESS}/calculate?shipperDestinationId=1&receiverDestinationId=${chosenAddress.komshipAddressId}&weight=${totalWeight}&itemValue=${cartTotal}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${clientToken}` },
      });

      const resp = await response.json();
      if (!response.ok) {
        throw new Error(resp.message);
      }
      setLoading(false)
      setShippingOptions(resp.calculationResult.data.calculate_reguler);
      setIsShippingEnabled(true);
    } catch (error: any) {
      // toastError(error.message || "Failed to calculate shipping options");
    } finally {
      setLoading(false)
    }
  }, [clientToken, data, quantities, chosenAddress]);

  useEffect(()=> {
    console.log("Dwas")
    if(clientToken){
      calculateShippingOptions()
    }
  },[quantities, chosenAddress])

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
          voucherCode : voucherCode
        }),
      });

      const resp = await response.json();
      if (!response.ok) {
        throw new Error(resp.message);
      }
      console.log(resp)

      router.push(
        resp.payTransactionResponse.actions[0].url
      );

      toastSuccess(resp.message);
    } catch (error: any) {
      toastError(error.message || "Failed to complete the checkout process");
    }
  };

  if (!data || loading) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-100 h-screen text-black pt-24">
      <NavigationBar />
      <div className="flex flex-col lg:flex-row gap-8 px-4">
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Shopping Bag</h2>
          <p className="text-gray-500 mb-6">{data.length} items in your bag</p>
          {data.length > 0 ? (
            <div>
              {" "}
              <div className="space-y-4">
                {data.map((item) => (
                  <div
                    key={item.productVariantId}
                    className="flex items-center p-4 bg-gray-50 rounded-2xl shadow-sm"
                  >
                    <Image
                      src={`${process.env.BACK_BASE_URL}${item.product_variant.productImage}`}
                      alt="Product"
                      className="w-24 h-24 rounded-2xl object-cover"
                      width={200}
                      height={200}
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold">
                        {item.product_variant.product.productName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Color: {item.product_variant.productColor} | Size:{" "}
                        {item.product_variant.productSize}
                      </p>
                    </div>
                    <div className="text-gray-800 font-bold">
                      Rp.{" "}
                      {item.product_variant.productPrice *
                        quantities[item.productVariantId]}
                    </div>
                    <div className="flex items-center ml-4">
                      <button
                        onClick={() =>
                          setQuantities((prev) => ({
                            ...prev,
                            [item.productVariantId]: Math.max(
                              (prev[item.productVariantId] || 1) - 1,
                              1
                            ),
                          }))
                        }
                        className="p-2 bg-gray-300 rounded"
                      >
                        -
                      </button>
                      <span className="px-4">
                        {quantities[item.productVariantId]}
                      </span>
                      <button
                        onClick={() =>
                          setQuantities((prev) => ({
                            ...prev,
                            [item.productVariantId]:
                              (prev[item.productVariantId] || 1) + 1,
                          }))
                        }
                        className="p-2 bg-gray-300 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (

            <div className="w-full h-min-96 flex justify-center items-center">
              <button
                onClick={() => router.push("/product")}
                className="bg-secondary p-4 rounded-xl text-white"
              >
                Explore Our Products
              </button>{" "}
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/3 space-y-6">
          {clientToken ? (
            <div className="bg-white p-6 rounded-md shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Shipping and Payment
              </h3>

              {/* Address Selection */}
              <label
                htmlFor="shippingAddress"
                className="block text-sm font-medium text-gray-700"
              >
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
                  setChosenAddress(selectedAddress); // Pass the full address object to the state
                }}
                disabled={data.length === 0} // Disable if cart is empty
                value={chosenAddress?.addressDetail}
              >
                <option value="">Select an Address</option>
                {address.map((addr) => (
                  <option key={addr.addressId} value={addr.addressDetail}>
                    {addr.addressDetail}
                  </option>
                ))}
              </select>

              <label
                htmlFor="shippingOption"
                className="block text-sm font-medium text-gray-700"
              >
                Shipping Option
              </label>
              <select
                id="shippingOption"
                className="w-full p-2 mb-4 border rounded-md focus:outline-none"
                disabled={!isShippingEnabled} // Enable only if shipping options are available
                onChange={(e) =>
                  setSelectedShipping(
                    shippingOptions.find(
                      (option) => option.shipping_name === e.target.value
                    ) || null
                  )
                }
              >
                <option value="">Select a Shipping Option</option>
                {shippingOptions.map((option, index) => (
                  <option key={index} value={option.shipping_name}>
                    {option.shipping_name} - Rp. {option.grandtotal}
                  </option>
                ))}
              </select>

              {/* Voucher Input */}
              <label
                htmlFor="voucher"
                className="block text-sm font-medium text-gray-700"
              >
                Voucher Code
              </label>
              <input
                type="text"
                id="voucher"
                className="w-full p-2 mb-4 border rounded-md focus:outline-none"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Enter Voucher Code"
              />

              <button
                className="w-full bg-secondary text-white py-2 rounded-md"
                onClick={checkOut}
              >
                Checkout
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-md shadow-md h-full flex flex-col items-center justify-center">
              <p className="text-gray-600 mb-6">
                You need to register first to access this feature.
              </p>
              <button
                onClick={() => (window.location.href = "/auth/register")}
                className="bg-secondary text-white py-2 px-4 rounded-md  transition-colors"
              >
                Register Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
