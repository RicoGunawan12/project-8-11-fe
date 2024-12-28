"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import NavigationBar from "@/app/component/navbar";
import Loading from "@/app/utilities/loading";
import { Post } from "@/app/model/post";
import Banner from "@/app/component/banner";
import Footer from "@/app/component/footer";

const BlogDetail = () => {
  const router = useParams();
  const id = router.param;
  const [data, setData] = useState<Post>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.POSTS}/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch blog details");
        }
        setData(result.post);
        console.log(result.post)
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!data) {
    return <Loading />;
  }

  return (
    <div className="h-screen w-screen bg-gray-50">
      <NavigationBar />
      <div className="mt-20 h-full">
        <Banner
          text=""
          page={`${process.env.BACK_BASE_URL}${data.postImage}`}
        />

        <div className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-left mb-6">
              <h1 className="text-4xl font-bold text-gray-800 uppercase">{data.postTitle}</h1>
              <p className="text-sm text-gray-500 mt-2">
                Published on {new Date(data.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="text-gray-700 leading-relaxed text-lg" dangerouslySetInnerHTML={{__html: data.postContent}}>
              
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default BlogDetail;
