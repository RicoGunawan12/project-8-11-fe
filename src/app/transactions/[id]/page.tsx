"use client";
import { useState, useEffect } from "react";
import { Transaction } from "@/app/model/transactions";
import { useParams, useRouter } from "next/navigation";
import { getTokenCookie } from "@/app/utilities/token";
import NavigationBar from "@/app/component/navbar";
import Banner from "@/app/component/banner";
import Footer from "@/app/component/footer";
import { Loading } from "@/app/utilities/loading";
import { toastError, toastSuccess } from "@/app/utilities/toast";
import { mapPaymentMethod } from "@/app/utilities/converter";
import Image from "next/image";

const TransactionPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>();
  
  // New state for modals
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const clientToken = getTokenCookie();
    if (!clientToken) {
      router.push("/");
    }
    setToken(clientToken);

    if (!id) return;

    const fetchTransaction = async () => {
      try {
        const response = await fetch(`${process.env.TRANSACTIONS}/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${clientToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transaction data");
        }

        const data = await response.json();
        setTransaction(data.transaction);
      } catch (err: any) {
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const cancelTransaction = async () => {
    try {
      const response = await fetch(`${process.env.TRANSACTIONS}/cancel/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to cancel the transaction");
      }

      const data = await response.json();

      setTransaction((prevTransaction) =>
        prevTransaction ? { ...prevTransaction, status: "Canceled" } : null
      );
    } catch (err: any) {
      toastError(err.message || "Failed to cancel transaction");
    }
  };

  const cancelWaitingForShipping = async () => {
    if (!reason.trim()) {
      toastError("Please provide a reason for cancellation");
      return;
    }

    try {
      const response = await fetch(`${process.env.TRANSACTIONS}/on-review-cancel/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel the transaction");
      }

      const data = await response.json();
      setShowCancelModal(false);
      setReason("");
      toastSuccess("Cancellation request submitted successfully");

      setTransaction((prevTransaction) =>
        prevTransaction ? { ...prevTransaction, status: "Waiting for Admin Approval" } : null
      );
    } catch (err: any) {
      toastError(err.message || "Failed to cancel transaction");
    }
  };

  const returnTransactions = async () => {
    if (!reason.trim()) {
      toastError("Please provide a reason for return");
      return;
    }

    try {
      const response = await fetch(`${process.env.TRANSACTIONS}/on-review-return/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error("Failed to return the transaction");
      }

      const data = await response.json();
      setShowReturnModal(false);
      setReason("");
      toastSuccess("Return request submitted successfully");

      setTransaction((prevTransaction) =>
        prevTransaction ? { ...prevTransaction, status: "Waiting for Admin Approval" } : null
      );
    } catch (err: any) {
      toastError(err.message || "Failed to return transaction");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-screen h-screen bg-white">
      <NavigationBar />
      <div className="mt-20 h-full">
        <Banner text="Transaction Details" page="/Transaction Page" />
        <div className="text-black p-12">
          <div className="flex justify-center items-center flex-col gap-6">
            <div className="p-6 border-2 w-3/4 rounded-md shadow-2xl bg-gray-50">
              <h2 className="text-2xl font-semibold text-black mb-4 flex justify-between">
                <span>Transactions Information</span>
                <div className="text-black">
                  {(() => {
                    switch (transaction?.status) {
                      case "Unpaid":
                        return (
                          <div className="flex">
                            <span className="ml-2">
                              <button
                                onClick={() => router.push(`${transaction.paymentLink}`)}
                                className="text-sm font-semibold bg-secondary p-2 flex justify-center text-white rounded-lg"
                              >
                                Pay Now
                              </button>
                            </span>
                            <span className="ml-2">
                              <button
                                onClick={cancelTransaction}
                                className="text-sm font-semibold bg-red-500 p-2 flex justify-center text-white rounded-lg"
                              >
                                Cancel
                              </button>
                            </span>
                          </div>
                        );

                      case "Waiting for shipping":
                        return (
                          <div className="flex">
                            <span className="ml-2">
                              <button
                                className="text-sm font-semibold bg-blue-500 p-2 flex justify-center text-white rounded-lg"
                                onClick={() => setShowCancelModal(true)}
                              >
                                Cancel Order
                              </button>
                            </span>
                          </div>
                        );

                      case "Done":
                        return (
                          <div className="flex">
                            <span className="ml-2">
                              <button
                                className="text-sm font-semibold bg-green-500 p-2 flex justify-center text-white rounded-lg"
                                onClick={() => setShowReturnModal(true)}
                              >
                                Return Order
                              </button>
                            </span>
                          </div>
                        );

                      default:
                        return null;
                    }
                  })()}
                </div>
              </h2>
              
              {/* Rest of the existing table code... */}
              <table className="min-w-full text-left border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Total Price</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Shipping Type</th>
                    <th className="py-2 px-4 border-b">Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">
                      {transaction?.transactionDate}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {transaction?.totalPrice}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {transaction?.status}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {transaction?.shippingType}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {mapPaymentMethod(transaction?.paymentMethod || "")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Transaction Details section remains the same... */}
            <div className="p-6 border-2 w-3/4 rounded-md shadow-2xl bg-gray-50">
              <h2 className="text-2xl font-semibold text-black mb-4">
                Transaction Details
              </h2>
              <table className="min-w-full text-left border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 border-b">Product</th>
                    <th className="py-2 px-4 border-b">Quantity</th>
                    <th className="py-2 px-4 border-b">Price</th>
                    <th className="py-2 px-4 border-b">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {transaction?.transaction_details.map((detail) => (
                    <tr
                      key={detail.transactionDetailId}
                      className="bg-white hover:bg-gray-100"
                    >
                      <td className="py-2 px-4 border-b">
                        <Image
                          src={`${process.env.BACK_BASE_URL}${detail.product_variant.productImage}`}
                          alt="Product"
                          className="w-[150px] h-full object-fill"
                          width={200}
                          height={200}
                        />
                      </td>
                      <td className="py-2 px-4 border-b">{detail.quantity}</td>
                      <td className="py-2 px-4 border-b">
                        {detail.paidProductPrice}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {detail.paidProductPrice * detail.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* Cancel Shipping Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Cancel Shipping</h3>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setReason("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <textarea
              placeholder="Please provide a reason for cancellation..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-32 p-2 border rounded-md mb-4 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelWaitingForShipping}
                className="px-4 py-2 bg-secondary text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Order Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Return Order</h3>
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setReason("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <textarea
              placeholder="Please provide a reason for return..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-32 p-2 border rounded-md mb-4 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={returnTransactions}
                className="px-4 py-2 bg-secondary text-white rounded-md "
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;