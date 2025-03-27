"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllBlogPosts } from "../../firebase/blog";

export default function BlogCarousel() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const posts = await getAllBlogPosts();
      setBlogPosts(posts);
    };

    fetchBlogPosts();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === blogPosts.length - 3 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? blogPosts.length - 3 : prevIndex - 1
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold text-center mb-8">Latest Blog</h2>
      <div className="relative">
        <div className="flex px-[2%]  space-x-6 overflow-hidden">
          {blogPosts.slice(currentIndex, currentIndex + 3).map((post) => (
            <div key={post.id} className="w-full bg-white max-w-sm flex-shrink-0 border rounded-lg shadow-md">
              {/* <div className="w-full h-48 bg-gray-200 mb-4"></div>
               */}
               <img
                src={post.image}
                alt={post.name}
                className="w-full h-48 object-cover mb-4 rounded-t-lg"
              />
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">{new Date(post.date).toLocaleDateString()}</div>
                <h3 className="text-lg font-semibold text-purple-600 mb-2">{post.name}</h3>
                <p className="text-gray-600 mb-4">{post.description.substring(0, 100)}...</p>
                <a href={`/blog/${post.id}`} className="text-purple-600 hover:underline">
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
        <button
          className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 border rounded-full p-2 bg-white shadow hover:bg-gray-100"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 border rounded-full p-2 bg-white shadow hover:bg-gray-100"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}