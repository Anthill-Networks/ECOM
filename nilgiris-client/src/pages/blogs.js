import React, { useEffect, useState } from "react";
import Header from "../components/navbar/header";
import Nav from "../components/navbar/nav";
import { getAllBlogPosts } from "../firebase/blog";

export default function BlogsScreen() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredBlogPosts, setFilteredBlogPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const posts = await getAllBlogPosts();
      setBlogPosts(posts);
      setFilteredBlogPosts(posts);
    };

    fetchBlogPosts();
  }, []);

  useEffect(() => {
    const filteredPosts = selectedCategory === "All"
      ? blogPosts
      : blogPosts?.filter(post => post?.category === selectedCategory);
    setFilteredBlogPosts(filteredPosts);
  }, [selectedCategory, blogPosts]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <Header />
      <Nav />
      <div className="flex flex-col md:flex-row h-screen">
        <div className="flex-grow md:w-3/4 p-4 overflow-auto">
          <main className="max-w-3xl mx-auto space-y-6 pb-16">
            {filteredBlogPosts.map((post) => (
              <article key={post.id} className="border-b pb-6">
                <img
                  src={post.image}
                  alt={`DIY project ${post.id}`}
                  width={600}
                  height={300}
                  className="w-full h-auto rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">{post.name}</h2>
                <p className="text-gray-600">{post.description}</p>
                <a href={`/blog/${post.id}`} className="mt-2 text-blue-600 hover:underline">
                  Read More
                </a>
              </article>
            ))}
          </main>
        </div>
        <aside className="md:w-1/4 bg-gray-100 p-4 md:h-screen md:overflow-y-auto">
          <div className="space-y-6 sticky top-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Search</h3>
              <div className="flex">
                <input type="search" placeholder="Search..." className="rounded-r-none border p-2" />
                <button className="rounded-l-none border p-2 bg-blue-600 text-white">Search</button>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Categories</h3>
              <ul className="space-y-1">
                {["All", "DIY", "Crafts", "Beauty", "Food"].map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => handleCategoryChange(category)}
                      className={`text-blue-600 hover:underline ${selectedCategory === category ? 'font-bold' : ''}`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Recent Posts</h3>
              <ul className="space-y-4">
                {filteredBlogPosts.slice(0, 3).map((post) => (
                  <li key={post.id} className="flex items-center space-x-2">
                    <img
                      src={post.image}
                      alt={`Recent post ${post.id}`}
                      width={50}
                      height={50}
                      className="rounded"
                    />
                    <a href={`/blog/${post.id}`} className="text-sm text-blue-600 hover:underline">{post.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}