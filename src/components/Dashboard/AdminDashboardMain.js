// src/components/Dashboard/AdminDashboardMain.js - COMPLETE FIXED VERSION
import React, { useState, useEffect } from 'react';
import AdminProfilePage from '../Profile/AdminProfilePage';
import './AdminDashboard.css';

const AdminDashboardMain = ({ userRole, userEmail }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  // Update time setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Set greeting berdasarkan waktu
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Selamat Pagi');
    else if (hour < 17) setGreeting('Selamat Siang');
    else setGreeting('Selamat Malam');

    return () => clearInterval(timer);
  }, []);

  // DEBUG: Log props yang diterima
  console.log('🔍 AdminDashboardMain props:', { userRole, userEmail });

  // FIXED: Periksa semua kondisi admin yang mungkin
  const isAdmin = userRole === 'admin' || userEmail?.includes('admin');
  
  console.log('👤 Admin check:', { userRole, isAdmin });

  // Jika admin, tampilkan dashboard admin
  if (isAdmin) {
    return (
      <div className="admin-dashboard-container">
        {/* Admin Header */}
        <div className="admin-dashboard-header">
          <div className="header-decoration"></div>
          
          <div className="header-content">
            <h1 className="admin-greeting">
              {greeting}, Administrator! 👋
            </h1>
            <p className="admin-subtitle">
              Dashboard Admin HCIS Hang Nadim - {currentTime.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <div className="admin-clock">
              {currentTime.toLocaleTimeString('id-ID')}
            </div>
            
            {/* Debug Info */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              marginTop: '10px'
            }}>
              Debug: Role = {userRole} | Email = {userEmail} | isAdmin = {String(isAdmin)}
            </div>
          </div>
        </div>

        {/* Admin Profile Management */}
        <AdminProfilePage userEmail={userEmail} />
      </div>
    );
  }

  // Jika employee atau role tidak jelas
  return (
    <div className="admin-dashboard-container">
      <div className="employee-notice">
        <h2>👤 Employee Dashboard</h2>
        <p>Fitur dashboard employee akan segera hadir!</p>
        <p>Saat ini sistem fokus pada dashboard administrator.</p>
        
        {/* Debug Info untuk Employee */}
        <div style={{
          background: '#f3f4f6',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '20px',
          fontSize: '0.9rem',
          textAlign: 'left'
        }}>
          <strong>Debug Info:</strong><br/>
          User Role: {userRole || 'undefined'}<br/>
          User Email: {userEmail || 'undefined'}<br/>
          Is Admin: {String(isAdmin)}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardMain;