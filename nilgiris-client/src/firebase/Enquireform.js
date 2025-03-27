const { v4: uuidv4 } = require('uuid');
const {db} = require('./firebase');

// Define the collection name
const collectionName = 'enquiries';

// Function to create a new enquiry document with a UUID as the ID
const createEnquiry = async (enquiryData) => {
    try {
      const enquiryId = uuidv4();
      const enquiryWithId = { 
        ...enquiryData, 
        id: enquiryId,
        timestamp: new Date() // Add a timestamp
      };
  
      await db.collection(collectionName).doc(enquiryId).set(enquiryWithId);
      console.log('Enquiry created successfully with ID:', enquiryId);
      return enquiryId; // Return the generated ID for reference
    } catch (error) {
      console.error('Error creating enquiry:', error);
    }
  };
  

// Function to read an enquiry document
const readEnquiry = async (enquiryId) => {
  try {
    const docRef = db.collection(collectionName).doc(enquiryId);
    const doc = await docRef.get();
    if (doc.exists) {
      console.log('Enquiry data:', doc.data());
    } else {
      console.log('No such enquiry!');
    }
  } catch (error) {
    console.error('Error reading enquiry:', error);
  }
};

// Function to update an enquiry document
const updateEnquiry = async (enquiryId, updates) => {
  try {
    const docRef = db.collection(collectionName).doc(enquiryId);
    await docRef.update(updates);
    console.log('Enquiry updated successfully');
  } catch (error) {
    console.error('Error updating enquiry:', error);
  }
};

// Function to delete an enquiry document
const deleteEnquiry = async (enquiryId) => {
  try {
    const docRef = db.collection(collectionName).doc(enquiryId);
    await docRef.delete();
    console.log('Enquiry deleted successfully');
  } catch (error) {
    console.error('Error deleting enquiry:', error);
  }
};

// Function to get all enquiry documents, sorted by timestamp in descending order
const getAllEnquiries = async () => {
    try {
      const snapshot = await db.collection(collectionName)
        .orderBy('timestamp', 'desc') // Sort by timestamp in descending order
        .get();
      
      if (snapshot.empty) {
        console.log('No enquiries found.');
        return [];
      }
  
      const enquiries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      console.log('All enquiries:', enquiries);
      return enquiries;
    } catch (error) {
      console.error('Error fetching all enquiries:', error);
    }
  };
  

// Example usage
const exampleUsage = async () => {
  const enquiryData = {
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

  const enquiryId = await createEnquiry(enquiryData);
  await readEnquiry(enquiryId);
  await updateEnquiry(enquiryId, { bestContactTime: 'Evening' });
//   await deleteEnquiry(enquiryId);
};

module.exports = {
  createEnquiry,
  readEnquiry,
  updateEnquiry,
  deleteEnquiry,
  exampleUsage,
  getAllEnquiries
};
