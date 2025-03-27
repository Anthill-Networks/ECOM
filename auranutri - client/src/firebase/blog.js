// blogService.js

const { v4: uuidv4 } = require('uuid');
const { db } = require('./firebase');

// Create a new blog post
const createBlogPost = async (blogPost) => {
  try {
    const newBlogPost = {
      id: uuidv4(), // Generate a unique ID
      ...blogPost,
      createdAt: new Date(),
    };

    await db.collection('blogs').doc(newBlogPost.id).set(newBlogPost);
    console.log('Blog post created successfully');
  } catch (error) {
    console.error('Error creating blog post:', error);
  }
};

// Get all blog posts, ordered by creation date (latest first)
const getAllBlogPosts = async () => {
  try {
    const snapshot = await db.collection('blogs').orderBy('createdAt', 'desc').get();
    const blogPosts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return blogPosts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

// Get a single blog post by ID
const getBlogPostById = async (id) => {
  try {
    const doc = await db.collection('blogs').doc(id).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

// Update a blog post by ID
const updateBlogPost = async (id, updatedData) => {
  try {
    await db.collection('blogs').doc(id).update(updatedData);
    console.log('Blog post updated successfully');
  } catch (error) {
    console.error('Error updating blog post:', error);
  }
};

// Delete a blog post by ID
const deleteBlogPost = async (id) => {
  try {
    await db.collection('blogs').doc(id).delete();
    console.log('Blog post deleted successfully');
  } catch (error) {
    console.error('Error deleting blog post:', error);
  }
};

module.exports = {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
};
