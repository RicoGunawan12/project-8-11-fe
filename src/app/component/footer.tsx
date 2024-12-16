"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Contact } from "../model/contact";
import { toastError, toastSuccess } from "../utilities/toast";

const Footer = () => {
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
    <div className="w-screen h-auto bg-secondary text-white mt-12 pt-12">
      <div className="flex w-full justify-around px-12">
        <div className="flex w-3/4 gap-12 px-6">
          <div className="text-sm">
            <h1 className="mb-6 text-xl font-bold">COMPANY</h1>
            <div className="flex flex-col gap-y-1">
              <Link href={"/about"}>About</Link>
              <Link href={"/product"}>Product</Link>
              <Link href={"/contact"}>Contact</Link>
            </div>
          </div>
          <div>
            <h1 className="mb-6 text-xl font-bold">SUPPORT</h1>
            <div className="flex flex-col gap-y-1">
              <Link href={"/faq"}>FAQ</Link>
              <Link href={"/blog"}>Blog</Link>
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-3xl font-bold text-white">
              TYESO
            </Link>
          </div>
          <div className="flex gap-4 mt-6">
            {/* Social Media Icons */}
            {contacts?.map((contact, idx) => {
              return (
                <a
                  key={contact.contactId}
                  href={`${contact.contactAccount}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=""
                >
                  <Image
                    src={`${process.env.BACK_BASE_URL}/assets/contact/${contact.contact}.png`}
                    alt={`${contact.contact}`}
                    width={24}
                    height={24}
                    className="filter grayscale brightness-150"
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-12 bg-secondary border-t-2 border-white">
        <span className="text-white text-md flex align-middle my-4">
          © TYESO, 2025. All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default Footer;
