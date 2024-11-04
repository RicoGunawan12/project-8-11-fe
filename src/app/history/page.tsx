"use client"
import { useEffect, useState } from 'react';
import NavigationBar from '../component/navbar';
import { useRouter } from 'next/navigation';
import { getTokenCookie } from '../utilities/token';
import Link from 'next/link';

const transactionData = [
  {
    id: 'PR240400304',
    totalAmount: 'Rp388.000,00',
    status: 'Accepted',
    createdDate: '16/04/2024',
    itemsCount: 1,
    isCompleted: true,
  },
  {
    id: 'PR240400081',
    totalAmount: 'Rp4.400.000,00',
    status: 'Accepted',
    createdDate: '02/04/2024',
    itemsCount: 1,
    isCompleted: true,
  },
  {
    id: 'PR240400076',
    totalAmount: 'Rp10.270.000,00',
    status: 'Canceled',
    createdDate: '02/04/2024',
    itemsCount: 2,
    isCompleted: true,
  },
];

const RequisitionsPage = () => {

  const router = useRouter()

  useEffect(() => {
    const clientToken = getTokenCookie();

    if (!clientToken) {
      // router.push("/")
    }

  }, [router]);

  return (
    <div className="w-screen h-screen bg-white">
      <NavigationBar />
      <div className="px-6 w-full">
        <h1 className="text-2xl font-semibold mt-24">Transaction History</h1>
        <div className='gap-6 flex flex-col'>
          {transactionData.map(req => (
            <Link href={`/history/${req.id}`} key={req.id}>
              <div className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{req.id}</h2>
                    <p className="text-sm text-gray-600">Total Amount: {req.totalAmount}</p>
                    <p className="text-sm text-gray-600">{req.itemsCount} item{req.itemsCount > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 text-sm font-medium rounded ${req.status === 'Accepted'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {req.status}
                    </span>
                    <p className="text-sm text-gray-500">Created on {req.createdDate}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RequisitionsPage