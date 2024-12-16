"use client";
import NavigationBar from "@/app/component/navbar";
import Loading from "@/app/utilities/loading";
import { toastError, toastSuccess } from "@/app/utilities/toast";
import { getTokenCookie } from "@/app/utilities/token";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CheckOutCreditCard = () => {
  const router = useRouter()
  const param = useParams();
  const id = param.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transaction, setTransaction] = useState<any>(null);
  const clientToken = getTokenCookie();

  const [formData, setFormData] = useState({
    card_number: "",
    card_exp_month: "",
    card_exp_year: "",
    card_cvn: "",
    card_holder_email: "",
    card_holder_first_name: "",
    card_holder_last_name: "",
    card_holder_phone_number: "",
    is_multiple_use: "TRUE",
    should_authenticate: "FALSE",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.TRANSACTIONS}/checkout-credit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${clientToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          transactionId: transaction.transactionId,
          amount: transaction.totalPrice,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to process payment.");
      }
      console.log(result)
      window.location.href = result.response.actions[0].url;
      toastSuccess("Payment successful!");
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
        <h1 className="text-2xl font-bold mb-4">Credit Card Payment</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="card_number">
              Card Number
            </label>
            <input
              type="text"
              name="card_number"
              id="card_number"
              value={formData.card_number}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div className="flex space-x-4 mb-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="card_exp_month">
                Exp Month
              </label>
              <input
                type="text"
                name="card_exp_month"
                id="card_exp_month"
                value={formData.card_exp_month}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="card_exp_year">
                Exp Year
              </label>
              <input
                type="text"
                name="card_exp_year"
                id="card_exp_year"
                value={formData.card_exp_year}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="card_cvn">
              CVN
            </label>
            <input
              type="text"
              name="card_cvn"
              id="card_cvn"
              value={formData.card_cvn}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="card_holder_email">
              Email
            </label>
            <input
              type="email"
              name="card_holder_email"
              id="card_holder_email"
              value={formData.card_holder_email}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div className="flex space-x-4 mb-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="card_holder_first_name">
                First Name
              </label>
              <input
                type="text"
                name="card_holder_first_name"
                id="card_holder_first_name"
                value={formData.card_holder_first_name}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="card_holder_last_name">
                Last Name
              </label>
              <input
                type="text"
                name="card_holder_last_name"
                id="card_holder_last_name"
                value={formData.card_holder_last_name}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="card_holder_phone_number">
              Phone Number
            </label>
            <input
              type="text"
              name="card_holder_phone_number"
              id="card_holder_phone_number"
              value={formData.card_holder_phone_number}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
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

export default CheckOutCreditCard;
