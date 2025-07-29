// App.js - OPTIMIZED VERSION - No Auto Login, Fast Loading
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

// Components - FIXED PATHS
import PusatInformasi from "./components/PusatInformasi";
import Registration from "./components/Registration";
import AdminDashboardMain from "./components/Dashboard/AdminDashboardMain";
import AdminProfilePage from "./components/Profile/AdminProfilePage";
import ExcelEmployeeUpload from "./components/ExcelEmployeeUpload";
import TopNavigation from "./components/TopNavigation";

// Services
import { AuthService } from "./services/authService";

// Icons
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

// Styles
import "./App.css";

// ===== LOGIN COMPONENT =====
const Login = ({
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
    const success = await onLogin(e);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "grid",
          gridTemplateColumns: window.innerWidth > 768 ? "1fr 450px" : "1fr",
          gap: "60px",
          alignItems: "center",
        }}
      >
        {/* LEFT SIDE - BRANDING & HERO */}
        <div style={{ color: "white" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "white",
                letterSpacing: "-1px",
              }}
            >
              H<span style={{ color: "#06b6d4", margin: "0 -6px" }}>✈</span>
              NGNADIM
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: "500",
                borderLeft: "2px solid rgba(255, 255, 255, 0.3)",
                paddingLeft: "20px",
                lineHeight: "1.4",
              }}
            >
              BANDARA
              <br />
              INTERNASIONAL
              <br />
              BATAM
            </div>
          </div>

          <h1
            style={{
              fontSize: window.innerWidth > 768 ? "3.5rem" : "2.5rem",
              fontWeight: "bold",
              margin: "0 0 20px 0",
              lineHeight: "1.1",
            }}
          >
            Human Capital
            <br />
            Information System
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              opacity: "0.95",
              margin: "0 0 40px 0",
              lineHeight: "1.6",
            }}
          >
            HCIS Hang Nadim Airport - Sistem informasi untuk mengelola data
            pegawai dan operasional bandara
          </p>

          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <button
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                padding: "15px 30px",
                borderRadius: "12px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
            >
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - LOGIN FORM */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "40px",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            width: "100%",
            maxWidth: "450px",
            margin: window.innerWidth <= 768 ? "0 auto" : "0",
          }}
        >
          {/* Form Header */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div
              style={{
                fontSize: "2.2rem",
                fontWeight: "bold",
                color: "#2563eb",
                marginBottom: "15px",
                letterSpacing: "-1px",
              }}
            >
              H<span style={{ color: "#06b6d4", margin: "0 -6px" }}>✈</span>
              NGNADIM
            </div>
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: "#1f2937",
                margin: "0 0 8px 0",
              }}
            >
              Masuk ke HCIS
            </h2>
            <p
              style={{
                color: "#6b7280",
                margin: "0",
                fontSize: "0.95rem",
              }}
            >
              Human Capital Information System
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#fee2e2",
                color: "#dc2626",
                padding: "12px 16px",
                borderRadius: "12px",
                marginBottom: "20px",
                border: "1px solid #fecaca",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <span>❌</span>
              {error}
            </div>
          )}

          {/* Role Selector */}
          <div
            style={{
              display: "flex",
              marginBottom: "25px",
              background: "#f8fafc",
              borderRadius: "16px",
              padding: "6px",
              boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            <button
              type="button"
              onClick={() => setLoginForm({ ...loginForm, role: "user" })}
              style={{
                flex: "1",
                padding: "12px 16px",
                border: "none",
                borderRadius: "12px",
                background: loginForm.role === "user" ? "white" : "transparent",
                color: loginForm.role === "user" ? "#2563eb" : "#6b7280",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "0.9rem",
                boxShadow:
                  loginForm.role === "user"
                    ? "0 4px 12px rgba(37, 99, 235, 0.2)"
                    : "none",
                transform:
                  loginForm.role === "user" ? "translateY(-1px)" : "none",
              }}
            >
              <UserCheck size={18} />
              Employee
            </button>
            <button
              type="button"
              onClick={() => setLoginForm({ ...loginForm, role: "admin" })}
              style={{
                flex: "1",
                padding: "12px 16px",
                border: "none",
                borderRadius: "12px",
                background:
                  loginForm.role === "admin" ? "white" : "transparent",
                color: loginForm.role === "admin" ? "#2563eb" : "#6b7280",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "0.9rem",
                boxShadow:
                  loginForm.role === "admin"
                    ? "0 4px 12px rgba(37, 99, 235, 0.2)"
                    : "none",
                transform:
                  loginForm.role === "admin" ? "translateY(-1px)" : "none",
              }}
            >
              <Shield size={18} />
              Administrator
            </button>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <label
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Email Address
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <User
                  size={20}
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    zIndex: 1,
                  }}
                />
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
                  style={{
                    width: "100%",
                    padding: "16px 16px 16px 50px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    outline: "none",
                    boxSizing: "border-box",
                    background: "white",
                  }}
                  required
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <label
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Password
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Lock
                  size={20}
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    zIndex: 1,
                  }}
                />
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
                  style={{
                    width: "100%",
                    padding: "16px 50px 16px 50px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    outline: "none",
                    boxSizing: "border-box",
                    background: "white",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#9ca3af",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "4px",
                    zIndex: 1,
                    transition: "all 0.2s ease",
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "10px 0",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.9rem",
                  color: "#6b7280",
                  cursor: "pointer",
                  gap: "8px",
                }}
              >
                <input
                  type="checkbox"
                  style={{ width: "auto", padding: 0, margin: 0 }}
                />
                Remember me
              </label>
              <a
                href="#"
                style={{
                  fontSize: "0.9rem",
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                }}
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                background: loading
                  ? "#9ca3af"
                  : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: loading
                  ? "none"
                  : "0 4px 15px rgba(37, 99, 235, 0.4)",
                marginTop: "10px",
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
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

          {/* Demo Credentials */}
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              background: "#f8fafc",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                fontWeight: "600",
                color: "#374151",
                marginBottom: "12px",
                textAlign: "center",
                fontSize: "0.9rem",
              }}
            >
              Demo Credentials:
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => fillDemoCredentials("admin")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  color: "#374151",
                  fontWeight: "500",
                  width: "100%",
                }}
              >
                <Shield size={16} />
                Admin: admin@hangnadim.com / admin123
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials("user")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  color: "#374151",
                  fontWeight: "500",
                  width: "100%",
                }}
              >
                <UserCheck size={16} />
                User: user@hangnadim.com / user123
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

// ===== MAIN APP COMPONENT =====
const App = () => {
  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState("");

  // User state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Computed values
  const userRole = user?.role || "user";
  const userEmail = user?.email || "";

  // OPTIMIZED: Simple Firebase Auth initialization
  useEffect(() => {
    console.log("🔄 Setting up optimized Firebase Auth listener...");

    let sessionCleared = false;

    const unsubscribe = AuthService.onAuthStateChanged((userData) => {
      console.log("🔍 Auth state changed:", userData);

      if (userData && !sessionCleared) {
        // First time detect user - clear session to prevent auto-login
        console.log("🧹 Clearing persistent session to prevent auto-login");
        AuthService.logout();
        sessionCleared = true;
        setUser(null);
        setIsAuthenticated(false);
      } else if (userData && sessionCleared) {
        // User authenticated after session clear (manual login)
        setUser(userData);
        setIsAuthenticated(true);
        console.log("✅ Manual login successful:", {
          email: userData.email,
          role: userData.role,
          uid: userData.uid,
        });
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log("👤 User not authenticated");
      }

      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // OPTIMIZED: Fast login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🚀 Login process started");
    setLoading(true);
    setError("");

    try {
      console.log("📝 Login attempt:", {
        email: loginForm.email,
        role: loginForm.role,
      });

      const userData = await AuthService.login(
        loginForm.email,
        loginForm.password
      );

      console.log("✅ Login successful:", userData);

      // Direct authentication without waiting for Firebase listener
      setUser(userData);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error("❌ Login failed:", error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    console.log("🚪 Logout initiated");

    try {
      await AuthService.logout();
      setLoginForm({ email: "", password: "", role: "user" });
      setError("");
      setUser(null);
      setIsAuthenticated(false);
      console.log("✅ Logout completed");
    } catch (error) {
      console.error("❌ Logout failed:", error);
      setError("Gagal logout: " + error.message);
    }
  };

  // Fill demo credentials
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div
            className="loading-spinner"
            style={{ width: "40px", height: "40px" }}
          ></div>
          <p>Loading...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      console.log(
        "🚫 Protected route accessed without authentication, redirecting to login"
      );
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
          <p>Halaman Employee Management</p>
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
    user: user ? { email: user.email, role: user.role } : null,
  });

  // Show loading while Firebase initializes
  if (authLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: "1rem",
          background: "#f8fafc",
        }}
      >
        <div
          className="loading-spinner"
          style={{ width: "50px", height: "50px" }}
        ></div>
        <p>Initializing HCIS...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* TOP NAVIGATION */}
        <TopNavigation
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
                  <Login
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
                  <Login
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
                  <AdminDashboardMain
                    userRole={userRole}
                    userEmail={userEmail}
                  />
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

            {/* Excel Upload Route */}
            <Route
              path="/dashboard/excel-upload"
              element={
                <ProtectedRoute>
                  <div className="dashboard-content">
                    <ExcelEmployeeUpload
                      userRole={userRole}
                      userEmail={userEmail}
                    />
                  </div>
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
