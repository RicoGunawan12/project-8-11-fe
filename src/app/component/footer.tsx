"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Contact } from "../model/contact";
import { toastError } from "../utilities/toast";
import { useLocaleStore } from "./locale";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const [contacts, setContacts] = useState<Contact[]>();
  const { locale } = useLocaleStore()

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

  const content = {
    company: {
      en: "Company",
      id: "Perusahaan"
    },
    aboutUs: {
      en: "About us",
      id: "Tentang kami"
    },
    product: {
      en: "Product",
      id: "Produk"
    },
    contact: {
      en: "Contact",
      id: "Kontak"
    },
    support: {
      en: "SUPPORT",
      id: "DUKUNGAN"
    },
    faq: {
      en: "FAQ",
      id: "FAQ"
    },
    blog: {
      en: "Blog",
      id: "Blog"
    },
    location: {
      en: "Location",
      id: "Lokasi"
    },
    rights: {
      en: "All rights reserved",
      id: "Hak cipta dilindungi"
    }
  };

  return (
    <div className={`w-full bg-secondary text-white pt-12 ${className}`}>
      <div className="flex flex-col lg:flex-row w-full justify-between px-6 lg:px-12">
        <div className="mb-12 w-1/4">
          <Link href="/" className="text-3xl font-semibold text-white">
            <Image src="/logo.png" width={100} height={100} alt="not found" />
          </Link>
        </div>
        <div className="flex-grow flex-row columns-2 w-2/4 mb-12 max-w-lg:w-full">
          <div className="text-sm max-w-lg:flex-1">
            <h1 className="mb-6 text-xl font-semibold">
              {locale === "contentJSONEng" ? content.company.en : content.company.id}
            </h1>
            <div className="flex flex-col gap-y-6">
              <Link href={"/about"} className="hover:text-primary">
                {locale === "contentJSONEng" ? content.aboutUs.en : content.aboutUs.id}
              </Link>
              <Link href={"/product"} className="hover:text-primary">
                {locale === "contentJSONEng" ? content.product.en : content.product.id}
              </Link>
              <Link href={"/contact"} className="hover:text-primary">
                {locale === "contentJSONEng" ? content.contact.en : content.contact.id}
              </Link>
            </div>
          </div>
          <div className="text-sm  max-w-lg:flex-1">
            <h1 className="mb-6 text-xl font-semibold">
              {locale === "contentJSONEng" ? content.support.en : content.support.id}
            </h1>
            <div className="flex flex-col gap-y-6">
              <Link href={"/faq"} className="hover:text-primary">
                {locale === "contentJSONEng" ? content.faq.en : content.faq.id}
              </Link>
              <Link href={"/blog"} className="hover:text-primary">
                {locale === "contentJSONEng" ? content.blog.en : content.blog.id}
              </Link>
              <Link href={"/location"} className="hover:text-primary">
                {locale === "contentJSONEng" ? content.location.en : content.location.id}
              </Link>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-start lg:justify-start lg:w-1/4">
          {contacts?.map((contact) => (
            <Link
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
            </Link>
          ))}
        </div>

      </div>

      <div className="flex flex-col items-center justify-center mt-12 bg-secondary border-t-2 border-white py-4">
        <span className="text-white text-md">
          © TYESO, {new Date().getFullYear()}. {locale === "contentJSONEng" ? content.rights.en : content.rights.id}.
        </span>
      </div>
    </div >
  );
};

export default Footer;