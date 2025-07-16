// src/components/shared/LoadingSpinner.js
import React from 'react';
import { Building } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'large', 
  message = 'Loading...', 
  showLogo = true,
  fullScreen = true 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen bg-gray-100 flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Logo */}
        {showLogo && (
          <div className="mb-6 flex justify-center">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center animate-pulse">
              <Building className="w-10 h-10 text-blue-600" />
            </div>
          </div>
        )}
        
        {/* Spinner */}
        <div className="flex justify-center mb-4">
          <div 
            className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 ${sizeClasses[size]}`}
          ></div>
        </div>
        
        {/* Message */}
        <p className="text-gray-600 font-medium">{message}</p>
        
        {/* Sub message for full screen loader */}
        {fullScreen && (
          <p className="text-sm text-gray-500 mt-2">Please wait a moment...</p>
        )}
        
        {/* Loading dots animation */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
};

// Inline spinner for buttons and small components
export const InlineSpinner = ({ size = 'small', className = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-white ${sizeClasses[size]} ${className}`}></div>
  );
};

// Overlay spinner for modals and forms
export const OverlaySpinner = ({ message = 'Processing...', show = false }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
        <p className="text-gray-700 font-medium">{message}</p>
        <p className="text-sm text-gray-500 mt-2">Please do not close this window</p>
      </div>
    </div>
  );
};

// Skeleton loader for content
export const SkeletonLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className={`h-4 bg-gray-200 rounded mb-2 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  );
};

export default LoadingSpinner;