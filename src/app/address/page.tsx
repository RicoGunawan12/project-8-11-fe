"use client";
import React, { useEffect, useState } from "react";
import NavigationBar from "../component/navbar";
import { getTokenCookie } from "../utilities/token";
import { UserData } from "../model/user";
import { Transaction } from "../model/transactions";


const ProfilePage = () => {
  const [user, setUser] = useState<UserData>({
    fullName: "",
    email: "",
  });
  const [totalTransaction, setTotalTransaction] = useState<Transaction[]>([]);
  const [addressData, setAddressData] = useState<any[]>([]); // State for address data
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

      setUser(userData);
      setTotalTransaction(transactionData.transactions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const FetchAddressData = async () => {
    try {
      const response = await fetch(`${process.env.ADDRESS}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${clientToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setAddressData(data); 
    } catch (error) {
      console.error("Error fetching address data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    FetchAddressData()
  }, []);

  return (
    <div className="w-screen h-screen bg-white flex flex-col">
      <NavigationBar />
      <div className="mt-20 h-full flex">
        <div className="w-full h-full px-8 py-6 bg-white">
          {loading ? (
            <p className="text-center text-lg font-medium">Loading...</p>
          ) : (
            <div className="flex flex-col space-y-12">
              {/* User Data */}
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-700">
                  User Details
                </h2>
                <p className="mt-2 text-gray-600">
                  <strong>Name:</strong> {user?.fullName || "N/A"}
                </p>
                <p className="mt-2 text-gray-600">
                  <strong>Email:</strong> {user?.email || "N/A"}
                </p>
              </div>

              {/* Transactions Table */}
              <div>
                <h2 className="text-xl font-bold text-black">Order History</h2>
                <div className="mt-4">
                  {totalTransaction.length > 0 ? (
                    <table className="min-w-full text-left border border-gray-300">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="py-2 px-4 border-b">
                            Komship Order Number
                          </th>
                          <th className="py-2 px-4 border-b">Date</th>
                          <th className="py-2 px-4 border-b">Payment Method</th>
                          <th className="py-2 px-4 border-b">Status</th>
                          <th className="py-2 px-4 border-b">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {totalTransaction.map((transaction, index) => (
                          <tr
                            key={transaction.transactionId || index}
                            className={`${
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } hover:bg-gray-100`}
                          >
                            <td className="py-2 px-4 border-b">
                              {transaction.komshipOrderNumber}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {new Date(
                                transaction.transactionDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {transaction.paymentMethod || "N/A"}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {transaction.status || "N/A"}
                            </td>
                            <td className="py-2 px-4 border-b">
                              Rp{" "}
                              {transaction.totalPrice.toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-600">
                      No transactions available.
                    </p>
                  )}
                </div>
              </div>

              {/* Address Table */}
              <div>
                <h2 className="text-xl font-bold text-black">Address</h2>
                <div className="mt-4">
                  {addressData.length > 0 ? (
                    <table className="min-w-full text-left border border-gray-300">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="py-2 px-4 border-b">ID</th>
                          <th className="py-2 px-4 border-b">City Name</th>
                          <th className="py-2 px-4 border-b">Address Detail</th>
                          <th className="py-2 px-4 border-b">Province</th>
                          <th className="py-2 px-4 border-b">Subdistrict</th>
                          <th className="py-2 px-4 border-b">Label</th>
                          <th className="py-2 px-4 border-b">Receiver</th>
                          <th className="py-2 px-4 border-b">Phone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {addressData.map((address, index) => (
                          <tr
                            key={address.addressId || index}
                            className={`${
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } hover:bg-gray-100`}
                          >
                            <td className="py-2 px-4 border-b">
                              {address.addressId}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {address.addressCity}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {address.addressDetail}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {address.addresProvince}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {address.addressSubdistrict}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {address.komshipLabel}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {address.receiverName}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {address.receiverPhoneNumber}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-600">No addresses available.</p>
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
