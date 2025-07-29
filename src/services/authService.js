// src/services/authService.js - OPTIMIZED FOR FAST LOGIN
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

  // OPTIMIZED LOGIN - Fast and efficient
  static async login(email, password) {
    try {
      console.log('🔐 Starting optimized login for:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ Firebase Auth successful');
      
      // Fast profile loading with fallback
      let userData = null;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          userData = userDoc.data();
          console.log('✅ User profile loaded');
        } else {
          // Quick profile creation for demo accounts
          userData = await this.createQuickProfile(user, email);
          console.log('✅ Quick profile created');
        }
      } catch (firestoreError) {
        console.warn('⚠️ Using fallback profile data');
        // Quick fallback
        userData = this.getFallbackProfile(email);
      }
      
      // Async update last login (don't wait for it)
      this.updateLastLoginAsync(user.uid);
      
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || userData.displayName,
        role: userData.role || 'user',
        profile: userData
      };
      
      console.log('✅ Optimized login completed in minimal time');
      return userProfile;
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw this.handleAuthError(error);
    }
  }

  // Quick profile creation for demo accounts
  static async createQuickProfile(user, email) {
    const demoAccounts = this.getDemoAccounts();
    let userData = this.getFallbackProfile(email);
    
    // Only create for demo accounts
    if (email === demoAccounts.admin.email || email === demoAccounts.user.email) {
      try {
        userData.createdAt = serverTimestamp();
        userData.updatedAt = serverTimestamp();
        userData.lastLoginAt = null;
        
        // Fire and forget - don't wait
        setDoc(doc(db, 'users', user.uid), userData);
        console.log('✅ Demo profile creation initiated');
      } catch (error) {
        console.warn('⚠️ Profile creation failed, using fallback');
      }
    }
    
    return userData;
  }

  // Fast fallback profile data
  static getFallbackProfile(email) {
    const demoAccounts = this.getDemoAccounts();
    
    if (email === demoAccounts.admin.email) {
      return {
        email: email,
        role: 'admin',
        displayName: demoAccounts.admin.displayName,
        department: 'IT',
        position: 'System Administrator',
        status: 'active'
      };
    } else if (email === demoAccounts.user.email) {
      return {
        email: email,
        role: 'user', 
        displayName: demoAccounts.user.displayName,
        department: 'Human Resources',
        position: 'Employee',
        status: 'active'
      };
    } else {
      return {
        email: email,
        role: 'user',
        displayName: 'User',
        status: 'active'
      };
    }
  }

  // Async last login update (don't block login)
  static updateLastLoginAsync(uid) {
    updateDoc(doc(db, 'users', uid), {
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }).catch(error => {
      console.warn('⚠️ Last login update failed:', error.message);
    });
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

  // Fast logout
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

  // OPTIMIZED AUTH STATE LISTENER
  static onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          console.log('🔍 Auth state changed - user found:', user.email);
          
          // Fast profile fetch with timeout
          const profilePromise = getDoc(doc(db, 'users', user.uid));
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
          );
          
          try {
            const userDoc = await Promise.race([profilePromise, timeoutPromise]);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              console.log('✅ User profile loaded quickly');
              callback({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || userData.displayName,
                role: userData.role || 'user',
                profile: userData
              });
            } else {
              // Use fallback profile
              const fallbackData = this.getFallbackProfile(user.email);
              console.log('ℹ️ Using fallback profile data');
              callback({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || fallbackData.displayName,
                role: fallbackData.role || 'user',
                profile: fallbackData
              });
            }
          } catch (error) {
            console.warn('⚠️ Profile fetch failed, using fallback');
            const fallbackData = this.getFallbackProfile(user.email);
            callback({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || fallbackData.displayName,
              role: fallbackData.role || 'user',
              profile: fallbackData
            });
          }
        } catch (error) {
          console.error('❌ Error in auth state listener:', error);
          callback(null);
        }
      } else {
        console.log('👤 No authenticated user');
        callback(null);
      }
    });
  }

  // Quick demo accounts creation
  static async createDemoAccounts() {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('⚠️ Demo accounts can only be created in development mode');
      return;
    }

    const demoAccounts = this.getDemoAccounts();
    
    try {
      console.log('🔧 Creating demo accounts quickly...');
      
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
      
      console.log('ℹ️ Demo accounts ready');
      
    } catch (error) {
      console.error('❌ Error creating demo accounts:', error);
    }
  }

  // Quick session validation
  static async quickValidateSession() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { valid: false, reason: 'No user session' };
      }

      // Quick validation with fallback
      return { 
        valid: true, 
        user: {
          uid: currentUser.uid,
          email: currentUser.email,
          role: 'user', // Default role for quick validation
          profile: this.getFallbackProfile(currentUser.email)
        }
      };
    } catch (error) {
      console.error('❌ Quick session validation failed:', error);
      return { valid: false, reason: 'Session validation error' };
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