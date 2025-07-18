// src/components/Dashboard/DashboardLayout.js - FIXED with Top Navigation
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children, userRole = 'employee', userEmail = '', onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Navigation items berdasarkan role
  const navigationItems = {
    employee: [
      { icon: '🏠', label: 'Dashboard', path: '/dashboard', isMain: true },
      { icon: '👤', label: 'Profil Saya', path: '/dashboard/profile' },
      { icon: '⏰', label: 'Absensi', path: '/dashboard/attendance' },
      { icon: '🏖️', label: 'Cuti & Izin', path: '/dashboard/leave' },
      { icon: '💰', label: 'Penggajian', path: '/dashboard/payroll' },
      { icon: '📈', label: 'Penilaian Kinerja', path: '/dashboard/performance' },
      { icon: '🎓', label: 'Pelatihan', path: '/dashboard/training' },
      { icon: '💬', label: 'Komunikasi', path: '/dashboard/communication' },
      { icon: '📄', label: 'Dokumen', path: '/dashboard/documents' }
    ],
    admin: [
      { icon: '🏠', label: 'Dashboard', path: '/dashboard', isMain: true },
      { icon: '👥', label: 'Manajemen Karyawan', path: '/dashboard/admin/employees' },
      { icon: '⏰', label: 'Absensi', path: '/dashboard/attendance' },
      { icon: '🏖️', label: 'Cuti & Izin', path: '/dashboard/leave' },
      { icon: '💰', label: 'Penggajian', path: '/dashboard/payroll' },
      { icon: '📈', label: 'Penilaian Kinerja', path: '/dashboard/performance' },
      { icon: '🎓', label: 'Pelatihan', path: '/dashboard/training' },
      { icon: '💬', label: 'Komunikasi', path: '/dashboard/communication' },
      { icon: '📄', label: 'Dokumen', path: '/dashboard/documents' },
      { icon: '📊', label: 'Analytics', path: '/dashboard/admin/analytics' },
      { icon: '⚙️', label: 'Settings', path: '/dashboard/admin/settings' }
    ]
  };

  const navItems = navigationItems[userRole];

  // Toggle sidebar mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside (mobile)
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    closeSidebar();
  };

  // Handle logout - call parent logout function
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Check if current path is active
  const isActivePath = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Inline styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column'
    },
    // TOP NAVIGATION STYLES - Keep original design
    topNavHeader: {
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    topNavContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      height: '4rem'
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    logoText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#2563eb'
    },
    logoSubtitle: {
      fontSize: '0.75rem',
      color: '#6b7280',
      lineHeight: '1.2',
      textAlign: 'left'
    },
    topNavMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem'
    },
    topNavButton: {
      padding: '0.5rem 1rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#64748b',
      transition: 'all 0.2s ease'
    },
    topNavButtonActive: {
      backgroundColor: '#eff6ff',
      color: '#2563eb'
    },
    topNavButtonPrimary: {
      backgroundColor: '#06b6d4',
      color: 'white',
      fontWeight: '600'
    },
    // MAIN CONTENT AREA
    mainContainer: {
      flex: 1,
      display: 'flex'
    },
    sidebar: {
      width: '16rem',
      backgroundColor: 'white',
      boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
      borderRight: '1px solid #e5e7eb',
      position: 'fixed',
      top: '4rem', // Start below top nav
      left: 0,
      height: 'calc(100vh - 4rem)',
      zIndex: 50,
      transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s ease-in-out'
    },
    sidebarDesktop: {
      position: 'static',
      transform: 'translateX(0)',
      height: 'auto',
      flexShrink: 0
    },
    sidebarHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #e5e7eb'
    },
    dashboardTitle: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: '#111827'
    },
    closeButton: {
      padding: '0.5rem',
      borderRadius: '0.375rem',
      color: '#9ca3af',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    userInfo: {
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #e5e7eb'
    },
    userInfoContent: {
      display: 'flex',
      alignItems: 'center'
    },
    avatar: {
      width: '2.5rem',
      height: '2.5rem',
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold'
    },
    userDetails: {
      marginLeft: '0.75rem'
    },
    userName: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#111827'
    },
    userRole: {
      fontSize: '0.75rem',
      color: '#6b7280'
    },
    navigation: {
      flex: 1,
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      overflowY: 'auto'
    },
    navButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem',
      textAlign: 'left',
      borderRadius: '0.5rem',
      transition: 'all 0.2s ease',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    navButtonActive: {
      backgroundColor: '#eff6ff',
      color: '#2563eb',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      border: '1px solid #bfdbfe'
    },
    navButtonInactive: {
      color: '#374151'
    },
    navIcon: {
      fontSize: '1.125rem',
      marginRight: '0.75rem',
      transition: 'transform 0.2s ease'
    },
    navDot: {
      width: '0.375rem',
      height: '0.375rem',
      backgroundColor: '#3b82f6',
      borderRadius: '50%',
      marginLeft: 'auto'
    },
    sidebarFooter: {
      padding: '1rem',
      borderTop: '1px solid #e5e7eb'
    },
    logoutButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem',
      color: '#374151',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    overlay: {
      position: 'fixed',
      top: '4rem', // Start below top nav
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 40,
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    contentArea: {
      flex: 1,
      marginLeft: window.innerWidth >= 1024 ? '16rem' : '0',
      minHeight: 'calc(100vh - 4rem)'
    },
    pageContent: {
      height: '100%',
      overflow: 'auto'
    }
  };

  return (
    <div style={styles.container}>
      {/* TOP NAVIGATION - Keep original style */}
      <div style={styles.topNavHeader}>
        <div style={styles.topNavContent}>
          <div style={styles.logoSection}>
            <div>
              <div style={styles.logoText}>
                H<span style={{ margin: '0 -8px' }}>✈</span>NGNADIM
              </div>
              <div style={styles.logoSubtitle}>
                BANDARA<br />
                INTERNASIONAL<br />
                BATAM
              </div>
            </div>
          </div>

          <div style={styles.topNavMenu}>
            <button
              style={{
                ...styles.topNavButton,
                ...styles.topNavButtonActive
              }}
            >
              New Dashboard
            </button>
            <button style={styles.topNavButton}>
              Pusat Informasi
            </button>
            <button style={styles.topNavButton}>
              Employee
            </button>
            {userRole === 'admin' && (
              <button style={styles.topNavButton}>
                📝 Daftar Pegawai
              </button>
            )}
            <button
              onClick={handleLogout}
              style={{
                ...styles.topNavButton,
                ...styles.topNavButtonPrimary
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div style={styles.mainContainer}>
        
        {/* Sidebar */}
        <div style={window.innerWidth >= 1024 ? { ...styles.sidebar, ...styles.sidebarDesktop } : styles.sidebar}>
          
          {/* Sidebar Header */}
          <div style={styles.sidebarHeader}>
            <div style={styles.dashboardTitle}>
              📊 Dashboard Modules
            </div>
            {/* Close button mobile */}
            {window.innerWidth < 1024 && (
              <button
                onClick={closeSidebar}
                style={styles.closeButton}
                onMouseEnter={(e) => {
                  e.target.style.color = '#374151';
                  e.target.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#9ca3af';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* User Info */}
          <div style={styles.userInfo}>
            <div style={styles.userInfoContent}>
              <div style={styles.avatar}>
                {userRole === 'admin' ? 'A' : 'E'}
              </div>
              <div style={styles.userDetails}>
                <p style={styles.userName}>
                  {userEmail || (userRole === 'admin' ? 'Admin User' : 'Employee User')}
                </p>
                <p style={styles.userRole}>
                  {userRole === 'admin' ? 'Administrator' : 'Karyawan'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav style={styles.navigation}>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                style={{
                  ...styles.navButton,
                  ...(isActivePath(item.path) ? styles.navButtonActive : styles.navButtonInactive)
                }}
                onMouseEnter={(e) => {
                  if (!isActivePath(item.path)) {
                    e.target.style.backgroundColor = '#f9fafb';
                    e.target.style.color = '#111827';
                  }
                  e.target.querySelector('.nav-icon').style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  if (!isActivePath(item.path)) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#374151';
                  }
                  e.target.querySelector('.nav-icon').style.transform = 'scale(1)';
                }}
              >
                <span className="nav-icon" style={styles.navIcon}>
                  {item.icon}
                </span>
                <span style={{ fontWeight: isActivePath(item.path) ? 'bold' : '500' }}>
                  {item.label}
                </span>
                {isActivePath(item.path) && (
                  <div style={styles.navDot}></div>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div style={styles.sidebarFooter}>
            <button
              onClick={handleLogout}
              style={styles.logoutButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fef2f2';
                e.target.style.color = '#dc2626';
                e.target.querySelector('.logout-icon').style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#374151';
                e.target.querySelector('.logout-icon').style.transform = 'scale(1)';
              }}
            >
              <span className="logout-icon" style={{ ...styles.navIcon, transition: 'transform 0.2s ease' }}>
                🚪
              </span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && window.innerWidth < 1024 && (
          <div
            style={styles.overlay}
            onClick={closeSidebar}
          ></div>
        )}

        {/* Content Area */}
        <div style={styles.contentArea}>
          {/* Mobile menu button - floating */}
          {window.innerWidth < 1024 && (
            <button
              onClick={toggleSidebar}
              style={{
                position: 'fixed',
                top: '5rem',
                left: '1rem',
                zIndex: 60,
                padding: '0.75rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Page Content */}
          <main style={styles.pageContent}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;