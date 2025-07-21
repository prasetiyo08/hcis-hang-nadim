// App.js - FINAL OPTIMIZED VERSION
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import PusatInformasi from "./components/PusatInformasi";
import Registration from "./components/Registration";
import DashboardMain from "./components/Dashboard/DashboardMain";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Shield,
  UserCheck,
} from "lucide-react";
import "./App.css";

// ===== MODULE COMPONENTS =====
const ProfileModule = () => (
  <div className="dashboard-module">
    <h1 className="module-title">👤 Profil Saya</h1>
    <div className="module-content">
      <p>Module Profil - Coming Soon!</p>
    </div>
  </div>
);

const AttendanceModule = () => (
  <div className="dashboard-module">
    <h1 className="module-title">⏰ Absensi</h1>
    <div className="module-content">
      <p>Module Absensi - Coming Soon!</p>
    </div>
  </div>
);

const LeaveModule = () => (
  <div className="dashboard-module">
    <h1 className="module-title">🏖️ Cuti & Izin</h1>
    <div className="module-content">
      <p>Module Cuti & Izin - Coming Soon!</p>
    </div>
  </div>
);

const PayrollModule = () => (
  <div className="dashboard-module">
    <h1 className="module-title">💰 Penggajian</h1>
    <div className="module-content">
      <p>Module Penggajian - Coming Soon!</p>
    </div>
  </div>
);

const PerformanceModule = () => (
  <div className="dashboard-module">
    <h1 className="module-title">📈 Penilaian Kinerja</h1>
    <div className="module-content">
      <p>Module Penilaian Kinerja - Coming Soon!</p>
    </div>
  </div>
);

const TrainingModule = () => (
  <div className="dashboard-module">
    <h1 className="module-title">🎓 Pelatihan</h1>
    <div className="module-content">
      <p>Module Pelatihan - Coming Soon!</p>
    </div>
  </div>
);

const CommunicationModule = () => (
  <div className="dashboard-module">
    <h1 className="module-title">💬 Komunikasi</h1>
    <div className="module-content">
      <p>Module Komunikasi - Coming Soon!</p>
    </div>
  </div>
);

const DocumentsModule = () => (
  <div className="dashboard-module">
    <h1 className="module-title">📄 Dokumen</h1>
    <div className="module-content">
      <p>Module Dokumen - Coming Soon!</p>
    </div>
  </div>
);

const EmployeeManagementModule = () => (
  <div className="dashboard-module">
    <h1 className="module-title">👥 Manajemen Karyawan</h1>
    <div className="module-content">
      <p>Module Manajemen Karyawan - Coming Soon!</p>
    </div>
  </div>
);

const AnalyticsModule = () => (
  <div className="dashboard-module">
    <h1 className="module-title">📊 Analytics & Reports</h1>
    <div className="module-content">
      <p>Module Analytics - Coming Soon!</p>
    </div>
  </div>
);

const SettingsModule = () => (
  <div className="dashboard-module">
    <h1 className="module-title">⚙️ Pengaturan Sistem</h1>
    <div className="module-content">
      <p>Module Settings - Coming Soon!</p>
    </div>
  </div>
);

// ===== NAVIGATION COMPONENT =====
const UnifiedNavigation = ({ userRole, userEmail, isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check if current path is dashboard related
  const isDashboardPage = location.pathname.startsWith('/dashboard');

  // Navigation items berdasarkan role untuk sidebar
  const sidebarItems = {
    employee: [
      { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
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
      { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
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

  const navItems = sidebarItems[userRole] || sidebarItems.employee;

  // Check if current path is active
  const isActivePath = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* TOP NAVIGATION */}
      <div className="nav-header">
        <div className="nav-content">
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-text">
              H<span className="logo-plane">✈</span>NGNADIM
            </div>
            <div className="logo-subtitle">
              BANDARA<br />
              INTERNASIONAL<br />
              BATAM
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="nav-menu">
            {/* Mobile menu button - only show on dashboard pages */}
            {isDashboardPage && (
              <button
                className="mobile-menu-button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            <button
              onClick={() => navigate('/')}
              className={`nav-button ${location.pathname === '/' ? 'active' : ''}`}
            >
              Beranda
            </button>

            {isAuthenticated && (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`nav-button ${isDashboardPage ? 'active' : ''}`}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => navigate('/pusat-informasi')}
                  className={`nav-button ${location.pathname === '/pusat-informasi' ? 'active' : ''}`}
                >
                  Pusat Informasi
                </button>

                <button
                  onClick={() => navigate('/employee')}
                  className={`nav-button ${location.pathname === '/employee' ? 'active' : ''}`}
                >
                  Employee
                </button>

                {userRole === 'admin' && (
                  <button
                    onClick={() => navigate('/registration')}
                    className={`nav-button ${location.pathname === '/registration' ? 'active' : ''}`}
                  >
                    📝 Daftar Pegawai
                  </button>
                )}
              </>
            )}

            {isAuthenticated ? (
              <button onClick={onLogout} className="nav-button-primary">
                Logout
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="nav-button-primary">
                MASUK
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SIDEBAR - Only show on dashboard pages */}
      {isDashboardPage && isAuthenticated && (
        <>
          {/* Sidebar */}
          <div className={`dashboard-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div className="sidebar-header">
              <div className="sidebar-title">📊 Dashboard Modules</div>
              <button
                className="sidebar-close"
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="sidebar-user">
              <div className="user-avatar">
                {userRole === 'admin' ? 'A' : 'E'}
              </div>
              <div className="user-details">
                <div className="user-name">
                  {userEmail || (userRole === 'admin' ? 'Admin User' : 'Employee User')}
                </div>
                <div className="user-role">
                  {userRole === 'admin' ? 'Administrator' : 'Karyawan'}
                </div>
              </div>
            </div>

            <nav className="sidebar-nav">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`sidebar-nav-item ${isActivePath(item.path) ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {isActivePath(item.path) && <div className="nav-dot"></div>}
                </button>
              ))}
            </nav>

            <div className="sidebar-footer">
              <button onClick={onLogout} className="sidebar-logout">
                <span className="nav-icon">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Sidebar Overlay */}
          {isSidebarOpen && (
            <div 
              className="sidebar-overlay"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}
        </>
      )}
    </>
  );
};

// ===== LOGIN PAGE COMPONENT =====
const LoginPage = ({ onLogin, loginForm, setLoginForm, loading, showPassword, setShowPassword, fillDemoCredentials }) => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔄 Login form submitted');
    
    const success = await onLogin(e);
    if (success) {
      console.log('✅ Login successful, navigating to dashboard...');
      navigate('/dashboard');
    }
  };

  return (
    <div className="main-container">
      <div className="login-layout">
        <div className="login-left-content">
          <h1 className="login-title">
            Human Capital<br />Information System
          </h1>
          <p className="login-subtitle">
            HCIS Hang Nadim Airport memberikan kesempatan bagi seluruh insan
            bandara untuk belajar, bertumbuh, dan berkontribusi untuk Indonesia
          </p>
          <div className="login-buttons">
            <button className="btn-primary">Daftar Sekarang</button>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Lihat Dashboard
            </button>
          </div>
        </div>

        <div className="login-form-container">
          <div className="logo-text" style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "20px" }}>
            H<span className="logo-plane">✈</span>NGNADIM
          </div>

          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 className="form-title">Masuk ke HCIS</h2>
            <p className="form-subtitle">Human Capital Information System</p>
          </div>

          <div className="role-selector">
            <button
              onClick={() => setLoginForm({ ...loginForm, role: "user" })}
              className={`role-button ${loginForm.role === "user" ? "active" : ""}`}
            >
              <UserCheck size={18} />
              Employee
            </button>
            <button
              onClick={() => setLoginForm({ ...loginForm, role: "admin" })}
              className={`role-button ${loginForm.role === "admin" ? "active" : ""}`}
            >
              <Shield size={18} />
              Administrator
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <User size={20} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, [e.target.name]: e.target.value})}
                  placeholder="Enter your email"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, [e.target.name]: e.target.value})}
                  placeholder="Enter your password"
                  className="form-input password-input"
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
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-button"
              style={{
                background: loading ? "#9ca3af" : "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                cursor: loading ? "not-allowed" : "pointer",
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
            <div className="demo-title">Demo Credentials:</div>
            <div className="demo-info">
              <button
                type="button"
                onClick={() => fillDemoCredentials("admin")}
                className="demo-button"
              >
                👨‍💼 Admin: admin@hangnadim.com / admin123
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials("user")}
                className="demo-button"
              >
                👤 User: user@hangnadim.com / user123
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== MAIN APP COMPONENT =====
const App = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("employee");
  const [userEmail, setUserEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    // DEVELOPMENT: Auto clear localStorage on every reload
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Development mode: Auto clearing localStorage');
      localStorage.clear();
      return;
    }

    // PRODUCTION: Normal behavior - restore from localStorage
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedRole = localStorage.getItem('userRole');
    const savedEmail = localStorage.getItem('userEmail');

    console.log('🔄 Initializing auth state:', { savedAuth, savedRole, savedEmail });

    if (savedAuth === 'true' && savedRole && savedEmail) {
      setIsAuthenticated(true);
      setUserRole(savedRole);
      setUserEmail(savedEmail);
      console.log('✅ Auth restored from localStorage');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('🚀 Login process started');
    setLoading(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('⏳ Processing login...');
        setLoading(false);
        const role = loginForm.role === "admin" ? "admin" : "employee";
        setUserRole(role);
        setUserEmail(loginForm.email);
        setIsAuthenticated(true);
        
        // Only save to localStorage in production
        if (process.env.NODE_ENV === 'production') {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', role);
          localStorage.setItem('userEmail', loginForm.email);
        }

        console.log('✅ Login successful:', { role, email: loginForm.email });
        alert(`Login berhasil sebagai ${loginForm.role === "admin" ? "Administrator" : "Employee"}`);
        
        resolve(true);
      }, 1000);
    });
  };

  const handleLogout = () => {
    console.log('🚪 Logout initiated');
    setUserRole("employee");
    setUserEmail("");
    setIsAuthenticated(false);
    setLoginForm({ email: "", password: "", role: "user" });
    
    localStorage.clear();
    
    console.log('✅ Logout completed');
  };

  const fillDemoCredentials = (type) => {
    if (type === "admin") {
      setLoginForm({
        email: "admin@hangnadim.com",
        password: "admin123",
        role: "admin",
      });
    } else {
      setLoginForm({
        email: "user@hangnadim.com",
        password: "user123",
        role: "user",
      });
    }
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      console.log('🚫 Protected route accessed without authentication, redirecting to login');
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Employee Page Component
  const EmployeePage = () => (
    <div className="dashboard-content">
      <div className="dashboard-module">
        <h1 className="module-title">Employee Management</h1>
        <div className="module-content">
          <p>Halaman Employee Management sedang dalam pengembangan...</p>
          <p>User: {userEmail} | Role: {userRole}</p>
        </div>
      </div>
    </div>
  );

  console.log('🎯 App render state:', { isAuthenticated, userRole, userEmail });

  return (
    <Router>
      <div className="App">
        {/* UNIFIED NAVIGATION */}
        <UnifiedNavigation 
          userRole={userRole}
          userEmail={userEmail}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />

        <div className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <LoginPage 
                  onLogin={handleLogin}
                  loginForm={loginForm}
                  setLoginForm={setLoginForm}
                  loading={loading}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  fillDemoCredentials={fillDemoCredentials}
                />
              } 
            />
            
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <LoginPage 
                  onLogin={handleLogin}
                  loginForm={loginForm}
                  setLoginForm={setLoginForm}
                  loading={loading}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  fillDemoCredentials={fillDemoCredentials}
                />
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardMain userRole={userRole} />
                </ProtectedRoute>
              } 
            />
            
            {/* Dashboard Module Routes */}
            <Route path="/dashboard/profile" element={<ProtectedRoute><ProfileModule /></ProtectedRoute>} />
            <Route path="/dashboard/attendance" element={<ProtectedRoute><AttendanceModule /></ProtectedRoute>} />
            <Route path="/dashboard/leave" element={<ProtectedRoute><LeaveModule /></ProtectedRoute>} />
            <Route path="/dashboard/payroll" element={<ProtectedRoute><PayrollModule /></ProtectedRoute>} />
            <Route path="/dashboard/performance" element={<ProtectedRoute><PerformanceModule /></ProtectedRoute>} />
            <Route path="/dashboard/training" element={<ProtectedRoute><TrainingModule /></ProtectedRoute>} />
            <Route path="/dashboard/communication" element={<ProtectedRoute><CommunicationModule /></ProtectedRoute>} />
            <Route path="/dashboard/documents" element={<ProtectedRoute><DocumentsModule /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route 
              path="/dashboard/admin/employees" 
              element={
                <ProtectedRoute>
                  {userRole === 'admin' ? <EmployeeManagementModule /> : <Navigate to="/dashboard" />}
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/admin/analytics" 
              element={
                <ProtectedRoute>
                  {userRole === 'admin' ? <AnalyticsModule /> : <Navigate to="/dashboard" />}
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/admin/settings" 
              element={
                <ProtectedRoute>
                  {userRole === 'admin' ? <SettingsModule /> : <Navigate to="/dashboard" />}
                </ProtectedRoute>
              } 
            />
            
            {/* Application Routes */}
            <Route 
              path="/pusat-informasi" 
              element={
                <ProtectedRoute>
                  <div className="dashboard-content">
                    <PusatInformasi userRole={userRole} userEmail={userEmail} />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employee" 
              element={
                <ProtectedRoute>
                  <EmployeePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/registration" 
              element={
                <ProtectedRoute>
                  <div className="dashboard-content">
                    <Registration userRole={userRole} userEmail={userEmail} />
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;