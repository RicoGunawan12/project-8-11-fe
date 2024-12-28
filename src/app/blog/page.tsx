"use client";
import React, { useEffect, useState } from "react";
import NavigationBar from "../component/navbar";
import { Link } from "@nextui-org/react";
import Image from "next/image";
import Banner from "../component/banner";
import Footer from "../component/footer";
import { toastError } from "../utilities/toast";
import { Post } from "../model/post";
import { formatDate } from "../utilities/converter";
import Loading from "../utilities/loading";

const BlogsPage: React.FC = () => {
  const [blogData, setBlogData] = useState<Post[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.POSTS}`, {
          method: "GET",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message);
        }

        setBlogData(result.posts);
      } catch (error: any) {
        toastError(error.message);
      }
    };

    fetchData();
  }, []);

  if (!blogData) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <NavigationBar />

      {/* Content */}
      <div className="flex-grow mt-20">
      <Banner page="Blog Page" text="Blog" />
        <div className="p-12 min-h-[27.5%] flex justify-center">
          <div className="grid grid-cols-2 w-3/4 lg:grid-cols-4 gap-6 h-full mt-12">
            {blogData?.map((blog) => (
              <Link
                key={blog.postId}
                href={`/blog/${blog.postId}`}
                className="mb-6"
              >
                <div className="block p-4 border-2 rounded-md shadow-2xl bg-gray-50 hover:bg-gray-100 w-full">
                  <div className="">
                    <Image
                      src={`${process.env.BACK_BASE_URL}${blog.postImage}`}
                      alt={blog.postTitle}
                      width={500}
                      height={500}
                      className="w-full h-40 object-cover mr-4 rounded-md"
                    />
                    <div>
                      <h2 className="text-md lg:text-2xl mt-2 font-semibold text-black truncate max-w-full">
                        {blog.postTitle}
                      </h2>
                      <p className="mt-2 text-sm text-gray-700 flex flex-col">
                        <span>{formatDate(blog.createdAt)}</span>
                        <span className="text-secondary text-md font-semibold">
                          Read more &gt; &gt;
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlogsPage;