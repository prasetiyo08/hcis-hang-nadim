// src/services/firebase.js - Updated Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - UPDATE THESE VALUES WITH YOUR ACTUAL CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyB8dzz0OaxyNXVEG4WB7dtYzCyLy1XbY6Q",
  authDomain: "hcis-hang-nadim.firebaseapp.com", 
  projectId: "hcis-hang-nadim",
  storageBucket: "hcis-hang-nadim.firebasestorage.app",
  messagingSenderId: "869733474054",
  appId: "1:869733474054:web:432031e888f919fdb60887"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

export default app;

// Helper functions for file handling (without Firebase Storage)
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const validateFile = (file, maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      valid: false, 
      error: `File size exceeds ${maxSizeMB}MB limit` 
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }

  return { valid: true };
};

// Helper functions for profile management
export const profileHelpers = {
  // Create or update admin profile
  createAdminProfile: async (email, profileData) => {
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'admin_profiles', email), {
        ...profileData,
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error creating admin profile:', error);
      return { success: false, error };
    }
  },

  // Get admin profile
  getAdminProfile: async (email) => {
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'admin_profiles', email);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() };
      } else {
        return { success: false, error: 'Profile not found' };
      }
    } catch (error) {
      console.error('Error getting admin profile:', error);
      return { success: false, error };
    }
  },

  // Update admin profile
  updateAdminProfile: async (email, updates) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'admin_profiles', email), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating admin profile:', error);
      return { success: false, error };
    }
  },

  // Create or update employee profile
  createEmployeeProfile: async (email, profileData) => {
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'employee_profiles', email), {
        ...profileData,
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error creating employee profile:', error);
      return { success: false, error };
    }
  },

  // Get employee profile
  getEmployeeProfile: async (email) => {
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'employee_profiles', email);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() };
      } else {
        return { success: false, error: 'Profile not found' };
      }
    } catch (error) {
      console.error('Error getting employee profile:', error);
      return { success: false, error };
    }
  },

  // Update employee profile
  updateEmployeeProfile: async (email, updates) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'employee_profiles', email), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating employee profile:', error);
      return { success: false, error };
    }
  }
};