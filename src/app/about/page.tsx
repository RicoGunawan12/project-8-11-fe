"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import NavigationBar from "../component/navbar";
import Footer from "../component/footer";
import Banner from "../component/banner";
import { toastError } from "../utilities/toast";
import { useLocaleStore } from "../component/locale";
import { AboutPage, WhyPage } from "../model/aboutPage";
import { Loading } from "../utilities/loading";

const AboutUsPage = () => {
  const [page, setPage] = useState<AboutPage[] | null>(null);
  const [about, setAbout] = useState<WhyPage | null>(null); // Initialize as null
  const { locale } = useLocaleStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.PAGES}/about`, {
          method: "GET",
        });
        const result = await response.json();
        setPage(result.response);

        const aboutResponse = await fetch(`${process.env.PAGES}/about/why`, {
          method: "GET",
        });
        const aboutResult = await aboutResponse.json();
        setAbout(aboutResult.response[0] || null);
      } catch (error: any) {
        toastError(error.message || "An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);

  if (!page) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <NavigationBar />
      <div className="mt-20 flex-grow">
        <Banner page="About Page" text="About Us" />
        <div className="text-black flex flex-col p-6 items-center tracking-widest leading-[2]">
          <h1 className="font-bold text-2xl mt-12">
          {locale === "contentJSONEng" ? page[0].titleEng : page[0].titleIndo}
          </h1>
          <h2 className="mt-12 font-semibold text-lg w-3/5 max-sm:w-full max-md:w-4/5">
            {locale === "contentJSONEng"
              ? page[0]?.whyEng || "Loading"
              : page[0]?.whyIndo || "Loading"}
          </h2>
          <div
            className="mt-6 w-3/5 max-sm:w-full max-sm:text-justify max-md:w-4/5"
            dangerouslySetInnerHTML={{
              __html:
                locale === "contentJSONEng"
                  ? page[0]?.contentEng || "Loading"
                  : page[0]?.contentIndo || "Loading",
            }}
          ></div>
          <div className="w-full flex items-center flex-col text-black bg-white mt-6 py-8">
            <h1 className="text-2xl font-semibold text-black">
              {locale === "contentJSONEng" ? page[0].whyEng : page[0].whyIndo}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center gap-12 my-6 px-6 text-black">
              {about &&
                (locale === "contentJSONEng"
                  ? about.whyContentJSONEng.map((content, idx) => (
                      <div
                        className="flex flex-col items-center max-w-xs"
                        key={idx}
                      >
                        <Image
                          src={
                            content.photo
                              ? process.env.BACK_BASE_URL + content.photo
                              : "/placeholder.webp"
                          }
                          alt={"Image"}
                          width={128}
                          height={128}
                          className="object-cover aspect-square rounded-lg shadow-md"
                        />
                        <p className="mt-4 text-center text-xs font-light">
                          {content.content || "No description available."}
                        </p>
                      </div>
                    ))
                  : about.whyContentJSONIndo.map((content, idx) => (
                      <div
                        className="flex flex-col items-center max-w-xs"
                        key={idx}
                      >
                        <Image
                          src={
                            content.photo
                              ? process.env.BACK_BASE_URL + content.photo
                              : "/placeholder.webp"
                          }
                          alt={"Image"}
                          width={128}
                          height={128}
                          className="object-cover aspect-square rounded-lg shadow-md"
                        />
                        <p className="mt-4 text-center text-xs font-light">
                          {content.content || "Tidak ada deskripsi tersedia."}
                        </p>
                      </div>
                    )))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUsPage;
