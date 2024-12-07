"use client";
import NavigationBar from "@/app/component/navbar";
import Loading from "@/app/utilities/loading";
import { toastError, toastSuccess } from "@/app/utilities/toast";
import { getTokenCookie } from "@/app/utilities/token";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CheckOutVirtualAccount = () => {
  const router = useParams();
  const id = router.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transaction, setTransaction] = useState<any>(null);
  const clientToken = getTokenCookie();

  const [formData, setFormData] = useState({
    bank: "BNI",
  });

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(`${process.env.TRANSACTIONS}/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${clientToken}`,
          },
        });

        const resp = (await response.json()).transaction;
        if (!response.ok) {
          throw new Error(resp.message);
        }
        setTransaction(resp);
      } catch (error: any) {
        toastError(error.message);
      }
    };

    fetchTransaction();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.TRANSACTIONS}/checkout-va`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${clientToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId: transaction.transactionId,
            amount: transaction.totalPrice,
            bank: formData.bank,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to process payment.");
      }

      toastSuccess("Virtual account created successfully!");
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!transaction) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-100 h-screen text-black pt-24">
      <NavigationBar />
      <div className="bg-white w-full h-full flex justify-center items-center flex-col mx-6 p-6 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold mb-4">Virtual Account Payment</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="bank">
              Select Bank
            </label>
            <select
              name="bank"
              id="bank"
              value={formData.bank}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="BNI">BNI</option>
              <option value="BRI">BRI</option>
              <option value="Mandiri">Mandiri</option>
              <option value="BCA">BCA</option>
              <option value="CIMB">CIMB</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            {isSubmitting ? "Processing..." : "Submit Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckOutVirtualAccount;
