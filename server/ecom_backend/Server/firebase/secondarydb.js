const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5CF5YC7K8wnygKyg8H2BQUlJmY1Cqo0Y",
  authDomain: "website-sowrajm.firebaseapp.com",
  projectId: "website-sowrajm",
  storageBucket: "website-sowrajm.firebasestorage.app",
  messagingSenderId: "514442393360",
  appId: "1:514442393360:web:70416af1f1f59bf0c5d795",
  measurementId: "G-PD2ELW3RLK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a Firestore instance
const secondaryDbConnection = firebase.firestore();

// Export the Firestore instance for use in other parts of your app
module.exports = {secondaryDbConnection};
