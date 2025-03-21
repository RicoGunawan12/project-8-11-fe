"use client";
import { useState, useEffect } from "react";
import { Delivery, Transaction } from "@/app/model/transactions";
import { useParams, useRouter } from "next/navigation";
import { checkTokenCookieValid, getTokenCookie } from "@/app/utilities/token";
import NavigationBar from "@/app/component/navbar";
import Banner from "@/app/component/banner";
import Footer from "@/app/component/footer";
import { Loading } from "@/app/utilities/loading";
import { toastError, toastSuccess } from "@/app/utilities/toast";
import { formatCurrency, formatDate, mapPaymentMethod } from "@/app/utilities/converter";
import Image from "next/image";
import DeleteConfirmationModal from "@/app/component/modal/deleteConfirmation";
import { useLocaleStore } from "@/app/component/locale";
import Link from "next/link";
import { data } from "framer-motion/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBottleWater,
  faMoneyBill,
  faPercentage,
  faShippingFast,
} from "@fortawesome/free-solid-svg-icons";

const TransactionPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [voucher, setVoucher] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>();

  const [adminContact, setAdminContact] = useState<any>();
  const [gatewayResponse, setGatewayResponse] = useState<any>();

  // New state for modals
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [reason, setReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminAddress, setAdminAddress] = useState<any>();
  const { locale } = useLocaleStore();

  const [authenticated, setAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    const checkAuthenticated = async () => {
      await checkTokenCookieValid().then((value) => {
        setAuthenticated(value);
        if (!value) {
          router.push(`${process.env.LOGIN_ENDPOINT}`);
        }
      });
    };

    checkAuthenticated();
  }, []);

  useEffect(() => {
    async function getAdminContact() {
      try {
        const adminResponse = await fetch(`${process.env.CONTACTS}/admin`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const adminData = await adminResponse.json();

        if (!adminResponse.ok) {
          throw new Error(adminData.message);
        }
        setAdminContact(adminData.contact);
      } catch (error) {}
    }
    getAdminContact();
  }, []);

  const fetchData = async () => {
    const clientToken = getTokenCookie();
    if (!clientToken) {
      router.push("/auth/login");
    }

    try {
      setLoading(true);

      const adminAddress = await fetch(`${process.env.ADDRESS}/admin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clientToken}`,
        },
      });

      if (!adminAddress.ok) {
        throw new Error("Failed to fetch transaction data");
      }
      const data = await adminAddress.json();

      setAdminAddress(data.response[0]);
    } catch (error) {
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        setDelivery(data.delivery);
        const parsedData = JSON.parse(data.transaction.gatewayResponse);
        setGatewayResponse(parsedData);
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
        if (response.status === 401) {
          router.push("/auth/login");
        }
        throw new Error("Failed to cancel the transaction");
      }

      const data = await response.json();

      setTransaction((prevTransaction) =>
        prevTransaction ? { ...prevTransaction, status: "Canceled" } : null
      );
    } catch (err: any) {
      toastError(err.message || "Failed to cancel transaction");
    }
    setIsModalOpen(false);
  };

  const cancelWaitingForShipping = async () => {
    if (!reason.trim()) {
      toastError("Please provide a reason for cancellation");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.TRANSACTIONS}/on-review-cancel/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel the transaction");
      }

      const data = await response.json();
      setShowCancelModal(false);
      setReason("");
      toastSuccess("Cancellation request submitted successfully");

      setTransaction((prevTransaction) =>
        prevTransaction
          ? { ...prevTransaction, status: "Waiting for Admin Approval" }
          : null
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
      const response = await fetch(
        `${process.env.TRANSACTIONS}/on-review-return/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to return the transaction");
      }

      const data = await response.json();
      setShowReturnModal(false);
      setReason("");
      toastSuccess("Return request submitted successfully");

      setTransaction((prevTransaction) =>
        prevTransaction
          ? { ...prevTransaction, status: "Waiting for Admin Approval" }
          : null
      );
    } catch (err: any) {
      toastError(err.message || "Failed to return transaction");
    }
  };

  const sendInvoiceToEmail = async () => {
    try {
      const response = await fetch(
        `${process.env.TRANSACTIONS}/invoice/email/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to send transaction to your e-mail, please inquire this issue further to developer"
        );
      }

      const data = await response.json();
      toastSuccess("Invoice has been sent to your e-mail");
    } catch (err: any) {
      toastError(
        "Failed to send transaction to your e-mail, please inquire this issue further to developer"
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  return authenticated ? (
    <div className="w-screen h-auto min-h-screen bg-white">
      <NavigationBar />
      <div className="mt-20 min-h-screen">
        <Banner text="Transaction Details" page="Transaction Page" />
        <div className="text-black p-4 md:p-12">
          <div className="flex justify-center items-center flex-col gap-6">
            {/* Transaction Information Card */}
            <div className="p-4 md:p-6 border-2 w-full md:w-3/4 rounded-md shadow-2xl bg-gray-50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                <h2 className="text-xl md:text-2xl font-semibold text-black mb-4 md:mb-0">
                  Transactions Information
                </h2>
                {/* Action Buttons */}
                <div className="w-full md:w-auto">
                  {(() => {
                    switch (transaction?.status) {
                      case "Unpaid":
                        return (
                          <div className="flex flex-col md:flex-row gap-2">
                            <button
                              onClick={() =>
                                router.push(`${transaction.paymentLink}`)
                              }
                              className="w-full md:w-auto text-sm font-semibold bg-secondary p-2 flex justify-center text-white rounded-lg"
                            >
                              Pay Now
                            </button>
                            <button
                              onClick={() => setIsModalOpen(true)}
                              className="w-full md:w-auto text-sm font-semibold bg-red-500 p-2 flex justify-center text-white rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        );
                      case "Waiting for shipping":
                        return (
                          <button
                            className="w-full md:w-auto text-sm font-semibold bg-red-500 p-2 flex justify-center text-white rounded-lg"
                            onClick={() => setShowCancelModal(true)}
                            disabled={
                              (gatewayResponse?.payment_method === "EWALLET" &&
                                gatewayResponse?.payment_channel != "OVO" &&
                                gatewayResponse?.payment_channel !=
                                  "JENIUSPAY") ||
                              ["CREDIT_CARD", "DIRECT_DEBIT"].includes(
                                gatewayResponse?.payment_method
                              )
                                ? false
                                : true
                            }
                          >
                            {(gatewayResponse?.payment_method === "EWALLET" &&
                              gatewayResponse?.payment_channel != "OVO" &&
                              gatewayResponse?.payment_channel !=
                                "JENIUSPAY") ||
                            ["CREDIT_CARD", "DIRECT_DEBIT"].includes(
                              gatewayResponse?.payment_method
                            )
                              ? "Cancel Order"
                              : "Contact Customer Service to Cancel"}
                          </button>
                        );
                      case "Shipping":
                        return (
                          <button
                            className="w-full md:w-auto text-sm font-semibold bg-gray-500 p-2 flex justify-center text-white rounded-lg"
                            disabled={true}
                          >
                            Cancel Order
                          </button>
                        );
                      case "Done":
                        return (
                          <button
                            className="w-full md:w-auto text-sm font-semibold bg-green-500 p-2 flex justify-center text-white rounded-lg"
                            onClick={() => setShowReturnModal(true)}
                            disabled={
                              (gatewayResponse?.payment_method === "EWALLET" &&
                                gatewayResponse?.payment_channel != "OVO" &&
                                gatewayResponse?.payment_channel !=
                                  "JENIUSPAY") ||
                              ["CREDIT_CARD", "DIRECT_DEBIT"].includes(
                                gatewayResponse?.payment_method
                              )
                                ? false
                                : true
                            }
                          >
                            {(gatewayResponse?.payment_method === "EWALLET" &&
                              gatewayResponse?.payment_channel != "OVO" &&
                              gatewayResponse?.payment_channel !=
                                "JENIUSPAY") ||
                            ["CREDIT_CARD", "DIRECT_DEBIT"].includes(
                              gatewayResponse?.payment_method
                            )
                              ? "Return Order"
                              : "Contact Customer Service to Return"}
                          </button>
                        );
                      default:
                        return null;
                    }
                  })()}
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                <div>
                  <Link
                    href={`https://wa.me/${adminContact?.phone?.replace(
                      /\D/g,
                      ""
                    )}`}
                    target="_blank"
                    className="hover:underline flex gap-2 mb-4"
                  >
                    <Image
                      src={`/icons/wwa.png`}
                      alt="Acc Icon"
                      width={24}
                      height={24}
                      className="filter"
                    />
                    Need Help?
                  </Link>
                </div>
                <div>
                  {transaction?.status === "Unpaid" ? (
                    <></>
                  ) : (
                    <button
                      className="w-full md:w-auto text-sm font-semibold bg-green-500 p-2 flex justify-center text-white rounded-lg"
                      onClick={() => sendInvoiceToEmail()}
                    >
                      Send Invoice to E-mail
                    </button>
                  )}
                </div>
              </div>

              <div className="hidden md:block mb-2">
                <div className="flex gap-2 mb-2">
                  <div className="font-semibold">Transaction ID:</div>
                  <div>{transaction?.readableId}</div>
                </div>
                <div className="flex gap-2 mb-2">
                  <div className="font-semibold">Shipping ID:</div>
                  <div>{transaction?.awb ? transaction?.awb : "-"}</div>
                </div>
              </div>

              {/* Transaction Info Table */}
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-1 md:hidden gap-4">
                    {/* Mobile view - card style */}
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-semibold">Date:</div>
                        <div>
                          {formatDate(transaction?.transactionDate || "")}
                        </div>
                        <div className="font-semibold">Transaction ID:</div>
                        <div>{transaction?.readableId}</div>
                        <div className="font-semibold">Shipping ID:</div>
                        <div>{transaction?.awb ? transaction?.awb : "-"}</div>
                        <div className="font-semibold">Total Price:</div>
                        <div>{formatCurrency(transaction?.totalPrice ?? 0)}</div>
                        <div className="font-semibold">Status:</div>
                        <div>{transaction?.status}</div>
                        <div className="font-semibold">Shipping:</div>
                        <div>
                          {transaction?.expedition} -{" "}
                          {transaction?.shippingType}
                        </div>
                        <div className="font-semibold">Payment:</div>
                        <div>
                          {mapPaymentMethod(transaction?.paymentMethod || "")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop view - table style */}
                  <table className="hidden md:table w-full text-left border border-gray-300">
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
                          {formatDate(transaction?.transactionDate || "")}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {formatCurrency(transaction?.totalPrice ?? 0)}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {transaction?.status}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {transaction?.expedition} -{" "}
                          {transaction?.shippingType}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {mapPaymentMethod(transaction?.paymentMethod || "")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {transaction?.status === "Waiting for Return" && (
                <div className="my-4">
                  <div className="mb-2">Please return the product to</div>
                  <div>
                    Receiver: {adminAddress?.senderName} (
                    {adminAddress?.senderPhoneNumber})
                  </div>
                  <div>{adminAddress?.komshipLabel}</div>
                  <div>{adminAddress?.addressDetail}</div>
                </div>
              )}
            </div>

            {/* Transaction Details Card */}
            <div className="p-4 md:p-6 border-2 w-full md:w-3/4 rounded-md shadow-2xl bg-gray-50">
              <h2 className="text-xl md:text-2xl font-semibold text-black mb-4">
                Transaction Details
              </h2>
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Mobile view - card style */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {transaction?.transaction_details.map((detail) => (
                      <div
                        key={detail.transactionDetailId}
                        className="bg-white p-4 rounded-lg shadow"
                      >
                        <div className="flex flex-col items-center mb-4">
                          <Image
                            src={`${
                              process.env.BACK_BASE_URL
                            }/assets/product/${detail.product_variant.product.productName.replace(
                              /\//g,
                              ""
                            )}/${detail.product_variant.productImage}`}
                            alt="Product"
                            className="w-[150px] h-full object-fill"
                            width={200}
                            height={200}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-semibold">Product Name:</div>
                          <div>
                            {detail.product_variant.product.productName} -{" "}
                            {detail.product_variant.productColor}
                          </div>
                          <div className="font-semibold">Quantity:</div>
                          <div>{detail.quantity}</div>
                          <div className="font-semibold">Price:</div>
                          <div>{formatCurrency(detail.paidProductPrice)}</div>
                          <div className="font-semibold">Total:</div>
                          <div>
                            {formatCurrency(detail.paidProductPrice * detail.quantity)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop view - table style */}
                  <div className="hidden md:block w-full text-left border ">
                    <div className="bg-white grid grid-cols-4 gap-6 py-2 px-4 items-center border-b justify-evenly hover:bg-gray-100">
                      <div className="flex items-center justify-center">
                        Product Image
                      </div>
                      <div className="flex items-center justify-center">
                        Product Name
                      </div>
                      <div className="flex items-center justify-center">
                        Quantity
                      </div>
                      <div className="flex items-center justify-center">
                        Total
                      </div>
                    </div>
                    {transaction?.transaction_details.map((detail) => (
                      <div
                        key={detail.transactionDetailId}
                        className="bg-white grid grid-cols-4 gap-4 py-2 px-4 items-center border-b justify-evenly hover:bg-gray-100"
                      >
                        <div className="flex items-center justify-center">
                          <Image
                            src={`${
                              process.env.BACK_BASE_URL
                            }/assets/product/${detail.product_variant.product.productName.replace(
                              /\//g,
                              ""
                            )}/${detail.product_variant.productImage}`}
                            alt="Product"
                            className="w-[150px] h-full object-fill"
                            width={200}
                            height={200}
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          {detail.product_variant.product.productName} -{" "}
                          {detail.product_variant.productColor}
                        </div>
                        <div className="flex items-center justify-center">
                          {detail.quantity} x {formatCurrency(detail.paidProductPrice)}
                        </div>
                        <div className="flex items-center justify-center">
                          {formatCurrency(detail.paidProductPrice * detail.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-end">
                <div className="w-1/2 flex flex-col bg-white border-l-2 border-r-2 border-b-2 p-6">
                <div className="flex justify-between w-full">
                  <div className="font-semibold text-lg text-gray-700 w-1/2">
                    Subtotal ({transaction?.transaction_details.length} items) 
                  </div>
                  <div className="text-lg text-gray-800 w-1/3 flex justify-end">
                    {formatCurrency(transaction?.transaction_details.reduce((acc, detail) => {
                      return acc + detail.paidProductPrice * detail.quantity;
                    }, 0) ?? 0)}
                  </div>
                </div>

                {/* Apply Discounts */}
                <div className="py-2 w-full">
                  {transaction?.voucherCode?.length ? (
                    <div className="flex w-full flex-col">
                      {transaction.voucherCode
                        .filter(Boolean)
                        .map((voucher, index) => (
                          <div
                            key={index}
                            className="relative flex justify-between w-full  py-2"
                          >
                            <div className="text-sm text-gray-700 w-1/3">
                              {voucher.voucherName}
                            </div>

                            {/* Show Discount */}
                            {voucher.voucherType == "fixed" && (
                              <div className=" text-gray-600 w-1/3 flex justify-end text-sm">
                                - {formatCurrency(voucher.discount)}
                              </div>
                            )}
                            
                            {voucher.voucherType === "percentage" && (
                              <>
                                {/* Calculate subtotal for the percentage discount */}
                                {(() => {
                                  const subtotal = transaction?.transaction_details.reduce(
                                    (acc, detail) => acc + detail.paidProductPrice * detail.quantity,
                                    0
                                  );
                                  const discountAmount = Math.min((voucher.discount * subtotal) / 100, voucher.maxDiscount)

                                  return (
                                    <div className="text-gray-600 w-1/3 flex justify-end text-sm">
                                      - {formatCurrency(discountAmount)}
                                    </div>
                                  );
                                })()}
                              </>
                            )}
                            {voucher.productVariant && (
                              <div className="mt-4 sm:mt-0 sm:text-sm text-gray-500 w-1/3">
                                Free product:{" "}
                                {voucher.productVariant.product.productName} -{" "}
                                {voucher.productVariant.productColor}
                              </div>
                            )}
                            {voucher.productVariant && (
                              <div className="mt-4 sm:mt-0 sm:text-sm text-gray-500 w-1/3 flex justify-end">
                                - {formatCurrency(parseInt(voucher.productVariant.productPrice))}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                {/* Total After Discount */}
                <div className="flex justify-between w-full">
                  <div className="font-semibold text-lg text-gray-700">
                    Grand Total
                  </div>

                  {/* Calculate Total After Discount */}
                  <div className="text-lg text-gray-800">
                    {(() => {
                      let subtotal = transaction?.transaction_details.reduce(
                        (acc, detail) =>
                          acc + detail.paidProductPrice * detail.quantity,
                        0
                      );

                      let totalDiscount = 0;

                      // Loop through voucher codes and apply any discounts
                      transaction?.voucherCode?.forEach((voucher) => {
                        if (voucher?.voucherType === "percentage") {
                          // Percentage discount based on subtotal
                          totalDiscount += Math.min(((subtotal || 0) * voucher.discount) / 100, voucher.maxDiscount)
                        } else if (voucher?.voucherType === "fixed") {
                          // Fixed discount
                          totalDiscount += voucher.discount;
                        } else if (voucher?.voucherType === "ongkir") {
                          // Free shipping (remove the shipping cost, if any)
                          totalDiscount += voucher.discount;
                        } else if(voucher?.voucherType === "product"){
                          totalDiscount += parseInt(voucher.productVariant.productPrice)
                        }
                      });

                      const totalAfterDiscount = (subtotal || 0) - totalDiscount;
                      return formatCurrency(Math.max(parseInt(totalAfterDiscount.toFixed(0)), 0)); // round to nearest whole number
                    })()}
                  </div>
                </div>
                </div>
              </div>
            </div>

            <div className="w-full min-h-[250px] rounded-md border-2 bg-gray-50 p-4 shadow-2xl md:w-3/4 md:p-6">
              <h2 className="mb-4 text-xl font-semibold text-black md:text-2xl">
                Track Delivery
              </h2>

              {delivery ? (
                <div className="flex w-full flex-col items-center justify-center">
                  <div className="w-3/4 sm:w-1/2 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-2 top-0 h-full w-0.5 bg-gray-400"></div>

                    {delivery?.history.map((track, index) => (
                      <div
                        key={index}
                        className="relative flex w-full space-x-4 py-4"
                      >
                        {/* Bullet Point */}
                        <div className="absolute left-0 top-5 h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>

                        {/* Tracking Details */}
                        <div className="ml-6">
                          <div className="text-l font-semibold text-gray-700">
                            {track.date}
                          </div>
                          <div className="text-l font-bold text-black">
                            {track.status}
                          </div>
                          <div className="text-l text-gray-600">
                            {track.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center mt-6 h-full flex items-center">
                  Waiting for pick up
                </div>
              )}
            </div>
          </div>
        </div>

        <DeleteConfirmationModal
          header="Cancel Order"
          description="Are you sure you want to cancel your order?"
          onDelete={cancelTransaction}
          isVisible={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
        />
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
  ) : (
    <></>
  );
};

export default TransactionPage;
