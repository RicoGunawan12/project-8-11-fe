"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavigationBar from "../component/navbar";
import { FAQ } from "../model/faq";
import { toastError, toastSuccess } from "../utilities/toast";
import Banner from "../component/banner";
import Footer from "../component/footer";

const FAQPage: React.FC = () => {
  const [data, setData] = useState<FAQ[]>();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${process.env.FAQ}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resp = await response.json();
        if (!response.ok) {
          throw new Error(resp.message);
        }

        console.log(resp);
        setData(resp.allFAQ);

        toastSuccess(resp.message);
      } catch (error: any) {
        toastError(error.message);
      }
    };

    getData();
  }, []);

  return (
    <div className="w-screen h-screen bg-white">
      <NavigationBar />
      <div className="mt-20 h-full">
        <Banner title="Frequently Asked Questions" imagePath="/a.jpg" />
        <div className="my-20 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6 text-black">
            Frequently Asked Questions
          </h1>
          <div className="space-y-4 w-1/2">
            {data?.map((item, index) => (
              <FAQItem
                key={index}
                faqId={item.faqId}
                faqQuestion={item.faqQuestion}
                faqAnswer={item.faqAnswer}
              />
            ))}
          </div>
        </div>
        <Footer/>
      </div>
    </div>
  );
};

const FAQItem: React.FC<FAQ> = ({ faqId, faqQuestion, faqAnswer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b-2 pb-2">
      <button
        className="w-full text-left text-2xl font-semibold text-gray-800 focus:outline-none flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {faqQuestion}
        <span className="text-xl">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-2"
          >
            <p className="text-gray-600 font-light">{faqAnswer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQPage;
