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
        setData(resp.allFAQ);
      } catch (error: any) {
        toastError(error.message);
      }
    };

    getData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavigationBar />
      <div className="mt-20 flex-grow">
        <Banner page="FAQ Page" text="F.A.Q" />
        <div className="p-6 md:p-12 min-h-[27.5%] flex flex-col items-center">
          <div className="space-y-4 w-full md:w-2/3">
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
      </div>
      <Footer />
    </div>
  );
};

const FAQItem: React.FC<FAQ> = ({ faqId, faqQuestion, faqAnswer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b-2 pb-2">
      <button
        className="w-full text-left text-lg md:text-2xl font-semibold text-gray-800 focus:outline-none flex justify-between items-center"
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
            <div
              className="text-gray-600 font-light line-clamp-3 hover:line-clamp-none cursor-pointer"
              dangerouslySetInnerHTML={{ __html: faqAnswer }}
            ></div>
            {/* <p className="text-gray-600 font-light line-clamp-3 hover:line-clamp-none cursor-pointer">
              {faqAnswer}
            </p> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQPage;
