"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Contact } from "../model/contact";
import { toastError } from "../utilities/toast";

// Define the type for the component props, including className as an optional prop
interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const [contacts, setContacts] = useState<Contact[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartResponse = await fetch(`${process.env.CONTACTS}`, {
          method: "GET",
        });

        const resp = await cartResponse.json();
        setContacts(resp.contacts);
      } catch (error: any) {
        toastError(error.message || "An unexpected error occurred");
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`w-full bg-secondary text-white pt-12 ${className}`}>
      <div className="flex flex-col lg:flex-row w-full justify-between px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row w-full lg:w-3/4 gap-6 lg:gap-12 px-6">
          <div className="text-sm">
            <h1 className="mb-6 text-xl font-semibold">COMPANY</h1>
            <div className="flex flex-col gap-y-1">
              <Link href={"/about"} className="hover:text-primary">About</Link>
              <Link href={"/product"} className="hover:text-primary">Product</Link>
              <Link href={"/contact"} className="hover:text-primary">Contact</Link>
            </div>
          </div>
          <div className="text-sm">
            <h1 className="mb-6 text-xl font-semibold">SUPPORT</h1>
            <div className="flex flex-col gap-y-1">
              <Link href={"/faq"} className="hover:text-primary">FAQ</Link>
              <Link href={"/blog"} className="hover:text-primary">Blog</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-start w-full lg:w-1/4 mt-6 lg:mt-0">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-3xl font-semibold text-white">
              <Image src="/logo.png" width={100} height={100} alt="not found"/>
            </Link>
          </div>
          <div className="flex gap-4 mt-6 justify-center lg:justify-start">
            {/* Social Media Icons */}
            {contacts?.map((contact) => (
              <a
                key={contact.contactId}
                href={`${contact.contactAccount}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={`${process.env.BACK_BASE_URL}${contact.contactImage}`}
                  alt={`${contact.contact}`}
                  width={24}
                  height={24}
                  className="filter invert brightness-0"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-12 bg-secondary border-t-2 border-white py-4">
        <span className="text-white text-md">
          © TYESO, {new Date().getFullYear()}. All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default Footer;
