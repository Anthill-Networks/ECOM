const { v4: uuidv4 } = require('uuid');
const { db } = require('./firebase');

// Define the collection name
const collectionName = 'categories';

// Function to create a new Category document with a UUID as the ID
const createCategory = async (CategoryData) => {
    try {
      const CategoryId = uuidv4();
      const CategoryWithId = { 
        ...CategoryData, 
        id: CategoryId,
        timestamp: new Date() // Add a timestamp
      };
  
      await db.collection(collectionName).doc(CategoryId).set(CategoryWithId);
      console.log('Category created successfully with ID:', CategoryId);
      return CategoryId; // Return the generated ID for reference
    } catch (error) {
      console.error('Error creating Category:', error);
    }
  };
  

// Function to read an Category document
const readCategory = async (CategoryId) => {
  try {
    const docRef = db.collection(collectionName).doc(CategoryId);
    const doc = await docRef.get();
    if (doc.exists) {
      console.log('Category data:', doc.data());
      return doc.data();
    } else {
      console.log('No such Category!');
    }


  } catch (error) {
    console.error('Error reading Category:', error);
  }
};

// Function to update an Category document
const updateCategory = async (CategoryId, updates) => {
  try {
    const docRef = db.collection(collectionName).doc(CategoryId);
    await docRef.update(updates);
    console.log('Category updated successfully');
  } catch (error) {
    console.error('Error updating Category:', error);
  }
};

// Function to delete an Category document
const deleteCategory = async (CategoryId) => {
  try {
    const docRef = db.collection(collectionName).doc(CategoryId);
    await docRef.delete();
    console.log('Category deleted successfully');
  } catch (error) {
    console.error('Error deleting Category:', error);
  }
};

// Function to get all Category documents, sorted by timestamp in descending order
const getAllCategory = async () => {
    try {
      const snapshot = await db.collection(collectionName).get();
      
      if (snapshot.empty) {
        console.log('No Category found.');
        return [];
      }
  
      const Category = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      console.log('All Category:', Category);
      return Category;
    } catch (error) {
      console.error('Error fetching all Category:', error);
    }
  };
  

// Example usage
const exampleUsage = async () => {
  const CategoryData = {
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

  const CategoryId = await createCategory(CategoryData);
  await readCategory(CategoryId);
  await updateCategory(CategoryId, { bestContactTime: 'Evening' });
//   await deleteCategory(CategoryId);
};

module.exports = {
  createCategory,
  readCategory,
  updateCategory,
  deleteCategory,
  exampleUsage,
  getAllCategory
};
