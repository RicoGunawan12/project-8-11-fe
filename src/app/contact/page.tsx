"use client";
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


  const router = useRouter()
  const [socMed, setSocMed] = useState<Contact[]>([
  ])
  const [isLoad, setIsLoad] = useState(true)
  React.useEffect(() => {

    const FetchData = async () => {

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
        if (!Array.isArray(data)) throw new Error('Data is not an array');
      } catch (error: any) {
        toastError(error);
      } finally {
        setIsLoad(false);
      }
    };

    FetchData();

  }, [isLoad])

  const handleSubmit = async () => {

    const toSend = {
      name: formData.name,
      topic: formData.topic === 'Other' ? formData.customTopic : formData.topic,
      email: formData.email,
      orderNumber: formData.orderNumber === '' ? null : formData.orderNumber,
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
        setErrors(data.errors)
        console.log(errors)
      } else {
        toastSuccess(data.message)
        router.refresh()
      }
      const result = await response.json()

    } catch (error) {
      console.error("Error:", error);
    }
  };


  if (isLoad) return <div></div>
  else {
    return (
      <div className="w-screen h-screen bg-white">
        <Banner page="Contact Page" text="Contact Us" />
        <form className="flex flex-col min-h-screen">
          {/* Navbar */}
          <NavigationBar />

            {/* Main Content */}
            <div className="flex flex-1 p-24 mt-20">
              {/* Left Section */}
              <div className="hidden w-full md:w-1/3 bg-secondary text-white px-24 md:flex items-center justify-start rounded rounded-tl-2xl rounded-bl-2xl">
                <div>
                  <h1 className="text-3xl font-bold mb-6">Social Media</h1>
                  <ul className="space-y-6">
                    {/* <li className="flex flex-row my-5">
                    <Image
                      src="/icons/location.svg"
                      alt="Location Icon"
                      width={24}
                      height={24}
                      className="filter invert hover:invert-0 mr-3"
                    />
                    <label>Unit 1002, 10/F Perfect
                      CommBLDG 20 Austin Avenue
                      TST Hong Kong</label>
                  </li> */}
                  {!isLoad && socMed && socMed.map((src, index) => (
                    <li key={index} className="flex flex-row my-5">
                      <Image
                        src={`${process.env.BACK_BASE_URL}/assets/contact/${src.contact}.png`}
                        alt="Acc Icon"
                        width={24}
                        height={24}
                        className="filter invert hover:invert-0 mr-3"
                      />
                      {/* <label>{src.contactAccount}</label> */}
                      <Link href={src.contactAccount} target="_blank" className="hover:underline">{src.contact}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-2/3 bg-white px-32 text-black flex items-center justify-center rounded rounded-tr-2xl rounded-br-2xl">
              <form className="space-y-4 w-full justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Need Help ?</h2>
                  <p className="text-gray-500 mb-8">{"We're here for you. Search our FAQs or get in touch with our customer team."}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      placeholder="Name"
                      onChange={handleChange}
                      className={`border border-gray-300 p-3 rounded-md w-full ${errors?.find(e => e.path == 'name') ? "border-red-300" : "border-gray-300"}`}
                    />
                    <p className="text-red-500 mt-2  text-sm text-left">{errors?.find((e) => e.path === 'name')?.msg}</p>
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className={`border border-gray-300 p-3 rounded-md w-full ${errors?.find(e => e.path == 'email') ? "border-red-300" : "border-gray-300"}`}
                    />
                    <p className="text-red-500 mt-2  text-sm text-left">{errors?.find((e) => e.path === 'email')?.msg}</p>
                  </div>
                </div>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 text-black ${errors?.find(e => e.path == 'topic' && formData.topic!== 'Other') ? "border-red-300" : "border-gray-300"}`}
                >
                  <option className="text-black" value="" disabled>Select A Topic</option>
                  <option className="text-black" value="Cancel Order">Cancel Order</option>
                  <option className="text-black" value="Modify Order">Modify Order</option>
                  <option className="text-black" value="Tracking Order">Tracking Order</option>
                  <option className="text-black" value="Return Or Exchange Items">Return Or Exchange Items</option>
                  <option className="text-black" value="Become a Reseller">Become a Reseller</option>
                  <option className="text-black" value="Partnership">Partnership</option>
                  <option className="text-black" value="Other">Other</option>
                </select>
                <p
                  hidden={!errors?.find(e => e.path === 'topic' && formData.topic !== 'Other')}
                  className="text-red-500 !mt-2 text-sm text-left" 
                >
                  {errors?.find((e) => e.path === 'topic')?.msg}
                </p>

                <input
                  type="text"
                  name="customTopic"
                  placeholder="Topic"
                  value={formData.customTopic}
                  onChange={handleChange}
                  className={`border border-gray-300 p-3 rounded-md w-full ${errors?.find(e => e.path == 'topic' ) ? "border-red-300" : "border-gray-300"}`}
                  hidden={formData.topic !== 'Other'}
                />
                <p
                  hidden={!errors?.find(e => e.path === 'topic' && formData.topic == 'Other')}
                  className="text-red-500 !mt-2 text-sm text-left"
                >
                  {errors?.find((e) => e.path === 'topic')?.msg}
                </p>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  placeholder="Order Number (optional)"
                  className="border border-gray-300 p-3 rounded-md w-full"
                />
                <textarea
                  placeholder="Message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange
                  }
                  className={`border border-gray-300 p-3 rounded-md w-full ${errors?.find(e => e.path == 'topic' ) ? "border-red-300" : "border-gray-300"}`}
                ></textarea>
                <p
                  hidden={!errors?.find(e => e.path === 'message' )}
                  className="text-red-500 !mt-1 text-sm text-left"
                >
                  {errors?.find((e) => e.path === 'message' )?.msg}
                </p>
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
        <Footer />
      </div>
    );
  }
};

export default ContactPage;
