import React, { useState, useEffect } from 'react';
import {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
} from './../../firebase/blog'; // Adjust the path as needed
import ExportToExcel from './ExportToExcel';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [formData, setFormData] = useState({ name: '', writer: '', date: '', image: '', description: '', category: '' });
  const [categories] = useState(['DIY', 'Crafts', 'Beauty', 'Food']); // Static categories

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsData = await getAllBlogPosts();
      setBlogs(blogsData);
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs?.filter(blog =>
    blog?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(startIdx, endIdx);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (blog) => {
    setCurrentBlog(blog);
    setFormData({ ...blog });
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const openDeleteModal = (blog) => {
    setCurrentBlog(blog);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleAddBlog = async (event) => {
    event.preventDefault();
    await createBlogPost(formData);
    closeAddModal();
    setFormData({ name: '', writer: '', date: '', image: '', description: '', category: '' });
    // Refresh the blog list
    const blogsData = await getAllBlogPosts();
    setBlogs(blogsData);
  };

  const handleEditBlog = async (event) => {
    event.preventDefault();
    if (currentBlog) {
      await updateBlogPost(currentBlog.id, formData);
      closeEditModal();
      setFormData({ name: '', writer: '', date: '', image: '', description: '', category: '' });
      // Refresh the blog list
      const blogsData = await getAllBlogPosts();
      setBlogs(blogsData);
    }
  };

  const handleDeleteBlog = async () => {
    if (currentBlog) {
      await deleteBlogPost(currentBlog.id);
      closeDeleteModal();
      // Refresh the blog list
      const blogsData = await getAllBlogPosts();
      setBlogs(blogsData);
    }
  };

  return (
    <div className="p-4 w-full mt-[4%] bg-white shadow-md rounded-lg">
      <ExportToExcel data={blogs} fileName="blogs" />

      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold">Blog Management</h1>
          <p className="text-gray-500">Manage your blog posts here 👋</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 border border-gray-300 rounded-full"
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 material-icons">
            search
          </span>
        </div>
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded-md"
          onClick={openAddModal}
        >
          Add Blog
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-100 border-b">#</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Blog Name</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Writer</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Date of Publish</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Image</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Description</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Category</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBlogs.map((blog, index) => (
            <tr key={blog.id}>
              <td className="py-2 px-4 border-b">{startIdx + index + 1}</td>
              <td className="py-2 px-4 border-b">{blog.name}</td>
              <td className="py-2 px-4 border-b">{blog.writer}</td>
              <td className="py-2 px-4 border-b">{new Date(blog.date).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">
                <img src={blog.image} alt={blog.name} className="w-16 h-16 object-cover" />
              </td>
              <td className="py-2 px-4 border-b">{blog.description}</td>
              <td className="py-2 px-4 border-b">{blog.category}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="px-4 py-1 bg-orange-500 text-white rounded-md mr-2"
                  onClick={() => openEditModal(blog)}
                >
                  Edit
                </button>
                <button
                  className="material-icons text-gray-400"
                  onClick={() => openDeleteModal(blog)}
                >
                  delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <span className="text-gray-500">
          {`Page ${currentPage} of ${totalPages}`}
        </span>
        <div className="flex space-x-2">
          <button
            className="px-2 py-1 border rounded"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ❮
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`px-2 py-1 border rounded ${page === currentPage ? 'bg-orange-500 text-white' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="px-2 py-1 border rounded"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ❯
          </button>
        </div>
      </div>
      {/* Add Blog Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Blog</h2>
            <form onSubmit={handleAddBlog}>
              <input
                type="text"
                placeholder="Blog Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
              />
              <input
                type="text"
                placeholder="Writer Name"
                value={formData.writer}
                onChange={(e) => setFormData({ ...formData, writer: e.target.value })}
                className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
              />
              <input
                type="date"
                placeholder="Date of Publish"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-md mr-2">
                Add Blog
              </button>
              <button type="button" onClick={closeAddModal} className="px-4 py-2 border rounded">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Edit Blog Modal */}
      {isEditModalOpen && currentBlog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Blog</h2>
            <form onSubmit={handleEditBlog}>
              <input
                type="text"
                placeholder="Blog Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
              />
              <input
                type="text"
                placeholder="Writer Name"
                value={formData.writer}
                onChange={(e) => setFormData({ ...formData, writer: e.target.value })}
                className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
              />
              <input
                type="date"
                placeholder="Date of Publish"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-md mr-2">
                Save Changes
              </button>
              <button type="button" onClick={closeEditModal} className="px-4 py-2 border rounded">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Delete Blog Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Delete Blog</h2>
            <p>Are you sure you want to delete this blog?</p>
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
                onClick={handleDeleteBlog}
              >
                Delete
              </button>
              <button type="button" onClick={closeDeleteModal} className="px-4 py-2 border rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;