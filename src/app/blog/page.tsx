import React from "react";
import NavigationBar from "../component/navbar";
import { Link } from "@nextui-org/react";
import Image from "next/image";
import Banner from "../component/banner";
import Footer from "../component/footer";

interface Blog {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  link: string;
}

const blogData: Blog[] = [
  {
    id: 1,
    title: "The Best Materials for Coffee Mugs",
    description:
      "Explore the top materials used for coffee mugs and their benefits, including ceramic, porcelain, and stainless steel.",
    thumbnail: "/a.jpg",
    link: "/",
  },
  {
    id: 2,
    title: "Choosing the Right Tumbler for Your Needs",
    description:
      "A guide to selecting the perfect tumbler based on insulation, size, and material for your on-the-go lifestyle.",
    thumbnail: "/a.jpg",
    link: "/",
  },
  {
    id: 3,
    title: "Tips for Keeping Your Mug Stain-Free",
    description:
      "Learn effective methods for preventing and removing coffee and tea stains from your favorite mug.",
    thumbnail: "/a.jpg",
    link: "/",
  },
  {
    id: 4,
    title: "Top Benefits of Using Insulated Tumblers",
    description:
      "Understand why insulated tumblers are popular for keeping drinks at the right temperature for longer periods.",
    thumbnail: "/a.jpg",
    link: "/",
  },
];

const BlogsPage: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-white">
      <NavigationBar />
      <div className="mt-20 h-full">
        <Banner title="Blog" imagePath="/a.jpg" />
        <div className="p-12">
          <h1 className="text-5xl font-bold text-black text-center">All Blogs</h1>
          <div className="flex flex-col h-full mt-12">
            {blogData.map((blog) => (
              <Link key={blog.id} href={blog.link} className="mb-6">
                <div className="block p-4 border rounded-md shadow-sm bg-gray-50 hover:bg-gray-100 w-full">
                  <div className="flex items-center">
                    <Image
                      src={blog.thumbnail}
                      alt={blog.title}
                      width={500}
                      height={500}
                      className="w-20 h-20 object-cover mr-4 rounded-md"
                    />
                    <div>
                      <h2 className="text-2xl font-semibold text-black">
                        {blog.title}
                      </h2>
                      <p className="mt-2 text-gray-700">{blog.description}</p>
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
