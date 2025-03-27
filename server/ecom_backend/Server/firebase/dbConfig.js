const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');

// Database configurations for different companies
const dbConfigs = {
  'd2f4906d-8e71-4623-afc1-c3af5654ae2a': {
    apiKey: "AIzaSyD_rnXd3BtoJ1drSBgUkqkc8zR6hkrLp6Y",
    authDomain: "globechemicalsllc.firebaseapp.com",
    projectId: "globechemicalsllc",
    storageBucket: "globechemicalsllc.appspot.com",
    messagingSenderId: "529379158041",
    appId: "1:529379158041:web:89c52dbe451248725c2288",
    measurementId: "G-Q0VYX5JVD0",
    razorpay: {
      key_id: "rzp_live_7zuH154CVQA9YI",
      key_secret: "NEI0BRFsHp30NQXUkdnIAUFj"
    },
    email: {
      service: 'Gmail',
      auth: {
        user: 'anthillnetworks@gmail.com',
        pass: 'wble rawv mcmn rxkd'
      }
    },
    whatsapp: {
      apiKey: '30c60cad789882970dced9849ssss8ec2332',
      fromNumber: '+918762724211178',
      templateName: 'text_otppp'
    }
  },
  'd2f4906d-8e71-4623-afc1-c3af5653ae9a': {
    apiKey: "AIzaSyA5CF5YC7K8wnygKyg8H2BQUlJmY1Cqo0Y",
    authDomain: "website-sowrajm.firebaseapp.com",
    projectId: "website-sowrajm",
    storageBucket: "website-sowrajm.firebasestorage.app",
    messagingSenderId: "514442393360",
    appId: "1:514442393360:web:70416af1f1f59bf0c5d795",
    measurementId: "G-PD2ELW3RLK",
    razorpay: {
      key_id: "rzp_live_2OGYOW12Qdpan9",
      key_secret: "PrUG3B6DzOUgZsgOMIPTAhef"
    },
    whatsapp: {
      apiKey: 'c5346f01b112c6abab4c67c13b8f2dd3',
      fromNumber: '+918438537818',
      templateName: 'text_otp'
    },
    email: {
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-specific-password'
      }
    }
  },
  'default': {
    apiKey: "AaaaaaIzaSyA5CF5YC7K8wnygKyg8H2BQUlJmY1Cqo0Y",
    authDomain: "aaaaaawebsite-sowrajm.firebaseapp.com",
    projectId: "aaaaaawebsite-sowrajm",
    storageBucket: "aaaaaawebsite-sowrajm.firebasestorage.app",
    messagingSenderId: "aaaaaa514442393360",
    appId: "1:aaaaaa514442393360:web:70416af1f1f59bf0c5d795",
    measurementId: "aaaaaG-PD2ELW3RLK",
    razorpay: {
      key_id: "aaaaazp_live_7zuH154CVQA9YI",
      key_secret: "aaaaaNEI0BRFsHp30NQXUkdnIAUFj"
    },
    email: {
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-specific-password'
      }
    },
    whatsapp: {
      apiKey: '30c60cad789882970dced98498ec2332',
      fromNumber: '+918762724278',
      templateName: 'text_otp'
    }
  }
};

const firebaseApps = {};

function getDbConnection(companyId) {
  if (!companyId) {
    companyId = 'default';
  }

  // If connection already exists, return it
  if (firebaseApps[companyId]) {
    return firebaseApps[companyId].firestore();
  }

  // Get config for company, fallback to default if not found
  const config = dbConfigs[companyId] || dbConfigs.default;
  
  // Initialize new Firebase app with unique name
  const appName = `app-${companyId}`;
  const app = firebase.initializeApp(config, appName);
  
  // Store the app instance
  firebaseApps[companyId] = app;
  
  // Return Firestore instance
  return app.firestore();
}

// Function to get Razorpay config
function getRazorpayConfig(companyId) {
  const config = dbConfigs[companyId] || dbConfigs.default;
  return config.razorpay;
}

// Add new function to get email config
function getEmailConfig(companyId) {
  const config = dbConfigs[companyId] || dbConfigs.default;
  return config.email;
}

// Add new function to get WhatsApp config
function getWhatsAppConfig(companyId) {
  const config = dbConfigs[companyId] || dbConfigs.default;
  return config.whatsapp;
}

module.exports = { 
  getDbConnection, 
  getRazorpayConfig, 
  getEmailConfig,
  getWhatsAppConfig 
}; 