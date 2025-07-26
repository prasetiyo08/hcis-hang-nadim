// src/components/Dashboard/AdminDashboardMain.js - FIXED with EmployeeListPage
import React, { useState, useEffect } from 'react';
import EmployeeListPage from '../EmployeeListPage';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboardMain = ({ userRole, userEmail }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();

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

  // FIXED: Handle navigation to Excel upload
  const handleNavigateToUpload = () => {
    console.log('📊 Navigating to Excel upload...');
    navigate('/dashboard/excel-upload');
  };

  // DEBUG: Log props yang diterima
  console.log('🔍 AdminDashboardMain props:', { userRole, userEmail });

  // FIXED: Periksa semua kondisi admin yang mungkin
  const isAdmin = userRole === 'admin' || userEmail?.includes('admin');
  
  console.log('👤 Admin check:', { userRole, isAdmin });

  return (
    <div className="admin-dashboard-container">
      {/* Admin/User Header */}
      <div className="admin-dashboard-header">
        <div className="header-decoration"></div>
        
        <div className="header-content">
          <h1 className="admin-greeting">
            {greeting}, {isAdmin ? 'Administrator' : 'User'}! 👋
          </h1>
          <p className="admin-subtitle">
            {isAdmin ? 'Dashboard Admin' : 'Dashboard Pegawai'} HCIS Hang Nadim - {currentTime.toLocaleDateString('id-ID', { 
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

      {/* FIXED: Employee List/Management with proper props */}
      <EmployeeListPage 
        userRole={userRole} 
        userEmail={userEmail}
        onNavigateToUpload={handleNavigateToUpload}
      />
    </div>
  );
};

export default AdminDashboardMain;