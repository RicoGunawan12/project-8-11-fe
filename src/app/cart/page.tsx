"use client"
import React, { useEffect, useState } from 'react';
import NavigationBar from '../component/navbar';
import Image from 'next/image';
import { getTokenCookie } from '../utilities/token';
import { useRouter } from 'next/navigation';
import { toastError, toastSuccess } from '../utilities/toast';
import { Cart } from '../model/cart';
import Loading from '../utilities/loading';

const CartPage = () => {
    const router = useRouter();
    const [data, setData] = useState<Cart[]>([]);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const clientToken = getTokenCookie();

        if (!clientToken) {
            router.push("/");
            return;
        }

        const getCartData = async () => {
            try {
                const response = await fetch(`${process.env.CART}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${clientToken}`,
                    },
                });

                const resp = await response.json();
                if (!response.ok) {
                    throw new Error(resp.message);
                }
                setData(resp);
                setQuantities(resp.reduce((acc: { [key: string]: number }, item: Cart) => {
                    acc[item.productVariantId] = item.quantity || 1;
                    return acc;
                }, {}));

                toastSuccess(resp.message);
            } catch (error: any) {
                toastError(error.message);
            }
        };

        getCartData();
    }, [router]);

    const increaseQuantity = (productVariantId: string) => {
        setQuantities((prev) => ({
            ...prev,
            [productVariantId]: (prev[productVariantId] || 1) + 1,
        }));
    };

    const decreaseQuantity = (productVariantId: string) => {
        setQuantities((prev) => ({
            ...prev,
            [productVariantId]: Math.max((prev[productVariantId] || 1) - 1, 1),
        }));
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
                                    <p className="text-sm text-gray-500">{item.productVariantId}</p>
                                    <h3 className="text-lg font-semibold">{item.product_variant.productStock}</h3>
                                    <p className="text-sm text-gray-500">
                                        Color: {item.product_variant.productColor} | Size: {item.product_variant.productSize}
                                    </p>
                                </div>
                                <div className="text-gray-800 font-bold">
                                    $ {item.product_variant.productPrice * quantities[item.productVariantId]}
                                </div>
                                <div className="flex items-center ml-4">
                                    <button
                                        onClick={() => decreaseQuantity(item.productVariantId)}
                                        className="p-2 bg-gray-300 rounded"
                                    >
                                        -
                                    </button>
                                    <span className="px-4">{quantities[item.productVariantId]}</span>
                                    <button
                                        onClick={() => increaseQuantity(item.productVariantId)}
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
                        <h3 className="text-lg font-semibold mb-4">Calculated Shipping</h3>
                        <select className="w-full p-2 mb-4 border rounded-md focus:outline-none">
                            <option>Address</option>
                        </select>
                        <button className="w-full bg-gray-800 text-white py-2 rounded-md">Update</button>
                    </div>

                    <div className="bg-white p-6 rounded-md shadow-md">
                        <h3 className="text-lg font-semibold mb-4">Voucher Code</h3>
                        <p className="text-gray-500 text-sm mb-4">
                            Enter your voucher code for discounts.
                        </p>
                        <input
                            type="text"
                            placeholder="Voucher Code"
                            className="w-full p-2 mb-4 border rounded-md focus:outline-none"
                        />
                        <button className="w-full bg-gray-800 text-white py-2 rounded-md">Apply</button>
                    </div>

                    <div className="bg-yellow-100 p-6 rounded-md shadow-md">
                        <h3 className="text-lg font-semibold mb-4">Cart Total</h3>
                        <div className="flex justify-between mb-2">
                            <span>Cart Subtotal</span>
                            <span>
                                $ {data.reduce((total, item) => total + item.product_variant.productPrice * quantities[item.productVariantId], 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Discount</span>
                            <span className="text-green-500">-$4.00</span>
                        </div>
                        <div className="flex justify-between font-semibold text-xl">
                            <span>Total</span>
                            <span>
                                $ {(data.reduce((total, item) => total + item.product_variant.productPrice * quantities[item.productVariantId], 0) - 4).toFixed(2)}
                            </span>
                        </div>
                        <button className="w-full bg-yellow-500 text-white py-2 rounded-md mt-4">Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
