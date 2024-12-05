"use client"

import React, { useEffect, useState } from 'react';
import NavigationBar from '../component/navbar';
import { Card, CardHeader, Link } from '@nextui-org/react';
import { formatDate } from '../utilities/converter';
import { Post } from '../model/post';
import { toastError, toastSuccess } from '../utilities/toast';
// import Image from 'next/image';

const PostsPage: React.FC = () => {

    const [data, setData] = useState<Post[]>();

    useEffect(() => {
        const getData = async () => {
          try {
              const response = await fetch(`${process.env.POST}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
              });
    
              const resp = await response.json();
              if (!response.ok) {
                  throw new Error(resp.message);
              }
    
              console.log(resp)
              setData(resp.posts);
    
              toastSuccess(resp.message);
          } catch (error: any) {
              toastError(error.message);
          }
      };
    
      getData();
      }, [])

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      
      <div className="container mx-auto px-6 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-8 text-black">All Posts</h1>

        <div className="space-y-4">
          {data?.map((post) => (
            <Link key={post.postId} href={`/posts/${post.postId}`} className="block">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-6">
                  <div className="space-y-2 w-full">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold text-black">
                        {post.postTitle}
                      </h2>
                      <span className="text-sm text-gray-500">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {post.postContent}
                    </p>
                    <div className="flex justify-end">
                      <span className="text-blue-600 hover:text-blue-800 font-medium">
                        Read more →
                      </span>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {data?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage;