// src/services/authService.js - Clean version without unused imports
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
  // Remove updateProfile since it's not used in this basic version
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';

export class AuthService {
  // Demo accounts for development/testing
  static getDemoAccounts() {
    return {
      admin: {
        email: 'admin@hangnadim.com',
        password: 'admin123',
        role: 'admin',
        displayName: 'Admin HCIS'
      },
      user: {
        email: 'user@hangnadim.com', 
        password: 'user123',
        role: 'user',
        displayName: 'Employee Demo'
      }
    };
  }

  // Login user with email and password
  static async login(email, password) {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ Firebase Auth successful');
      
      // Get user profile from Firestore
      let userData = null;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          userData = userDoc.data();
          console.log('✅ User profile loaded from Firestore');
        } else {
          // Create user profile if doesn't exist (for demo accounts)
          userData = await this.createUserProfile(user, email);
          console.log('✅ User profile created');
        }
      } catch (firestoreError) {
        console.warn('⚠️ Firestore profile fetch failed:', firestoreError.message);
        // Continue with basic user data
        userData = { role: 'user', email: user.email };
      }
      
      // Update last login time
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } catch (updateError) {
        console.warn('⚠️ Failed to update last login time:', updateError.message);
      }
      
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || userData.displayName,
        role: userData.role || 'user',
        profile: userData
      };
      
      console.log('✅ Login successful:', userProfile);
      return userProfile;
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw this.handleAuthError(error);
    }
  }

  // Create user profile in Firestore
  static async createUserProfile(user, email) {
    const demoAccounts = this.getDemoAccounts();
    let userData = { role: 'user', email: user.email };
    
    // Check if it's a demo account
    if (email === demoAccounts.admin.email) {
      userData = {
        email: user.email,
        role: 'admin',
        displayName: demoAccounts.admin.displayName,
        department: 'IT',
        position: 'System Administrator',
        status: 'active'
      };
    } else if (email === demoAccounts.user.email) {
      userData = {
        email: user.email,
        role: 'user', 
        displayName: demoAccounts.user.displayName,
        department: 'Human Resources',
        position: 'Employee',
        status: 'active'
      };
    }
    
    // Add timestamps
    userData.createdAt = serverTimestamp();
    userData.updatedAt = serverTimestamp();
    userData.lastLoginAt = null;
    
    try {
      await setDoc(doc(db, 'users', user.uid), userData);
      return userData;
    } catch (error) {
      console.error('❌ Failed to create user profile:', error);
      return { role: 'user', email: user.email };
    }
  }

  // Register new user (admin functionality)
  static async register(email, password, role = 'user', additionalData = {}) {
    try {
      console.log('📝 Creating new user:', email);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      const userProfile = {
        email: user.email,
        role: role,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: null,
        ...additionalData
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      console.log('✅ User registered successfully');
      
      return {
        uid: user.uid,
        email: user.email,
        role: role,
        profile: userProfile
      };
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw this.handleAuthError(error);
    }
  }

  // Logout user
  static async logout() {
    try {
      await signOut(auth);
      console.log('✅ Logout successful');
      return true;
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw this.handleAuthError(error);
    }
  }

  // Get current authenticated user
  static getCurrentUser() {
    return auth.currentUser;
  }

  // Listen to authentication state changes
  static onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            callback({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || userData.displayName,
              role: userData.role || 'user',
              profile: userData
            });
          } else {
            // User exists in Auth but not in Firestore - create profile
            const userData = await this.createUserProfile(user, user.email);
            callback({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || userData.displayName,
              role: userData.role || 'user',
              profile: userData
            });
          }
        } catch (error) {
          console.error('❌ Error fetching user profile:', error);
          // Fallback to basic user data
          callback({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: 'user',
            profile: { email: user.email, role: 'user' }
          });
        }
      } else {
        callback(null);
      }
    });
  }

  // Create demo accounts for development
  static async createDemoAccounts() {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('⚠️ Demo accounts can only be created in development mode');
      return;
    }

    const demoAccounts = this.getDemoAccounts();
    
    try {
      console.log('🔧 Creating demo accounts...');
      
      // Create admin account
      try {
        await this.register(
          demoAccounts.admin.email,
          demoAccounts.admin.password,
          'admin',
          {
            displayName: demoAccounts.admin.displayName,
            department: 'IT',
            position: 'System Administrator'
          }
        );
        console.log('✅ Demo admin account created');
      } catch (error) {
        if (error.message.includes('already-in-use')) {
          console.log('ℹ️ Demo admin account already exists');
        } else {
          console.error('❌ Failed to create demo admin:', error);
        }
      }

      // Create user account
      try {
        await this.register(
          demoAccounts.user.email,
          demoAccounts.user.password,
          'user',
          {
            displayName: demoAccounts.user.displayName,
            department: 'Human Resources',
            position: 'Employee'
          }
        );
        console.log('✅ Demo user account created');
      } catch (error) {
        if (error.message.includes('already-in-use')) {
          console.log('ℹ️ Demo user account already exists');
        } else {
          console.error('❌ Failed to create demo user:', error);
        }
      }
      
    } catch (error) {
      console.error('❌ Error creating demo accounts:', error);
    }
  }

  // Handle authentication errors with user-friendly messages
  static handleAuthError(error) {
    const errorMessages = {
      'auth/user-not-found': 'Email tidak terdaftar dalam sistem.',
      'auth/wrong-password': 'Password yang Anda masukkan salah.',
      'auth/invalid-email': 'Format email tidak valid.',
      'auth/user-disabled': 'Akun Anda telah dinonaktifkan. Hubungi administrator.',
      'auth/too-many-requests': 'Terlalu banyak percobaan login. Coba lagi nanti.',
      'auth/email-already-in-use': 'Email sudah terdaftar dalam sistem.',
      'auth/weak-password': 'Password terlalu lemah. Gunakan minimal 6 karakter.',
      'auth/invalid-credential': 'Email atau password tidak valid.',
      'auth/network-request-failed': 'Koneksi internet bermasalah. Coba lagi.',
      'permission-denied': 'Akses ditolak. Periksa koneksi internet dan coba lagi.'
    };

    const userFriendlyMessage = errorMessages[error.code] || error.message || 'Terjadi kesalahan yang tidak diketahui.';
    
    return new Error(userFriendlyMessage);
  }
}

export default AuthService;