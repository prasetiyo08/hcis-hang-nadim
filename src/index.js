// src/index.js - Fixed version
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

// Remove React.StrictMode for Firebase compatibility
// React.StrictMode causes double-rendering which can cause issues with Firebase