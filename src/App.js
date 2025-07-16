// App.js - Corrected Import Paths
import React, { useState } from 'react';
import TentangHCIS from './components/TentangHCIS';        // FIXED: Direct from components
import PusatInformasi from './components/PusatInformasi';  // FIXED: Direct from components  
import Registration from './components/Registration';      // NEW: Direct from components
import { db } from './services/firebase';
import { User, Lock, Eye, EyeOff, LogIn, Shield, UserCheck } from 'lucide-react';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('employee');
  const [userEmail, setUserEmail] = useState('');
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);

  const handleInputChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setUserRole(loginForm.role === 'admin' ? 'admin' : 'employee');
      setUserEmail(loginForm.email);
      
      if (redirectAfterLogin) {
        setCurrentPage(redirectAfterLogin);
        setRedirectAfterLogin(null);
      } else {
        setCurrentPage('dashboard');
      }
      
      alert(`Login berhasil sebagai ${loginForm.role === 'admin' ? 'Administrator' : 'Employee'}`);
    }, 1500);
  };

  const fillDemoCredentials = (type) => {
    if (type === 'admin') {
      setLoginForm({
        email: 'admin@hangnadim.com',
        password: 'admin123',
        role: 'admin'
      });
    } else {
      setLoginForm({
        email: 'user@hangnadim.com',
        password: 'user123',
        role: 'user'
      });
    }
  };

  const handleProtectedNavigation = (targetPage) => {
    if (userEmail && (currentPage === 'dashboard' || currentPage === 'pusat-informasi' || currentPage === 'employee' || currentPage === 'registration')) {
      setCurrentPage(targetPage);
    } else {
      setRedirectAfterLogin(targetPage);
      setCurrentPage('login');
    }
  };

  const HangNadimLogo = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px'
    }}>
      <div className="logo-text" style={{ fontSize: '2.5rem' }}>
        H
        <span className="logo-plane" style={{ 
          position: 'relative',
          margin: '0 -8px'
        }}>
          ✈
        </span>
        NGNADIM
      </div>
    </div>
  );

  if (currentPage === 'about') {
    return <TentangHCIS 
      setCurrentPage={setCurrentPage} 
      handleProtectedNavigation={handleProtectedNavigation}
    />;
  }

  // Dashboard Area - Include Registration
  if (currentPage === 'dashboard' || currentPage === 'pusat-informasi' || currentPage === 'employee' || currentPage === 'registration') {
    return (
      <div className="main-container" style={{ background: '#f8fafc', minHeight: '100vh' }}>
        {/* Navigation Header */}
        <div className="nav-header">
          <div className="nav-content">
            <div className="logo-section">
              <div className="logo-text">
                H<span className="logo-plane">✈</span>NGNADIM
              </div>
              <div className="logo-subtitle">
                BANDARA<br/>
                INTERNASIONAL<br/>
                BATAM
              </div>
            </div>

            <div className="nav-menu">
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentPage('pusat-informasi')}
                className={`nav-button ${currentPage === 'pusat-informasi' ? 'active' : ''}`}
              >
                Pusat Informasi
              </button>
              <button 
                onClick={() => setCurrentPage('employee')}
                className={`nav-button ${currentPage === 'employee' ? 'active' : ''}`}
              >
                Employee
              </button>
              {/* REGISTRATION BUTTON - Only visible for Admin */}
              {userRole === 'admin' && (
                <button 
                  onClick={() => setCurrentPage('registration')}
                  className={`nav-button ${currentPage === 'registration' ? 'active' : ''}`}
                  style={{
                    background: currentPage === 'registration' ? '#06b6d4' : 'transparent',
                    color: currentPage === 'registration' ? 'white' : '#64748b'
                  }}
                >
                  📝 Daftar Pegawai
                </button>
              )}
              <button 
                onClick={() => {
                  setCurrentPage('login');
                  setUserRole('employee');
                  setUserEmail('');
                  setRedirectAfterLogin(null);
                  setLoginForm({ email: '', password: '', role: 'user' });
                }}
                className="nav-button-primary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ marginTop: '100px', padding: '20px' }}>
          {currentPage === 'dashboard' && (
            <div>
              <h1>Dashboard HCIS</h1>
              <p>Selamat datang, {userEmail} ({userRole})</p>
              
              <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginTop: '20px' }}>
                <h2>Fitur Available:</h2>
                <ul>
                  <li>✅ Login System</li>
                  <li>✅ Role Management (Admin/Employee)</li>
                  <li>✅ Navigation</li>
                  <li>✅ Pusat Informasi</li>
                  {userRole === 'admin' && <li>✅ Registration System (Admin Only)</li>}
                  <li>⏳ Employee Management (Coming Soon)</li>
                </ul>
              </div>
                
              {/* ADMIN QUICK ACTIONS - Here's where Registration button appears */}
              {userRole === 'admin' && (
                <div style={{ 
                  marginTop: '20px', 
                  padding: '20px', 
                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', 
                  borderRadius: '10px',
                  border: '1px solid #bfdbfe'
                }}>
                  <h3 style={{ color: '#1e40af', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    👨‍💼 Admin Quick Actions
                  </h3>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {/* REGISTRATION BUTTON */}
                    <button 
                      onClick={() => setCurrentPage('registration')}
                      style={{
                        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 10px rgba(6, 182, 212, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 10px rgba(6, 182, 212, 0.3)';
                      }}
                    >
                      👤➕ Daftar Pegawai Baru
                    </button>
                    
                    <button 
                      onClick={() => setCurrentPage('pusat-informasi')}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 10px rgba(16, 185, 129, 0.3)';
                      }}
                    >
                      📢➕ Tambah Informasi
                    </button>
                    
                    <button 
                      onClick={() => setCurrentPage('employee')}
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 10px rgba(139, 92, 246, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 10px rgba(139, 92, 246, 0.3)';
                      }}
                    >
                      👥📊 Kelola Employee
                    </button>
                  </div>
                  
                  <div style={{ 
                    marginTop: '15px', 
                    padding: '10px', 
                    background: 'rgba(59, 130, 246, 0.1)', 
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#1e40af'
                  }}>
                    💡 <strong>Tips:</strong> Sebagai admin, Anda dapat mengelola pegawai, menambah informasi perusahaan, dan mengakses semua fitur sistem.
                  </div>
                </div>
              )}

              {/* EMPLOYEE VIEW */}
              {userRole === 'employee' && (
                <div style={{ 
                  marginTop: '20px', 
                  padding: '20px', 
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', 
                  borderRadius: '10px',
                  border: '1px solid #bbf7d0'
                }}>
                  <h3 style={{ color: '#166534', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    👤 Employee Actions
                  </h3>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => setCurrentPage('pusat-informasi')}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      📢💬 Lihat & Komentari Informasi
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentPage === 'pusat-informasi' && (
            <PusatInformasi 
              userRole={userRole} 
              userEmail={userEmail} 
            />
          )}

          {currentPage === 'employee' && (
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
              <h1>Employee Management</h1>
              <p>Halaman Employee Management sedang dalam pengembangan...</p>
              <p>User: {userEmail} | Role: {userRole}</p>
            </div>
          )}

          {/* REGISTRATION PAGE */}
          {currentPage === 'registration' && (
            <Registration 
              userRole={userRole}
              userEmail={userEmail}
            />
          )}
        </div>
      </div>
    );
  }

  // Login Page (Default)
  return (
    <div className="main-container">
      
      <div className="nav-header">
        <div className="nav-content">
          <div className="logo-section">
            <div className="logo-text">
              H<span className="logo-plane">✈</span>NGNADIM
            </div>
            <div className="logo-subtitle">
              BANDARA<br/>
              INTERNASIONAL<br/>
              BATAM
            </div>
          </div>

          <div className="nav-menu">
            <span className="nav-button active">Beranda</span>
            <button 
              onClick={() => setCurrentPage('about')}
              className="nav-button"
            >
              Tentang HCIS
            </button>
            <button 
              onClick={() => handleProtectedNavigation('pusat-informasi')}
              className="nav-button"
            >
              Pusat Informasi
            </button>
            <a href="#" className="nav-button">Daftar Perusahaan</a>
            <button className="nav-button-primary">
              MASUK
            </button>
          </div>
        </div>
      </div>

      <div className="login-layout">
        
        <div className="login-left-content">
          <h1 className="login-title">
            Human Capital<br/>
            Information System
          </h1>
          <p className="login-subtitle">
            HCIS Hang Nadim Airport memberikan kesempatan bagi seluruh insan bandara 
            untuk belajar, bertumbuh, dan berkontribusi untuk Indonesia
          </p>
          <div className="login-buttons">
            <button className="btn-primary">
              Daftar Sekarang
            </button>
            <button 
              onClick={() => setCurrentPage('about')}
              className="btn-secondary"
            >
              Lihat Program
            </button>
          </div>
        </div>

        <div className="login-form-container">
          
          <HangNadimLogo />
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 className="form-title">
              Masuk ke HCIS
            </h2>
            <p className="form-subtitle">
              Human Capital Information System
            </p>
            {redirectAfterLogin && (
              <div style={{
                background: '#eff6ff',
                color: '#2563eb',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                marginTop: '10px'
              }}>
                Login untuk mengakses {redirectAfterLogin === 'pusat-informasi' ? 'Pusat Informasi' : redirectAfterLogin === 'registration' ? 'Daftar Pegawai' : redirectAfterLogin}
              </div>
            )}
          </div>

          <div className="role-selector">
            <button
              onClick={() => setLoginForm({...loginForm, role: 'user'})}
              className={`role-button ${loginForm.role === 'user' ? 'active' : ''}`}
            >
              <UserCheck size={18} />
              Employee
            </button>
            <button
              onClick={() => setLoginForm({...loginForm, role: 'admin'})}
              className={`role-button ${loginForm.role === 'admin' ? 'active' : ''}`}
            >
              <Shield size={18} />
              Administrator
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <User size={20} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="form-input"
                  autoComplete="off"
                  spellCheck="false"
                  style={{
                    paddingLeft: '55px',
                    paddingRight: '15px'
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={loginForm.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="form-input password-input"
                  autoComplete="off"
                  style={{
                    paddingLeft: '55px',
                    paddingRight: '55px'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" style={{ marginRight: '8px' }} />
                Remember me
              </label>
              <a href="#" className="forgot-link">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-button"
              style={{
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Masuk...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Masuk ke Sistem
                </>
              )}
            </button>
          </form>

          <div className="demo-credentials">
            <div className="demo-title">
              Demo Credentials:
            </div>
            <div className="demo-info" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                style={{
                  background: 'none',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  padding: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  textAlign: 'left'
                }}
              >
                👨‍💼 Admin: admin@hangnadim.com / admin123 <span style={{ color: '#06b6d4' }}>← Click to fill</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('user')}
                style={{
                  background: 'none',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  padding: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  textAlign: 'left'
                }}
              >
                👤 User: user@hangnadim.com / user123 <span style={{ color: '#06b6d4' }}>← Click to fill</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;