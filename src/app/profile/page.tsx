"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavigationBar from "../component/navbar";
import { deleteTokenCookie, getTokenCookie, getUserId } from "../utilities/token";
import { UserData } from "../model/user";
import { Transaction } from "../model/transactions";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import Banner from "../component/banner";
import { Loading } from "../utilities/loading";
import { formatCurrency, mapPaymentMethod } from "../utilities/converter";
import Footer from "../component/footer";
import { Bounce, toast } from "react-toastify";
import DeleteConfirmationModal from "../component/modal/deleteConfirmation";

const ProfilePage = () => {
  const [user, setUser] = useState<UserData>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [totalTransaction, setTotalTransaction] = useState<Transaction[]>([]);
  const [addressData, setAddressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [activeAddress, setActiveAddress] = useState<string | null>(null); // For active accordion
  const [update, setUpdate] = useState(false);
  const clientToken = getTokenCookie();
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState({ name: '', category: '', id: '' })
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'View Profile Page', {
        user_id : getUserId()
      });
    }
  }, [])

  const fetchData = async () => {
    if (!clientToken) {
      router.push("/auth/login");
    }

    try {
      setLoading(true);
      const userResponse = await fetch(`${process.env.USER}/data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clientToken}`,
        },
      });

      if (userResponse.status === 401) {
          deleteTokenCookie();
          router.push("/auth/login");
      }

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
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddressData = async () => {
    try {
      setLoadingAddress(true);
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
      console.error("Failed to fetch address data:", error);
    } finally {
      setLoadingAddress(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchAddressData();
  }, [update]);

  if (loading || loadingAddress) {
    return <Loading />;
  }

  if (!user || !addressData) {
    return (
      <div className="w-screen h-screen bg-white text-black flex flex-col justify-center items-center">
        <p className="text-center text-lg font-medium">Failed to load data</p>
      </div>
    );
  }

  const toggleAccordion = (addressId: string) => {
    setActiveAddress(activeAddress === addressId ? null : addressId);
  };

  const handleDeleteAddress = async (addressId: string) => {
    toast.promise(
      fetch(`${process.env.ADDRESS}/${addressId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${clientToken}`,
        },
      }).then(async (response) => {
        if (response.status === 401) {
          deleteTokenCookie();
          router.push("/auth/login");
        }
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to delete the address.");
        }
        return data;
      }),
      {
        pending: "Deleting address...",
        success: "Address deleted successfully!",
        error: {
          render({ data }: any) {
            return (
              data?.message || "An error occurred while deleting the address."
            );
          },
        },
      }
    );
    setUpdate(!update);
    setIsModalOpen(false)
    setSelectedAddress({ name: '', category: '', id: '' })
  };

  return (
    <div className="w-screen min-h-screen h-auto bg-white text-black flex flex-col">
      <NavigationBar />
      <div className="mt-20 h-full">
        <Banner page="Profile Page" text="Profile" />
        {/* <Banner imagePath="/banner.jpg" title="Profile" /> */}
        <div className="w-full flex justify-center min-h-[80vh] px-8 pt-6 pb-20 bg-white">
          {loading ? (
            <p className="text-center text-lg font-medium">Loading...</p>
          ) : (
            <div className="flex w-3/4 max-sm:w-full flex-col space-y-8">
              {/* User Details */}
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-700">
                  User Details
                </h2>
                <p className="mt-2 text-gray-600">
                  <strong>Full Name :</strong> {user?.fullName || "N/A"}
                </p>
                <p className="mt-2 text-gray-600">
                  <strong>Email :</strong> {user?.email || "N/A"}
                </p>
                <p className="mt-2 text-gray-600">
                  <strong>Phone :</strong> {user?.phone || "N/A"}
                </p>
              </div>

              {/* Transactions Table */}
              <div>
                <h2 className="text-xl font-bold">Order History</h2>
                <div className="mt-4 overflow-y-auto max-h-96">
                  {totalTransaction.length > 0 ? (
                    <>
                      <table className="min-w-full text-left border border-gray-300">
                        <thead className="sticky top-0">
                          <tr className="bg-gray-200">
                            <th className="py-2 px-4 border border-gray-300">
                              Order Number
                            </th>
                            <th className="py-2 px-4 border-b">Date</th>
                            <th className="py-2 px-4 border-b">Payment</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {totalTransaction.map((transaction, index) => (
                            <tr
                              key={transaction.transactionId || index}
                              className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                } hover:bg-gray-100 cursor-pointer`}
                              onClick={() =>
                                router.push(
                                  `/transactions/${transaction.transactionId}`
                                )
                              }
                            >
                              <td className="py-2 px-4 border-b">
                                {transaction.readableId}
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
                                {mapPaymentMethod(
                                  transaction.paymentMethod || "N/A"
                                )}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {transaction.status || "N/A"}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {formatCurrency(transaction.totalPrice)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <p className="text-gray-600">No transactions available.</p>
                  )}
                </div>
              </div>

              {/* Address Accordion */}
              <div>
                <div className="flex justify-between">
                  <h2 className="text-xl font-bold">Addresses</h2>
                  <button
                    onClick={() => router.push("/address/create")}
                    className="px-4 py-2 bg-secondary text-white rounded"
                  >
                    Add Address
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {loadingAddress ? (
                    <p className="text-center text-lg font-medium">
                      Loading...
                    </p>
                  ) : (
                    <>

                      <div className="relative">
                        <DeleteConfirmationModal header={`Confirm Delete ${selectedAddress?.category || "Item"}`} description={`Are you sure you want to delete ${selectedAddress.name} ?`} onDelete={() => handleDeleteAddress(selectedAddress.id)} isVisible={isModalOpen} onCancel={() => { setIsModalOpen(false) }} />
                      </div>
                      {addressData.map((address: any) => (
                        <motion.div
                          key={address.addressId}
                          className="border-b"
                        >
                          <button
                            onClick={() => toggleAccordion(address.addressId)}
                            className="w-full text-left p-4 bg-gray-200 hover:bg-gray-300"
                          >
                            <div className="flex justify-between items-center">
                              <span>
                                {address.addressCity} - {address.addressDetail}
                              </span>
                              <span className="text-sm flex gap-6 text-gray-500">
                                <div
                                  className="text-red-500 hover:text-red-600 hover:font-semibold transition"
                                  onClick={() => {
                                      setSelectedAddress({
                                        name: address.addressDetail,
                                        category: 'Address',
                                        id: address.addressId
                                      })
                                      setIsModalOpen(true)
                                    }
                                  }
                                >
                                  Delete
                                </div>
                                <div
                                  className=" hover:text-white hover:font-semibold transition"
                                  onClick={() =>
                                    router.push(`/address/${address.addressId}`)
                                  }
                                >
                                  Update
                                </div>
                              </span>
                            </div>
                          </button>

                          {/* Dropdown content with smooth animation */}
                          <AnimatePresence>
                            {activeAddress === address.addressId && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="p-4 bg-gray-50"
                              >
                                <p>
                                  <strong>City:</strong> {address.addressCity}
                                </p>
                                <p>
                                  <strong>Detail:</strong>{" "}
                                  {address.addressDetail}
                                </p>
                                <p>
                                  <strong>Label:</strong> {address.komshipLabel}
                                </p>
                                <p>
                                  <strong>Receiver:</strong>{" "}
                                  {address.receiverName}
                                </p>
                                <p>
                                  <strong>Phone:</strong>{" "}
                                  {address.receiverPhoneNumber}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;
