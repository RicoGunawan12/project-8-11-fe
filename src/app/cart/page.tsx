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
    const [cashOnDelivery, setCashOnDelivery] = useState(false);
    const [shippingOptions, setShippingOptions] = useState<Shipping[]>([]);
    const [selectedShipping, setSelectedShipping] = useState<Shipping | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [voucherCode, setVoucherCode] = useState<string>(""); // New state for voucher code
    const [isShippingEnabled, setIsShippingEnabled] = useState(false);
    const clientToken = getTokenCookie();

    useEffect(() => {
        if (!clientToken) {
            router.push("/");
            return;
        }

        const fetchCartAndAddressData = async () => {
            try {
                const cartResponse = await fetch(`${process.env.CART}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${clientToken}` },
                });
                const cartData = await cartResponse.json();
                if (!cartResponse.ok) {
                    throw new Error(cartData.message || "Failed to fetch cart data");
                }

                const addressResponse = await fetch(`${process.env.ADDRESS}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${clientToken}` },
                });
                const addressData = await addressResponse.json();
                if (!addressResponse.ok) {
                    throw new Error(addressData.message || "Failed to fetch address data");
                }

                setData(cartData);
                setQuantities(
                    cartData.reduce((acc: { [key: string]: number }, item: Cart) => {
                        acc[item.productVariantId] = item.quantity || 1;
                        return acc;
                    }, {})
                );
                setAddress(addressData);

                toastSuccess("Cart and address data loaded successfully");
            } catch (error: any) {
                toastError(error.message || "An unexpected error occurred");
            }
        };

        fetchCartAndAddressData();
    }, [router, clientToken]);

    const calculateShippingOptions = useCallback(async () => {
        if (!chosenAddress) {
            toastError("Please select a shipping address.");
            return;
        }

        let totalWeight = 0;
        const cartTotal = data.reduce((total, item) => {
            totalWeight += item.product_variant.productWeight * quantities[item.productVariantId];
            return total + item.product_variant.productPrice * quantities[item.productVariantId];
        }, 0);

        const url = `${process.env.ADDRESS}/calculate?shipperDestinationId=1&receiverDestinationId=${chosenAddress.komshipAddressId}&weight=${totalWeight}&itemValue=${cartTotal}&cod=${cashOnDelivery}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { Authorization: `Bearer ${clientToken}` },
            });

            const resp = await response.json();
            if (!response.ok) {
                throw new Error(resp.message);
            }

            setShippingOptions(resp.calculationResult.data.calculate_reguler);
            setIsShippingEnabled(true);
            toastSuccess(resp.message);
        } catch (error: any) {
            toastError(error.message || "Failed to calculate shipping options");
        }
    }, [clientToken, data, quantities, cashOnDelivery, chosenAddress]);

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
                    addressId : chosenAddress?.addressId,
                    paymentMethod: paymentMethod,
                    // voucherId: voucherCode,
                    expedition: selectedShipping?.shipping_name,
                    shippingType: "Reguler",
                    deliveryFee: selectedShipping?.grandtotal,
                    deliveryCashback: selectedShipping?.shipping_cashback,
                    notes: "",
                }),
            });

            const resp = await response.json();
            if (!response.ok) {
                throw new Error(resp.message);
            }

            router.push(`/payment/${paymentMethod}/${resp.transaction.transactionId}`);

            toastSuccess(resp.message);
            
        } catch (error: any) {
            toastError(error.message || "Failed to complete the checkout process");
        }
    };

    if (!data) {
        return <Loading />;
    }

    return (
        <div className="bg-gray-100 h-screen text-black pt-24">
            <NavigationBar />
            <div className="flex flex-col lg:flex-row gap-8 px-4">
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-2xl font-semibold mb-2">Shopping Bag</h2>
                    <p className="text-gray-500 mb-6">{data.length} items in your bag</p>

                    <div className="space-y-4">
                        {data.map((item) => (
                            <div key={item.productVariantId} className="flex items-center p-4 bg-gray-50 rounded-2xl shadow-sm">
                                <Image
                                    src={`${process.env.BACK_BASE_URL}${item.product_variant.productImage}`}
                                    alt="Product"
                                    className="w-24 h-24 rounded-2xl object-cover"
                                    width={200}
                                    height={200}
                                />
                                <div className="ml-4 flex-1">
                                    <h3 className="text-lg font-semibold">{item.cartItemId}</h3>
                                    <p className="text-sm text-gray-500">
                                        Color: {item.product_variant.productColor} | Size: {item.product_variant.productSize}
                                    </p>
                                </div>
                                <div className="text-gray-800 font-bold">
                                    $ {item.product_variant.productPrice * quantities[item.productVariantId]}
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
                                    <span className="px-4">{quantities[item.productVariantId]}</span>
                                    <button
                                        onClick={() =>
                                            setQuantities((prev) => ({
                                                ...prev,
                                                [item.productVariantId]: (prev[item.productVariantId] || 1) + 1,
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

                <div className="w-full lg:w-1/3 space-y-6">
                    <div className="bg-white p-6 rounded-md shadow-md">
                        <h3 className="text-lg font-semibold mb-4">Shipping and Payment</h3>

                        {/* Address Selection */}
                        <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">
                            Shipping Address
                        </label>
                        <select
                            id="shippingAddress"
                            className="w-full p-2 mb-4 border rounded-md focus:outline-none"
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const selectedAddress = address.find((addr) => addr.addressId === selectedId);
                                setChosenAddress(selectedAddress); // Pass the full address object to the state
                            }}
                        >
                            <option value="">Select an Address</option>
                            {address.map((addr) => (
                                <option key={addr.addressId} value={addr.addressId}>
                                    {addr.addressDetail}
                                </option>
                            ))}
                        </select>

                        {/* Shipping Option */}
                        <button
                            className="w-full bg-gray-800 text-white py-2 rounded-md mb-4"
                            onClick={calculateShippingOptions}
                        >
                            Calculate Shipping
                        </button>

                        <label htmlFor="shippingOption" className="block text-sm font-medium text-gray-700">
                            Shipping Option
                        </label>
                        <select
                            id="shippingOption"
                            className="w-full p-2 mb-4 border rounded-md focus:outline-none"
                            disabled={!isShippingEnabled}
                            onChange={(e) =>
                                setSelectedShipping(
                                    shippingOptions.find((option) => option.shipping_name === e.target.value) || null
                                )
                            }
                        >
                            <option value="">Select a Shipping Option</option>
                            {shippingOptions.map((option, index) => (
                                <option key={index} value={option.shipping_name}>
                                    {option.shipping_name} - $ {option.grandtotal}
                                </option>
                            ))}
                        </select>

                        {/* Payment Method */}
                        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                            Payment Method
                        </label>
                        <select
                            id="paymentMethod"
                            className="w-full p-2 mb-4 border rounded-md focus:outline-none"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="">Select a Payment Method</option>
                            <option value="checkout-credit">Credit Card</option>
                            <option value="checkout-qris">QRIS</option>
                            <option value="checkout-va">Virtual Account</option>
                        </select>

                        {/* Voucher Input */}
                        <label htmlFor="voucher" className="block text-sm font-medium text-gray-700">
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
                            className="w-full bg-blue-600 text-white py-2 rounded-md"
                            onClick={checkOut}
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
