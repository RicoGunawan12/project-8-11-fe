"use client"
import React, { ChangeEvent, FormEvent, useState } from "react";
import NavigationBar from "../component/navbar";
import Banner from "../component/banner";
import Footer from "../component/footer";
import Image from "next/image";
import { toastError, toastSuccess } from "../utilities/toast";
import { Contact } from "../model/contact";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "../model/error";

const ContactPage: React.FC = () => {
  const [errors, setErrors] = useState<Array<ErrorMessage>>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    topic: "",
    orderNumber: "",
    customTopic: ""
  });

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const router = useRouter();
  const [socMed, setSocMed] = useState<Contact[]>([]);
  const [isLoad, setIsLoad] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.CONTACTS}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setSocMed(data.contacts);
        if (!Array.isArray(data)) throw new Error("Data is not an array");
      } catch (error: any) {
        toastError(error);
      } finally {
        setIsLoad(false);
      }
    };

    fetchData();
  }, [isLoad]);

  const handleSubmit = async () => {
    const toSend = {
      name: formData.name,
      topic: formData.topic === "Other" ? formData.customTopic : formData.topic,
      email: formData.email,
      orderNumber: formData.orderNumber === "" ? null : formData.orderNumber,
      message: formData.message,
    };

    try {
      const response = await fetch(`${process.env.EMAILS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toSend),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors);
      } else {
        toastSuccess(data.message);
        router.refresh();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoad) return <div></div>;
  else {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <NavigationBar />
        <div className="flex-grow mt-20">
          <Banner page="Contact Page" text="Contact Us" />
          <form className="flex flex-col">
            <div className="flex flex-col lg:flex-row flex-1 p-6 lg:p-24 gap-8 lg:gap-0">
              {/* Social Media Section */}
              <div className="w-full lg:w-1/3 bg-secondary text-white px-6 lg:px-12 py-8 flex items-start rounded-lg">
                <div>
                  <h1 className="text-2xl font-bold mb-6">Social Media</h1>
                  <ul className="space-y-6">
                    {!isLoad &&
                      socMed &&
                      socMed.map((src, index) => (
                        <li key={index} className="flex flex-row items-center space-x-3">
                          <Image
                            src={`${process.env.BACK_BASE_URL}/assets/contact/${src.contact}.png`}
                            alt="Acc Icon"
                            width={24}
                            height={24}
                            className="filter invert hover:invert-0"
                          />
                          <Link href={src.contactAccount} target="_blank" className="hover:underline">
                            {src.contact}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* Form Section */}
              <div className="w-full lg:w-2/3 bg-white text-black px-6 lg:px-12 py-8 flex flex-col items-start rounded-lg">
                <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
                <p className="text-gray-500 mb-8">
                  {"We're here for you. Search our FAQs or get in touch with our customer team."}
                </p>
                <form className="space-y-4 w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder="Name"
                        onChange={handleChange}
                        className={`border p-3 rounded-md w-full ${errors?.find(e => e.path === "name") ? "border-red-300" : "border-gray-300"
                          }`}
                      />
                      <p className="text-red-500 mt-2 text-sm">{errors?.find(e => e.path === "name")?.msg}</p>
                    </div>
                    <div className="flex flex-col">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className={`border p-3 rounded-md w-full ${errors?.find(e => e.path === "email") ? "border-red-300" : "border-gray-300"
                          }`}
                      />
                      <p className="text-red-500 mt-2 text-sm">{errors?.find(e => e.path === "email")?.msg}</p>
                    </div>
                  </div>
                  <select
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2"
                  >
                    <option value="" disabled>Select A Topic</option>
                    <option value="Cancel Order">Cancel Order</option>
                    <option value="Modify Order">Modify Order</option>
                    <option value="Tracking Order">Tracking Order</option>
                    <option value="Return Or Exchange Items">Return Or Exchange Items</option>
                    <option value="Become a Reseller">Become a Reseller</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    name="customTopic"
                    placeholder="Custom Topic"
                    value={formData.customTopic}
                    onChange={handleChange}
                    className="border p-3 rounded-md w-full"
                    hidden={formData.topic !== "Other"}
                  />
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    className="border p-3 rounded-md w-full"
                  ></textarea>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-secondary text-white py-3 px-6 mt-5 rounded-md shadow-md hover:bg-white hover:text-secondary border border-secondary w-full"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    );
  }
};

export default ContactPage;
