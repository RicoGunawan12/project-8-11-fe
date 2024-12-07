"use client";
import NavigationBar from "@/app/component/navbar";
import Loading from "@/app/utilities/loading";
import { toastError, toastSuccess } from "@/app/utilities/toast";
import { getTokenCookie } from "@/app/utilities/token";
import { useParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import React, { useEffect, useState } from "react";

const CheckOutQRIS = () => {
  const router = useParams();
  const id = router.id;
  const [qr, setQR] = useState<string | null>(null);
  const clientToken = getTokenCookie();

  useEffect(() => {
    const fetchData = async () => {
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
        console.log(resp);

        const qrResponse = await fetch(
          `${process.env.TRANSACTIONS}/checkout-qris`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${clientToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              transactionId: resp.transactionId,
              amount: resp.totalPrice,
            }),
          }
        );
        const qrResult = await qrResponse.json();

        console.log(qrResult);
        setQR(
          qrResult.response.paymentMethod.qrCode.channelProperties.qrString
        );

        toastSuccess("QR code generated successfully.");
      } catch (error: any) {
        toastError(error.message);
      }
    };

    fetchData();
  }, []);

  if (!qr) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-100 h-screen text-black pt-24">
      <NavigationBar />
      <div className="bg-white w-full h-full flex justify-center items-center flex-col mx-6 p-6 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold mb-4">
          Scan QR Code to Complete Payment
        </h1>
        <div className="p-4">
          <QRCodeCanvas value={qr} size={500}/>
        </div>
        <p className="mt-4 text-gray-700">
          Please use a QRIS-compatible app to scan.
        </p>
      </div>
    </div>
  );
};

export default CheckOutQRIS;
