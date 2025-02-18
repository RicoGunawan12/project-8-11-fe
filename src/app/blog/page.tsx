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
import {Loading} from "../utilities/loading";

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
        <div className="px-4 md:px-12 py-8 flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl">
            {blogData?.map((blog) => (
              <Link
                key={blog.postId}
                href={`/blog/${blog.postId}`}
                className="block"
              >
                <div className="p-4 border rounded-md shadow-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                  <Image
                    src={`${process.env.BACK_BASE_URL}${blog.postImage}`}
                    alt={blog.postTitle}
                    width={500}
                    height={500}
                    className="w-full h-40 md:h-48 lg:h-52 object-cover rounded-md"
                    priority
                  />
                  <div className="mt-4">
                    <h2 className="text-lg md:text-xl font-semibold text-black truncate">
                      {blog.postTitle}
                    </h2>
                    <p className="mt-2 text-sm md:text-base text-gray-700 flex flex-col">
                      <span>{formatDate(blog.createdAt)}</span>
                      <span className="text-secondary text-sm md:text-base font-semibold">
                        Read more &gt;&gt;
                      </span>
                    </p>
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
