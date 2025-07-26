// src/services/authService.js - FIXED - No Auto Login
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
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

  // Login user with email and password - EXPLICIT ONLY
  static async login(email, password) {
    try {
      console.log('🔐 Attempting explicit login for:', email);
      
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
          // Create user profile if doesn't exist (for demo accounts only)
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
      
      console.log('✅ Explicit login successful:', userProfile);
      return userProfile;
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw this.handleAuthError(error);
    }
  }

  // Create user profile in Firestore - ONLY for known demo accounts
  static async createUserProfile(user, email) {
    const demoAccounts = this.getDemoAccounts();
    let userData = null;
    
    // ONLY create profile for known demo accounts
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
    } else {
      // For non-demo accounts, don't auto-create, return basic data
      console.log('ℹ️ Non-demo account, returning basic user data');
      return { role: 'user', email: user.email };
    }
    
    // Add timestamps
    userData.createdAt = serverTimestamp();
    userData.updatedAt = serverTimestamp();
    userData.lastLoginAt = null;
    
    try {
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log('✅ Demo account profile created');
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

  // Listen to authentication state changes - NO AUTO-CREATE
  static onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          console.log('🔍 Auth state changed - user found:', user.email);
          
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('✅ User profile exists in Firestore');
            callback({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || userData.displayName,
              role: userData.role || 'user',
              profile: userData
            });
          } else {
            // User exists in Auth but not in Firestore
            console.log('⚠️ User exists in Auth but no Firestore profile found');
            
            // Check if it's a demo account, if so create profile
            const demoAccounts = this.getDemoAccounts();
            if (user.email === demoAccounts.admin.email || user.email === demoAccounts.user.email) {
              console.log('ℹ️ Demo account detected, creating profile');
              const userData = await this.createUserProfile(user, user.email);
              callback({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || userData.displayName,
                role: userData.role || 'user',
                profile: userData
              });
            } else {
              // For non-demo accounts, logout immediately to prevent access
              console.log('🚫 Non-demo account without profile, logging out');
              await this.logout();
              callback(null);
            }
          }
        } catch (error) {
          console.error('❌ Error in auth state listener:', error);
          // On error, logout user to be safe
          await this.logout();
          callback(null);
        }
      } else {
        console.log('👤 No authenticated user');
        callback(null);
      }
    });
  }

  // Create demo accounts manually - ONLY IN DEVELOPMENT
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
      
      // Don't auto-login after creating accounts
      console.log('ℹ️ Demo accounts created, please login manually');
      
    } catch (error) {
      console.error('❌ Error creating demo accounts:', error);
    }
  }

  // Clear any existing auth state - force logout
  static async clearAuthState() {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        console.log('🧹 Clearing existing auth state for:', currentUser.email);
        await signOut(auth);
      }
      console.log('✅ Auth state cleared');
    } catch (error) {
      console.error('❌ Error clearing auth state:', error);
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