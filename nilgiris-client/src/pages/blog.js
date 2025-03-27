import * as React from "react";
import { Facebook, Twitter, Instagram, Share2 } from "lucide-react";
import Header from "../components/navbar/header";
import Nav from "../components/navbar/nav";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogPostById, getAllBlogPosts } from "../firebase/blog"; // Adjust the path as needed

export default function SingleBlogPost() {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBlogPost = async () => {
      const post = await getBlogPostById(id);
      setBlogPost(post);
    };

    const fetchRecentPosts = async () => {
      const posts = await getAllBlogPosts();
      const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentPosts(sortedPosts.slice(0, 5)); // Get the 5 most recent posts
    };

    const fetchCategories = async () => {
      const posts = await getAllBlogPosts();
      const uniqueCategories = [...new Set(posts.map(post => post.category))];
      setCategories(uniqueCategories);
    };

    fetchBlogPost();
    fetchRecentPosts();
    fetchCategories();
  }, [id]);

  if (!blogPost) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <Nav />
      <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-8">
        <main className="flex-grow space-y-8">
          <article className="space-y-6">
            <h1 className="text-4xl font-bold">{blogPost.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt="Author"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">{blogPost.writer}</p>
                <p className="text-sm text-gray-500">
                  Posted on {new Date(blogPost.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <img
              src={blogPost.image}
              alt="DIY project"
              className="w-full h-[400px] object-cover rounded-lg"
            />
            <div className="prose max-w-none">
              {blogPost.description}
            </div>
            <div className="flex space-x-4">
              <button className="border border-gray-300 rounded px-4 py-2 flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </button>
              <button className="border border-gray-300 rounded px-4 py-2 flex items-center">
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </button>
              <button className="border border-gray-300 rounded px-4 py-2 flex items-center">
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </button>
            </div>
          </article>

          <section>
            <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4">
                    <img
                      src={post.image}
                      alt={`Related post ${post.id}`}
                      className="w-full h-40 object-cover rounded-lg mb-2"
                    />
                    <h3 className="font-semibold">{post.name}</h3>
                    <p className="text-sm text-gray-600">
                      {post.description.substring(0, 100)}...
                    </p>
                  </div>
                  <div className="p-4">
                    <button className="w-full text-left text-blue-600 hover:underline">
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="w-full md:w-64 space-y-8">
          <section>
            <h3 className="text-xl font-bold mb-2">Search</h3>
            <div className="flex">
              <input
                type="search"
                placeholder="Search..."
                className="border rounded-l px-2 py-1"
              />
              <button className="border rounded-r px-4 py-1">Search</button>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-2">Categories</h3>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category}>
                  <button className="text-blue-600 hover:underline">
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-2">Recent Posts</h3>
            <ul className="space-y-4">
              {recentPosts.map((post) => (
                <li key={post.id} className="flex items-center space-x-2">
                  <img
                    src={post.image}
                    alt={`Recent post ${post.id}`}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <button className="text-sm text-blue-600 hover:underline">
                    {post.name}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <button className="border rounded-full p-2">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </button>
              <button className="border rounded-full p-2">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </button>
              <button className="border rounded-full p-2">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </button>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}