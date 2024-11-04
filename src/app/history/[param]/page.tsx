import NavigationBar from '@/app/component/navbar';
import Image from 'next/image';
import React from 'react';

const transaction = {
    transactionId: 'TXN123456789',
    date: '31/10/2024',
    status: 'Accepted',
    items: [
        { id: 1, name: 'Item A', quantity: 1, price: 'Rp50.000,00', image_link: '/a.jpg' },
        { id: 2, name: 'Item B', quantity: 2, price: 'Rp100.000,00', image_link: '/a.jpg' },
        { id: 3, name: 'Item C', quantity: 1, price: 'Rp75.000,00', image_link: '/a.jpg' },
    ],
    shippingAddress: {
        name: 'Binus Anggrek',
        street: 'Kebun Jeruk',
        city: 'Jakarta',
        state: 'Indonesia',
        postalCode: '12345',
    },
    paymentMethod: 'Paypal',
    totalPrice: 'Rp225.000,00',
};

const TransactionDetail = () => {
    return (
        <div className="w-screen h-screen bg-white">
            <NavigationBar />
            <div className='px-6 w-full'>
                <h1 className="text-2xl font-semibold mt-24">Transaction Details</h1>

                <div className="mb-6 border rounded-lg p-4 shadow-sm">
                    <h2 className="text-lg font-semibold">Transaction Summary</h2>
                    <p className="text-gray-600">Transaction ID: {transaction.transactionId}</p>
                    <p className="text-gray-600">Date: {transaction.date}</p>
                    <p className="text-gray-600">Status:
                        <span className={`inline-block px-2 py-1 text-sm font-medium rounded ${transaction.status === 'Accepted'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            {transaction.status}
                        </span>
                    </p>
                </div>

                <div className="mb-6 border rounded-lg p-4 shadow-sm">
                    <h2 className="text-lg font-semibold">Items</h2>
                    <ul className="mt-2 space-y-4">
                        {transaction.items.map(item => (
                            <li key={item.id} className="flex justify-between">
                                <div className='flex'>
                                    <Image
                                        src={item.image_link}
                                        alt="Product"
                                        className="w-24 h-24 rounded-2xl object-cover"
                                        width={200}
                                        height={200}
                                    />
                                    <div className='pl-4'>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-medium">{item.price}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mb-6 border rounded-lg p-4 shadow-sm">
                    <h2 className="text-lg font-semibold">Shipping Address</h2>
                    <p className="text-gray-600">{transaction.shippingAddress.name}</p>
                    <p className="text-gray-600">{transaction.shippingAddress.street}</p>
                    <p className="text-gray-600">{transaction.shippingAddress.city}, {transaction.shippingAddress.state} {transaction.shippingAddress.postalCode}</p>
                </div>

                <div className="mb-6 border rounded-lg p-4 shadow-sm">
                    <h2 className="text-lg font-semibold">Payment Method</h2>
                    <p className="text-gray-600">{transaction.paymentMethod}</p>
                </div>

                {/* Total Price */}
                <div className="border rounded-lg p-4 shadow-sm">
                    <h2 className="text-lg font-semibold">Total Price</h2>
                    <p className="text-2xl font-bold text-gray-800">{transaction.totalPrice}</p>
                </div>
            </div>
        </div>
    );
}

export default TransactionDetail