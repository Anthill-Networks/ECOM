const { v4: uuidv4 } = require('uuid');
const { db } = require('./firebase');

// Define the collection name
const collectionName = 'ecom_products';

// Function to create a new Products document with a UUID as the ID
const createProducts = async (ProductsData) => {
    try {
      const ProductsId = uuidv4();
      const ProductsWithId = { 
        ...ProductsData, 
        id: ProductsId,
        timestamp: new Date() // Add a timestamp
      };
  
      await db.collection(collectionName).doc(ProductsId).set(ProductsWithId);
      console.log('Products created successfully with ID:', ProductsId);
      return ProductsId; // Return the generated ID for reference
    } catch (error) {
      console.error('Error creating Products:', error);
    }
  };
  

// Function to read an Products document
const readProducts = async (ProductsId) => {
  try {
    const docRef = db.collection(collectionName).doc(ProductsId);
    const doc = await docRef.get();
    if (doc.exists) {
      const productData = doc.data();
      // Filter out inactive variants if the product has variants
      if (productData.variants) {
        productData.variants = productData.variants.filter(variant => variant.is_active);
      }
      console.log('Products data:', productData);
      return productData;
    } else {
      console.log('No such Products!');
      return null;
    }
  } catch (error) {
    console.error('Error reading Products:', error);
    return null;
  }
};

// Function to update an Products document
const updateProducts = async (ProductsId, updates) => {
  try {
    const docRef = db.collection(collectionName).doc(ProductsId);
    await docRef.update(updates);
    console.log('Products updated successfully');
  } catch (error) {
    console.error('Error updating Products:', error);
  }
};

// Function to delete an Products document
const deleteProducts = async (ProductsId) => {
  try {
    const docRef = db.collection(collectionName).doc(ProductsId);
    await docRef.delete();
    console.log('Products deleted successfully');
  } catch (error) {
    console.error('Error deleting Products:', error);
  }
};

// Modified function to get only active products and their active variants
const getAllProducts = async () => {
    try {
      const snapshot = await db.collection(collectionName).get();
      
      if (snapshot.empty) {
        console.log('No Products found.');
        return [];
      }
  
      const Products = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(product => product.is_active) // Only include active products
        .map(product => ({
          ...product,
          // If product has variants, filter to only include active variants
          variants: product.variants 
            ? product.variants.filter(variant => variant.is_active)
            : []
        }));
  
      console.log('Active Products:', Products);
      return Products;
    } catch (error) {
      console.error('Error fetching active Products:', error);
      return [];
    }
  };

// Example usage
const exampleUsage = async () => {
  const ProductsData = {
    type: 'Course Inquiry',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    currentSchool: 'Example High School',
    yearOfCompleting: '2025',
    currentCity: 'New York',
    bestContactTime: 'Afternoon'
  };

  const ProductsId = await createProducts(ProductsData);
  await readProducts(ProductsId);
  await updateProducts(ProductsId, { bestContactTime: 'Evening' });
//   await deleteProducts(ProductsId);
};

// Add new function for reviews
const addProductReview = async (productId, reviewData) => {
  try {
    const reviewId = uuidv4();
    const reviewWithId = {
      ...reviewData,
      id: reviewId,
      product_id: productId,
      timestamp: new Date()
    };

    await db.collection('product_reviews').doc(reviewId).set(reviewWithId);
    console.log('Review added successfully');
    return reviewId;
  } catch (error) {
    console.error('Error adding review:', error);
  }
};

// Add function to get product reviews
const getProductReviews = async (productId) => {
  try {
    const snapshot = await db.collection('product_reviews')
      .where('product_id', '==', productId).get();

    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

module.exports = {
  createProducts,
  readProducts,
  updateProducts,
  deleteProducts,
  exampleUsage,
  getAllProducts,
  addProductReview,
  getProductReviews
};
