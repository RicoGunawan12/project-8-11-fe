"use client"
import React, { useEffect, useState } from 'react';
import NavigationBar from '../component/navbar';
import Image from 'next/image';
import { getTokenCookie } from '../utilities/token';
import { useRouter } from 'next/navigation';

const CartPage = () => {

    const router = useRouter()

    useEffect(() => {
        const clientToken = getTokenCookie();

        if(!clientToken){
            // router.push("/")
        }

    }, [router]);

    return (
        <div className="bg-gray-100 h-screen  pt-24">
            <NavigationBar />
            <div className="flex flex-col lg:flex-row gap-8 px-4">
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-2xl font-semibold mb-2">Shopping Bag</h2>
                    <p className="text-gray-500 mb-6">2 items in your bag</p>

                    <div className="space-y-4">
                        {[1, 2].map((item) => (
                            <div key={item} className="flex items-center p-4 bg-gray-50 rounded-2xl shadow-sm">
                                <Image
                                    src="/a.jpg"
                                    alt="Product"
                                    className="w-24 h-24 rounded-2xl object-cover"
                                    width={200}
                                    height={200}
                                />
                                <div className="ml-4 flex-1">
                                    <p className="text-sm text-gray-500">Sports</p>
                                    <h3 className="text-lg font-semibold">Sports Drink</h3>
                                    <p className="text-sm text-gray-500">Color: Blue | Size: Large</p>
                                </div>
                                <div className="text-gray-800 font-bold">$20.50</div>
                                <div className="flex items-center ml-4">
                                    <button className="p-2 bg-gray-300 rounded">-</button>
                                    <span className="px-4">2</span>
                                    <button className="p-2 bg-gray-300 rounded">+</button>
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
                            <span>$71.50</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Discount</span>
                            <span className="text-green-500">-$4.00</span>
                        </div>
                        <div className="flex justify-between font-semibold text-xl">
                            <span>Total</span>
                            <span>$67.50</span>
                        </div>
                        <button className="w-full bg-yellow-500 text-white py-2 rounded-md mt-4">Checkout</button>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default CartPage;
