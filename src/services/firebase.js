// src/services/firebase.js - Version without Storage
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredKeys = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];

  const missingKeys = requiredKeys.filter(key => !process.env[key]);
  
  if (missingKeys.length > 0) {
    console.error('❌ Missing Firebase configuration keys:', missingKeys);
    console.error('Please check your .env file');
    return false;
  }
  
  console.log('✅ Firebase configuration validated');
  return true;
};

// Initialize Firebase only if configuration is valid
let app, db, auth;

try {
  if (validateFirebaseConfig()) {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase services (NO STORAGE)
    db = getFirestore(app);
    auth = getAuth(app);
    
    console.log('🔥 Firebase initialized successfully');
    console.log('📊 Firestore ready');
    console.log('🔐 Auth ready');
    console.log('📁 Storage: DISABLED (using local base64 instead)');
  }
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
}

// Export Firebase services (NO STORAGE)
export { db, auth };
export default app;

// Helper functions
export const isFirebaseReady = () => {
  return !!(app && db && auth);
};

export const getFirebaseConfig = () => {
  return {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    isReady: isFirebaseReady(),
    storageEnabled: false // Explicitly disabled
  };
};

// Debug function for development
export const debugFirebaseConfig = () => {
  if (process.env.NODE_ENV === 'development') {
    console.group('🔥 Firebase Configuration Debug');
    console.log('Project ID:', firebaseConfig.projectId);
    console.log('Auth Domain:', firebaseConfig.authDomain);
    console.log('App Ready:', !!app);
    console.log('Firestore Ready:', !!db);
    console.log('Auth Ready:', !!auth);
    console.log('Storage Enabled:', false);
    console.log('All Required Services Ready:', isFirebaseReady());
    console.groupEnd();
  }
};

// Alternative file handling functions (without Firebase Storage)
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const validateFile = (file, maxSizeMB = 2, allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) => {
  if (!file) return { valid: false, error: 'No file selected' };
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type must be: ${allowedTypes.join(', ')}` };
  }
  
  return { valid: true };
};