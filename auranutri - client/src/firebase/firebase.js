const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');
require('firebase/compat/storage');

// Your web app's first Firebase configuration
const firebaseConfig1 = {
    apiKey: "AIzaSyA5CF5YC7K8wnygKyg8H2BQUlJmY1Cqo0Y",
    authDomain: "website-sowrajm.firebaseapp.com",
    projectId: "website-sowrajm",
    storageBucket: "website-sowrajm.firebasestorage.app",
    messagingSenderId: "514442393360",
    appId: "1:514442393360:web:70416af1f1f59bf0c5d795",
    measurementId: "G-PD2ELW3RLK"
  };

// Initialize the first Firebase app
const app1 = firebase.initializeApp(firebaseConfig1, "app1");

// Get a Firestore instance from the first app
const db = app1.firestore();

// Your web app's second Firebase configuration
const firebaseConfig2 = {
    apiKey: "AIzaSyCd3uwUGAGwv1SXAdFAvB9eGCrQDECNQv4",
    authDomain: "homyfyd-ba82d.firebaseapp.com",
    projectId: "homyfyd-ba82d",
    storageBucket: "homyfyd-ba82d.appspot.com",
    messagingSenderId: "893096877697",
    appId: "1:893096877697:web:0f62c38a3444d5b224f780",
    measurementId: "G-RJMVHN9JPL"
};

// Initialize the second Firebase app
const app2 = firebase.initializeApp(firebaseConfig2, "app2");

// Get a Storage instance from the second app
const storage = app2.storage();

// Export the instances for use in other parts of your app
module.exports = { db, storage };
