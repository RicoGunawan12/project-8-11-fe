"use client"
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationBar from '../component/navbar';
import { FAQ } from '../model/faq';
import { toastError, toastSuccess } from '../utilities/toast';

const FAQPage: React.FC = () => {

  const [data, setData] = useState<FAQ[]>()

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

          console.log(resp)
          setData(resp.allFAQ);

          toastSuccess(resp.message);
      } catch (error: any) {
          toastError(error.message);
      }
  };

  getData();
  }, [])


  return (
    <div className="w-screen bg-white">
      <NavigationBar />
      <div className='p-6 mt-20'>
        <h1 className="text-3xl font-bold mb-6 text-black">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {data?.map((item, index) => (
            <FAQItem key={index} faqId={item.faqId} faqQuestion={item.faqQuestion} faqAnswer={item.faqAnswer} />
          ))}
        </div>

      </div>
    </div>
  );
};

const FAQItem: React.FC<FAQ> = ({ faqId ,faqQuestion, faqAnswer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b-2 pb-2">
      <button
        className="w-full text-left text-2xl font-semibold text-gray-800 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {faqQuestion}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-2"
          >
            <p className="text-gray-600">{faqAnswer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQPage;
