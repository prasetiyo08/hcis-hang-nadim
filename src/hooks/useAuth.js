// src/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import { AuthService } from '../services/authService';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      setError(null);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await AuthService.login(email, password);
      setUser(userData);
      return userData;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, role = 'user', additionalData = {}) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await AuthService.register(email, password, role, additionalData);
      setUser(userData);
      return userData;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      setUser(null);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (displayName, photoURL = null) => {
    try {
      setError(null);
      await AuthService.updateUserProfile(displayName, photoURL);
      
      // Update local user state
      setUser(prev => prev ? {
        ...prev,
        displayName,
        ...(photoURL && { photoURL })
      } : null);
      
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const sendPasswordReset = async (email) => {
    try {
      setError(null);
      await AuthService.sendPasswordReset(email);
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    // State
    user,
    loading,
    error,
    
    // Computed values
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    
    // Methods
    login,
    register,
    logout,
    updateProfile,
    sendPasswordReset,
    clearError,
    
    // User info
    userRole: user?.role || null,
    userId: user?.uid || null,
    userEmail: user?.email || null,
    userName: user?.displayName || user?.profile?.displayName || null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Higher-order component for authentication
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return <Login />;
    }
    
    return <Component {...props} />;
  };
};

// Hook for role-based access control
export const usePermissions = () => {
  const { user, isAdmin, isUser } = useAuth();
  
  const hasPermission = (requiredRole) => {
    if (!user) return false;
    
    const roleHierarchy = {
      'user': 1,
      'admin': 2
    };
    
    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  };
  
  const canAccess = (resource) => {
    if (!user) return false;
    
    const permissions = {
      // Admin only
      'employee_management': isAdmin,
      'company_info_management': isAdmin,
      'feedback_management': isAdmin,
      'user_management': isAdmin,
      'system_settings': isAdmin,
      
      // User permissions
      'profile_edit': isUser || isAdmin,
      'feedback_submit': isUser || isAdmin,
      'company_info_view': isUser || isAdmin,
      
      // Common permissions
      'dashboard': true
    };
    
    return permissions[resource] || false;
  };
  
  return {
    hasPermission,
    canAccess,
    isAdmin,
    isUser,
    userRole: user?.role
  };
};

export default useAuth;