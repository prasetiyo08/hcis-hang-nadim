// src/components/shared/Login.js
import React, { useState, useEffect } from 'react';
import { Building, Eye, EyeOff, LogIn, AlertCircle, User, Shield } from 'lucide-react';
import { AuthService } from '../../services/authService';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');

  // Demo credentials
  const demoCredentials = AuthService.getDemoAccounts();

  useEffect(() => {
    // Auto-fill demo credentials based on selected role
    if (selectedRole === 'admin') {
      setFormData({
        email: demoCredentials.admin.email,
        password: demoCredentials.admin.password
      });
    } else {
      setFormData({
        email: demoCredentials.user.email,
        password: demoCredentials.user.password
      });
    }
  }, [selectedRole, demoCredentials]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Email dan password harus diisi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await AuthService.login(formData.email, formData.password);
      
      // Call success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
      
      console.log('Login successful:', user);
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    const demoAccount = role === 'admin' ? demoCredentials.admin : demoCredentials.user;
    
    setFormData({
      email: demoAccount.email,
      password: demoAccount.password
    });
    
    setSelectedRole(role);
    
    // Auto-submit after setting credentials
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 100);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-transform duration-300 hover:rotate-12">
            <Building className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">HCIS System</h1>
          <p className="text-gray-600 text-sm">Human Capital Information System</p>
          <p className="text-blue-600 font-semibold mt-1">Hang Nadim Airport</p>
        </div>

        {/* Role Selector */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setSelectedRole('user')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              selectedRole === 'user'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <User size={16} />
            <span>Employee</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              selectedRole === 'admin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Shield size={16} />
            <span>Admin</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700 animate-fade-in">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 pr-12"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
              onClick={() => alert('Contact administrator for password reset')}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Login Buttons */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-4">Quick Demo Login:</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Shield size={16} />
              <span>Demo Admin Login</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('user')}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <User size={16} />
              <span>Demo Employee Login</span>
            </button>
          </div>
        </div>

        {/* Current Credentials Display */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center mb-2 font-medium">Current Demo Credentials:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">Email:</span>
              <span className="font-mono">{formData.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Password:</span>
              <span className="font-mono">{showPassword ? formData.password : '••••••'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Role:</span>
              <span className="capitalize font-medium text-blue-600">{selectedRole}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2024 Hang Nadim Airport. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;