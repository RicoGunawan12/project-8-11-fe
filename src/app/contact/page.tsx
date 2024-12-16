"use client";
import React, { useState } from "react";
import NavigationBar from "../component/navbar";
import Banner from "../component/banner";
import Footer from "../component/footer";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("YOUR_API_ENDPOINT_HERE", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-screen h-screen bg-white">
      <NavigationBar />
      <div className="mt-20 h-full">
        <Banner title="Contact Us" imagePath="/banner.jpg" />

        <div className="p-12">
          <h1 className="text-5xl font-bold mb-6 text-black text-center">
            Contact Us
          </h1>
          <p className="mb-4 text-black">
            We’d love to hear from you! Whether you have questions, feedback, or
            just want to say hello, there are many ways to reach us.
          </p>

          <h2 className="text-black text-xl font-semibold mt-6 mb-4">
            Reach Us By:
          </h2>

          <ul className="mb-6 space-y-2">
            <li className="text-black">
              <strong>Phone:</strong> +62 812 8239 8242
            </li>
            <li className="text-black">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:tyeso@gmail.com"
                className="text-blue-500 hover:underline"
              >
                tyeso@gmail.com
              </a>
            </li>
            <li className="text-black">
              <strong>Address:</strong> Tyeso Road
            </li>
            <li className="text-black">
              <strong>Follow us on Social Media:</strong>
              <ul className="mt-2 space-y-1">
                <li>
                  <a
                    href="https://facebook.com"
                    className="text-blue-500 hover:underline"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    className="text-blue-500 hover:underline"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    className="text-blue-500 hover:underline"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </li>
          </ul>

          <h2 className="text-black text-xl font-semibold mt-6 mb-4">
            Send Us a Message:
          </h2>
          <p className="mb-4 text-black">
            Use the form below to send us a message directly.
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-black" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-black" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-black" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-black text-white py-2 px-4 rounded"
            >
              Send Message
            </button>
          </form>
        </div>
        <Footer/>
      </div>
    </div>
  );
};

export default ContactPage;
