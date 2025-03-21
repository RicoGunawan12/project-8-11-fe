"use client";
import React, { useEffect, useState } from "react";
import { toastError, toastSuccess } from "../utilities/toast";
import { getTokenCookie, getUserId } from "../utilities/token";
import { Transaction } from "../model/transactions";
import NavigationBar from "../component/navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TransactionPage = () => {
  const router = useRouter();
  const [data, setData] = useState<Transaction[]>([]);
  const clientToken = getTokenCookie();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'View Transaction History Page', {
        user_id : getUserId()
      });
    }
  }, [])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.TRANSACTIONS}/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${clientToken}`,
          },
        });

        const resp = await response.json();
        if (!response.ok) {
          
          if (response.status === 401) {
            router.push("/auth/login");
          }
          throw new Error(resp.message);
        }

        setData(resp.transactions);

      } catch (error: any) {
        toastError(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 h-screen text-black pt-24">
      <NavigationBar />

      <div className="bg-white text-gray-800 mx-6 p-6 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-semibold mb-4">Transaction History</h1>
        {data.length > 0 ? (
          <div className="space-y-6">
            {data.map((transaction) => (
              <div
                key={transaction.transactionId}
                className="p-4 border border-gray-300 rounded-lg shadow-md"
              >
                <h2 className="text-lg font-bold mb-2">
                  Transaction ID: {transaction.transactionId}
                </h2>
                <p>
                  <strong>User:</strong> {transaction.user?.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {transaction.user?.email}
                </p>
                <p>
                  <strong>Status:</strong> {transaction.status}
                </p>
                <p>
                  <strong>Total Price:</strong> $
                  {transaction.totalPrice.toFixed(2)}
                </p>
                <p>
                  <strong>Payment Method:</strong> {transaction.paymentMethod}
                </p>
                <p>
                  <strong>Expedition:</strong> {transaction.expedition} -{" "}
                  {transaction.shippingType}
                </p>
                <p>
                  <strong>Delivery Fee:</strong> $
                  {transaction.deliveryFee.toFixed(2)}
                </p>
                <p>
                  <strong>Notes:</strong> {transaction.notes || "N/A"}
                </p>
                {transaction.status == "Unpaid" ? (
                  <Link href={`/payment/${transaction.paymentMethod}/${transaction.transactionId}`}>
                    Pay
                  </Link>
                ) : (
                  null
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionPage;
