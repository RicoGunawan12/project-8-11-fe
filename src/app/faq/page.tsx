"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationBar from '../component/navbar';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
      question: 'What is the difference between a cup and a mug?',
      answer: 'A cup is typically smaller, lighter, and often has a saucer. Mugs are larger, have thicker walls, and are used for hot drinks like coffee or tea without a saucer.',
    },
    {
      question: 'What is the benefit of using a tumbler?',
      answer: 'Tumblers are great for maintaining the temperature of your drink for a long time. Insulated tumblers can keep beverages hot or cold for hours, making them perfect for travel or long commutes.',
    },
    {
      question: 'Are stainless steel tumblers safe to use?',
      answer: 'Yes, stainless steel tumblers are safe to use as they are typically made from food-grade stainless steel. They do not leach chemicals into drinks and are resistant to rust and staining.',
    },
    {
      question: 'What are the best materials for coffee mugs?',
      answer: 'The best materials for coffee mugs include ceramic, porcelain, and stainless steel. Ceramic and porcelain are popular for home use due to their heat retention and aesthetics, while stainless steel is durable and good for travel.',
    },
    {
      question: 'Can I put a ceramic mug in the microwave?',
      answer: 'Most ceramic mugs are microwave safe, but it is important to check for any metallic decorations or labels that might cause sparks. Always ensure the mug is marked as microwave safe.',
    },
    {
      question: 'How should I clean an insulated tumbler?',
      answer: 'To clean an insulated tumbler, hand-wash with warm soapy water and a bottle brush to reach the bottom. Avoid using a dishwasher unless the tumbler is specifically labeled as dishwasher safe.',
    },
    {
      question: 'What is the best way to prevent coffee stains in mugs?',
      answer: 'To prevent coffee stains, rinse the mug immediately after use and wash it with baking soda or a mild dish soap. Periodic deep cleaning with vinegar or a paste made of baking soda and water can also help remove any lingering stains.',
    },
    {
      question: 'Why do some tumblers come with lids and straws?',
      answer: 'Lids and straws help prevent spills and make it easier to drink on the go. Lids can also aid in maintaining the temperature of the beverage for a longer period.',
    },
    {
      question: 'Can tumblers be used for both hot and cold drinks?',
      answer: 'Yes, most insulated tumblers are designed for both hot and cold drinks. They help maintain the temperature of the beverage, keeping hot drinks warm and cold drinks cool for extended periods.',
    },
    {
      question: 'What is the ideal size for a coffee mug?',
      answer: 'The ideal size depends on your preference, but common sizes range from 8 to 12 ounces. Larger mugs (14-20 ounces) are preferred by those who enjoy bigger servings or specialty drinks like lattes and cappuccinos.',
    },
  ];
  

const FAQPage: React.FC = () => {
    return (
        <div className="w-screen bg-white">
            <NavigationBar/>
            <div className='p-6 mt-20'>
                <h1 className="text-3xl font-bold mb-6 text-black">Frequently Asked Questions</h1>
                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <FAQItem key={index} question={item.question} answer={item.answer} />
                    ))}
                </div>

            </div>
        </div>
    );
};

const FAQItem: React.FC<FAQItem> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b-2 pb-2">
            <button
                className="w-full text-left text-2xl font-semibold text-gray-800 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                {question}
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
                        <p className="text-gray-600">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FAQPage;
