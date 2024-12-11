"use client";
import React, { useEffect, useState } from "react";
import NavigationBar from "../component/navbar";
import { getTokenCookie } from "../utilities/token";
import { UserData } from "../model/user";
import { Transaction, TransactionDetail } from "../model/transactions";

const ProfilePage = () => {
  const [user, setUser] = useState<UserData>({
    username: "",
    email: "",
  });
  const [totalTransaction, setTotalTransaction] = useState<Transaction[]>([]); // Transaction list state
  const [loading, setLoading] = useState(true);
  const clientToken = getTokenCookie();

  const fetchData = async () => {
    try {
      setLoading(true);
      const userResponse = await fetch(`${process.env.USER}/data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clientToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();

      const transactionResponse = await fetch(
        `${process.env.TRANSACTIONS}/user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${clientToken}`,
          },
        }
      );

      if (!transactionResponse.ok) {
        throw new Error("Failed to fetch transaction data");
      }
      const transactionData = await transactionResponse.json();
      console.log(transactionData)
      setUser(userData);
      setTotalTransaction(transactionData.transactions); // Assume this returns an array of transactions
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-screen h-screen bg-white flex flex-col">
      <NavigationBar />
      <div className="mt-20 h-full flex">
        {/* Left side - Image */}
        <div className="w-1/2 h-full bg-gray-200 flex items-center justify-center">
          <img
            src="/a.jpg" // Replace with your image URL
            alt="Profile"
            className="w-3/4 h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Right side - Data */}
        <div className="w-1/2 h-full px-8 py-6 bg-white">
          {loading ? (
            <p className="text-center text-lg font-medium">Loading...</p>
          ) : (
            <div className="flex flex-col space-y-8">
              {/* User Data */}
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-700">User Profile</h2>
                <p className="mt-2 text-gray-600">
                  <strong>Name:</strong> {user?.username || "N/A"}
                </p>
                <p className="mt-2 text-gray-600">
                  <strong>Email:</strong> {user?.email || "N/A"}
                </p>
              </div>

              {/* Total Transactions */}
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-black">
                  Total Transactions
                </h2>
                <div className="mt-4 space-y-4">
                  {totalTransaction.length > 0 ? (
                    totalTransaction.map((transaction, index) => (
                      <div
                        key={transaction.transactionId || index}
                        className="bg-white text-black p-4 rounded-lg shadow"
                      >
                        <p>
                          <strong>Transaction ID:</strong>{" "}
                          {transaction.transactionId}
                        </p>
                        <p>
                          <strong>Total Price:</strong> ${transaction.totalPrice}
                        </p>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(transaction.transactionDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Status:</strong> {transaction.status}
                        </p>
                        <div className="mt-2">
                          <strong>Details:</strong>
                          <ul className="list-disc list-inside text-gray-600">
                            {transaction.transaction_details.map(
                              (detail: TransactionDetail, i) => (
                                <li key={i}>
                                  <span className="font-medium">
                                    {detail.product_variant.productName}
                                  </span>{" "}
                                  - Qty: {detail.quantity} - Price: $
                                  {detail.product_variant.productPrice}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No transactions available.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
