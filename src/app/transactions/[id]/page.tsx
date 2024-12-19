"use client";
import { useState, useEffect } from "react";
import { Transaction } from "@/app/model/transactions";
import { useParams, useRouter } from "next/navigation";
import { getTokenCookie } from "@/app/utilities/token";
import NavigationBar from "@/app/component/navbar";
import Banner from "@/app/component/banner";
import Footer from "@/app/component/footer";
import Loading from "@/app/utilities/loading";
import { toastError, toastSuccess } from "@/app/utilities/toast";
import { mapPaymentMethod } from "@/app/utilities/converter";

const TransactionPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>();

  useEffect(() => {
    const clientToken = getTokenCookie();
    if (!clientToken) {
      router.push("/");
    }
    setToken(clientToken);

    if (!id) return;

    const fetchTransaction = async () => {
      console.log(token);
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
        console.log(data.transaction);
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
      console.log("Transaction canceled successfully:", data);

      setTransaction((prevTransaction) =>
        prevTransaction ? { ...prevTransaction, status: "Canceled" } : null
      );
    } catch (err: any) {
      toastError(err.message || "Failed to cancel transaction");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-screen h-screen bg-white">
      <NavigationBar />
      <div className="mt-20 h-full">
        <Banner title="Transaction Details" imagePath="/banner.jpg" />
        <div className="text-black p-12">
          <div className="flex justify-center items-center flex-col gap-6">
            <div className="p-6 border-2 w-3/4 rounded-md shadow-2xl bg-gray-50">
              <h2 className="text-2xl font-semibold text-black mb-4 flex justify-between">
                <span>Transactions Information</span>
                {transaction?.status === "Unpaid" ? (
                  <div className="flex">
                    <span className="ml-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/payment/${transaction?.paymentMethod}/${transaction?.transactionId}`
                          )
                        }
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
                )  : null}
              </h2>
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
                        <img
                          src={`${process.env.BACK_BASE_URL}${detail.product_variant.productImage}`}
                          alt="Product"
                          className="w-[150px] h-full object-fill"
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
    </div>
  );
};

export default TransactionPage;
