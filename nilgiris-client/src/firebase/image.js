const { storage } = require('./firebase');
const { v4: uuidv4 } = require('uuid');

/**
 * Uploads an image to Firebase Storage and returns the download URL
 * @param {File} imageFile - The image file to upload
 * @param {string} folder - The folder path in storage (e.g., 'products', 'blogs')
 * @returns {Promise<string>} The download URL of the uploaded image
 */
const uploadImage = async (imageFile, folder = 'images') => {
    try {
        // Generate a unique filename
        const fileExtension = imageFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        
        // Create the storage reference
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`${folder}/${fileName}`);

        // Upload the file
        const snapshot = await imageRef.put(imageFile);
        console.log('Image uploaded successfully');

        // Get the download URL
        const downloadURL = await snapshot.ref.getDownloadURL();
        console.log('Image download URL:', downloadURL);

        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

/**
 * Deletes an image from Firebase Storage
 * @param {string} imageUrl - The URL of the image to delete
 */
const deleteImage = async (imageUrl) => {
    try {
        // Create a reference to the file from the URL
        const imageRef = storage.refFromURL(imageUrl);
        
        // Delete the file
        await imageRef.delete();
        console.log('Image deleted successfully');
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

/**
 * Uploads multiple images and returns their download URLs
 * @param {File[]} imageFiles - Array of image files to upload
 * @param {string} folder - The folder path in storage
 * @returns {Promise<string[]>} Array of download URLs
 */
const uploadMultipleImages = async (imageFiles, folder = 'images') => {
    try {
        const uploadPromises = imageFiles.map(file => uploadImage(file, folder));
        const downloadURLs = await Promise.all(uploadPromises);
        return downloadURLs;
    } catch (error) {
        console.error('Error uploading multiple images:', error);
        throw error;
    }
};

module.exports = {
    uploadImage,
    deleteImage,
    uploadMultipleImages
}; 