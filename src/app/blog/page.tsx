"use client"
import React, { useEffect, useState } from "react";
import NavigationBar from "../component/navbar";
import { Link } from "@nextui-org/react";
import Image from "next/image";
import Banner from "../component/banner";
import Footer from "../component/footer";
import { toastError } from "../utilities/toast";
import { Post } from "../model/post";

const BlogsPage: React.FC = () => {

  const [blogData, setBlogData] = useState<Post[]>()

  useEffect(() => {

    const fetchData = async() => {

      try {
        
        const response = await fetch(`${process.env.POSTS}`,{
          method: 'GET'
        })

        const result = await response.json()

        if(!response.ok){
          throw new Error(result.message)
        }

        console.log(result.posts)
        setBlogData(result.posts)

      } catch (error : any) {
        toastError(error.message)
      }
    }

    fetchData()

  }, [])

  return (
    <div className="w-screen h-screen bg-white">
      <NavigationBar />
      <div className="mt-20 h-full">
        <Banner title="Blog" imagePath="/a.jpg" />
        <div className="p-12">
          <h1 className="text-5xl font-bold text-black text-center">All Blogs</h1>
          <div className="grid grid-cols-3 gap-6 h-full mt-12">
            {blogData?.map((blog) => (
              <Link key={blog.postId} href={`/blog/${blog.postId}`} className="mb-6">
                <div className="block p-4 border-2 rounded-md shadow-2xl bg-gray-50 hover:bg-gray-100 w-full">
                  <div className="flex items-center">
                    <Image
                      src={`${process.env.BACK_BASE_URL}${blog.postImage}`}
                      
                      alt={blog.postTitle}
                      width={500}
                      height={500}
                      className="w-20 h-20 object-cover mr-4 rounded-md"
                    />
                    <div>
                      <h2 className="text-2xl font-semibold text-black">
                        {blog.postTitle}
                      </h2>
                      <p className="mt-2 text-gray-700 max-w-[300px] truncate">{blog.postContent}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <Footer/>
      </div>
    </div>
  );
};

export default BlogsPage;
