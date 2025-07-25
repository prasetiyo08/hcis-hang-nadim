// App.js - INTEGRATED WITH FIREBASE AUTH
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import PusatInformasi from "./components/PusatInformasi";
import Registration from "./components/Registration";
import AdminDashboardMain from "./components/Dashboard/AdminDashboardMain";
import AdminProfilePage from "./components/Profile/AdminProfilePage";
import { AuthService } from "./services/authService";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Shield,
  UserCheck,
  Menu,
  X,
} from "lucide-react";
import "./App.css";

// ===== MODULE COMPONENTS =====
const ProfileModule = ({ userEmail }) => (
  <div className="dashboard-content">
    <AdminProfilePage userEmail={userEmail} />
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

const AttendanceModule = () => (
  <div className="dashboard-module">
    <h1 className="module-title">⏰ Absensi</h1>
    <div className="module-content">
      <p>Module Absensi - Coming Soon!</p>
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

// ===== UNIFIED NAVIGATION COMPONENT =====
const UnifiedNavigation = ({
  userRole,
  userEmail,
  isAuthenticated,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check if current path is dashboard related
  const isDashboardPage = location.pathname.startsWith("/dashboard");

  // Navigation items berdasarkan role untuk sidebar
  const sidebarItems = {
    user: [
      { icon: "🔵🏠", label: "Dashboard", path: "/dashboard" },
      { icon: "🔵👤", label: "Profil Saya", path: "/dashboard/profile" },
      { icon: "🔵⏰", label: "Absensi", path: "/dashboard/attendance" },
      { icon: "🔵🏖️", label: "Cuti & Izin", path: "/dashboard/leave" },
      { icon: "🔵💰", label: "Penggajian", path: "/dashboard/payroll" },
      {
        icon: "🔵📈",
        label: "Penilaian Kinerja",
        path: "/dashboard/performance",
      },
      { icon: "🔵🎓", label: "Pelatihan", path: "/dashboard/training" },
      { icon: "🔵💬", label: "Komunikasi", path: "/dashboard/communication" },
      { icon: "🔵📄", label: "Dokumen", path: "/dashboard/documents" },
    ],
    admin: [
      { icon: "🔵🏠", label: "Admin Dashboard", path: "/dashboard" },
      { icon: "🔵👤", label: "Profile Admin", path: "/dashboard/admin-profile" },
      { icon: "🔵👥", label: "Manajemen Karyawan", path: "/dashboard/employees" },
      { icon: "🔵📊", label: "Analytics", path: "/dashboard/analytics" },
      { icon: "🔵⚙️", label: "Settings", path: "/dashboard/settings" },
    ],
  };

  const navItems = sidebarItems[userRole] || sidebarItems.user;

  // Check if current path is active
  const isActivePath = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  // Auto-close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* TOP NAVIGATION */}
      <div className="nav-header">
        <div className="nav-content">
          <div className="logo-section">
            {isAuthenticated && (
              <button
                className="mobile-menu-button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{ marginRight: "15px" }}
                title="Open Menu"
              >
                <Menu size={20} />
              </button>
            )}

            <div className="logo-text">
              H<span className="logo-plane">✈</span>NGNADIM
            </div>
            <div className="logo-subtitle">
              BANDARA
              <br />
              INTERNASIONAL
              <br />
              BATAM
            </div>
          </div>

          <div className="nav-menu">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className={`nav-button ${isDashboardPage ? "active" : ""}`}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => navigate("/pusat-informasi")}
                  className={`nav-button ${
                    location.pathname === "/pusat-informasi" ? "active" : ""
                  }`}
                >
                  Pusat Informasi
                </button>

                <button
                  onClick={() => navigate("/employee")}
                  className={`nav-button ${
                    location.pathname === "/employee" ? "active" : ""
                  }`}
                >
                  Employee
                </button>

                {userRole === "admin" && (
                  <button
                    onClick={() => navigate("/registration")}
                    className={`nav-button ${
                      location.pathname === "/registration" ? "active" : ""
                    }`}
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
              <button
                onClick={() => navigate("/login")}
                className="nav-button-primary"
              >
                MASUK
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      {isAuthenticated && (
        <>
          <div
            className={`dashboard-sidebar ${
              isSidebarOpen ? "sidebar-open" : ""
            }`}
          >
            <div className="sidebar-header">
              <div className="sidebar-title">
                {userRole === 'admin' ? '🔧 Admin Panel' : '📊 Dashboard Modules'}
              </div>
              <button
                className="sidebar-close"
                onClick={() => setIsSidebarOpen(false)}
                title="Close Menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="sidebar-user">
              <div className="user-avatar">
                {userRole === "admin" ? "A" : "E"}
              </div>
              <div className="user-details">
                <div className="user-name">
                  {userEmail ||
                    (userRole === "admin" ? "Admin User" : "Employee User")}
                </div>
                <div className="user-role">
                  {userRole === "admin" ? "Administrator" : "Karyawan"}
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
                  className={`sidebar-nav-item ${
                    isActivePath(item.path) ? "active" : ""
                  }`}
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
const LoginPage = ({
  onLogin,
  loginForm,
  setLoginForm,
  loading,
  showPassword,
  setShowPassword,
  fillDemoCredentials,
  error,
}) => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔄 Login form submitted");

    const success = await onLogin(e);
    if (success) {
      console.log("✅ Login successful, navigating to dashboard...");
      navigate("/dashboard");
    }
  };

  return (
    <div className="main-container">
      <div className="login-layout">
        <div className="login-left-content">
          <h1 className="login-title">
            Human Capital
            <br />
            Information System
          </h1>
          <p className="login-subtitle">
            HCIS Hang Nadim Airport memberikan kesempatan bagi seluruh insan
            bandara untuk belajar, bertumbuh, dan berkontribusi untuk Indonesia
          </p>
          <div className="login-buttons">
            <button className="btn-primary">Daftar Sekarang</button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Lihat Dashboard
            </button>
          </div>
        </div>

        <div className="login-form-container">
          <div
            className="logo-text"
            style={{
              fontSize: "2.5rem",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            H<span className="logo-plane">✈</span>NGNADIM
          </div>

          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 className="form-title">Masuk ke HCIS</h2>
            <p className="form-subtitle">Human Capital Information System</p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #fecaca',
              fontSize: '14px'
            }}>
              ❌ {error}
            </div>
          )}

          <div className="role-selector">
            <button
              onClick={() => setLoginForm({ ...loginForm, role: "user" })}
              className={`role-button ${
                loginForm.role === "user" ? "active" : ""
              }`}
            >
              <UserCheck size={18} />
              Employee
            </button>
            <button
              onClick={() => setLoginForm({ ...loginForm, role: "admin" })}
              className={`role-button ${
                loginForm.role === "admin" ? "active" : ""
              }`}
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
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      [e.target.name]: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      [e.target.name]: e.target.value,
                    })
                  }
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
              <a href="#" className="forgot-link">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-button"
              style={{
                background: loading
                  ? "#9ca3af"
                  : "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
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
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState("");
  
  // User state from Firebase
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Computed values from user object
  const userRole = user?.role || "user";
  const userEmail = user?.email || "";

  // Initialize Firebase Auth listener
  useEffect(() => {
    console.log("🔄 Setting up Firebase Auth listener...");
    
    const unsubscribe = AuthService.onAuthStateChanged((userData) => {
      console.log("🔍 Auth state changed:", userData);
      
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        console.log("✅ User authenticated:", {
          email: userData.email,
          role: userData.role,
          uid: userData.uid
        });
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log("👤 User not authenticated");
      }
      
      setAuthLoading(false);
    });

    // Create demo accounts in development
    if (process.env.NODE_ENV === "development") {
      AuthService.createDemoAccounts().catch(error => {
        console.warn("⚠️ Demo accounts creation failed:", error);
      });
    }

    return unsubscribe;
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🚀 Login process started");
    setLoading(true);
    setError("");

    try {
      console.log("📝 Login attempt:", {
        email: loginForm.email,
        role: loginForm.role
      });

      const userData = await AuthService.login(loginForm.email, loginForm.password);
      
      console.log("✅ Login successful:", userData);
      
      // Firebase Auth listener will handle state updates
      return true;
      
    } catch (error) {
      console.error("❌ Login failed:", error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    console.log("🚪 Logout initiated");
    
    try {
      await AuthService.logout();
      setLoginForm({ email: "", password: "", role: "user" });
      setError("");
      console.log("✅ Logout completed");
    } catch (error) {
      console.error("❌ Logout failed:", error);
      setError("Gagal logout: " + error.message);
    }
  };

  const fillDemoCredentials = (type) => {
    const demoAccounts = AuthService.getDemoAccounts();
    
    if (type === "admin") {
      setLoginForm({
        email: demoAccounts.admin.email,
        password: demoAccounts.admin.password,
        role: "admin",
      });
    } else {
      setLoginForm({
        email: demoAccounts.user.email,
        password: demoAccounts.user.password,
        role: "user",
      });
    }
    setError("");
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (authLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div className="loading-spinner" style={{ width: '40px', height: '40px' }}></div>
          <p>Loading...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      console.log("🚫 Protected route accessed without authentication, redirecting to login");
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
          <p>
            User: {userEmail} | Role: {userRole}
          </p>
        </div>
      </div>
    </div>
  );

  console.log("🎯 App render state:", { 
    isAuthenticated, 
    userRole, 
    userEmail, 
    authLoading,
    user: user ? { email: user.email, role: user.role } : null 
  });

  // Show loading while Firebase initializes
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        background: '#f8fafc'
      }}>
        <div className="loading-spinner" style={{ width: '50px', height: '50px' }}></div>
        <p>Initializing HCIS...</p>
      </div>
    );
  }

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
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage
                    onLogin={handleLogin}
                    loginForm={loginForm}
                    setLoginForm={setLoginForm}
                    loading={loading}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    fillDemoCredentials={fillDemoCredentials}
                    error={error}
                  />
                )
              }
            />

            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage
                    onLogin={handleLogin}
                    loginForm={loginForm}
                    setLoginForm={setLoginForm}
                    loading={loading}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    fillDemoCredentials={fillDemoCredentials}
                    error={error}
                  />
                )
              }
            />

            {/* Protected Routes - Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboardMain userRole={userRole} userEmail={userEmail} />
                </ProtectedRoute>
              }
            />

            {/* Admin Profile Route */}
            <Route
              path="/dashboard/admin-profile"
              element={
                <ProtectedRoute>
                  <div className="dashboard-content">
                    <AdminProfilePage userEmail={userEmail} />
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Module Routes - Available for all users */}
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <ProfileModule userEmail={userEmail} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/attendance"
              element={
                <ProtectedRoute>
                  <AttendanceModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/leave"
              element={
                <ProtectedRoute>
                  <LeaveModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/payroll"
              element={
                <ProtectedRoute>
                  <PayrollModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/performance"
              element={
                <ProtectedRoute>
                  <PerformanceModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/training"
              element={
                <ProtectedRoute>
                  <TrainingModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/communication"
              element={
                <ProtectedRoute>
                  <CommunicationModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/documents"
              element={
                <ProtectedRoute>
                  <DocumentsModule />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/dashboard/employees"
              element={
                <ProtectedRoute>
                  <EmployeeManagementModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <SettingsModule />
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