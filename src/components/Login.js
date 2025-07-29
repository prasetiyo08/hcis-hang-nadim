// src/components/Login/Login.js - FINAL VERSION
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Shield,
  UserCheck,
} from "lucide-react";
import "./Login.css";

const Login = ({
  onLogin,
  loginForm,
  setLoginForm,
  loading,
  showPassword,
  setShowPassword,
  fillDemoCredentials,
  error,
  isAuthenticated = false,
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
    <div className="login-container">
      <div className="login-layout">
        {/* LEFT SIDE - BRANDING */}
        <div className="login-left-content">
          <div className="login-branding">
            <div className="login-logo">
              H<span className="logo-plane">✈</span>NGNADIM
            </div>
            <div className="login-subtitle-small">
              BANDARA
              <br />
              INTERNASIONAL
              <br />
              BATAM
            </div>
          </div>

          <div className="login-hero">
            <div className="login-title-container">
              <h1 className="login-title">
                <span className="title-line-1">Human Capital</span>
                <span className="title-line-2">Information System</span>
              </h1>
              <div className="login-subtitle-container">
                <p className="login-subtitle-main">
                  HCIS Hang Nadim Airport
                </p>
                <p className="login-subtitle-desc">
                  Sistem informasi terintegrasi untuk mengelola data pegawai dan operasional bandara internasional
                </p>
              </div>
            </div>
            
            <div className="login-buttons">
              <button 
                className="btn-primary"
                onClick={() => {
                  // Add smooth scroll effect to form
                  const formContainer = document.querySelector('.login-form-container');
                  if (formContainer) {
                    formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
              >
                Pelajari Lebih Lanjut
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate("/dashboard");
                  } else {
                    // Focus on email input
                    const emailInput = document.querySelector('input[name="email"]');
                    if (emailInput) {
                      emailInput.focus();
                    }
                  }
                }}
              >
                {isAuthenticated ? "Lihat Dashboard" : "Langsung Masuk"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - LOGIN FORM */}
        <div className="login-right-content">
          <div className="login-form-container">
            {/* Form Header */}
            <div className="login-form-header">
              <div className="form-logo">
                H<span className="logo-plane">✈</span>NGNADIM
              </div>
              <h2 className="form-title">Masuk ke HCIS</h2>
              <p className="form-subtitle">Human Capital Information System</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {error}
              </div>
            )}

            {/* Role Selector */}
            <div className="role-selector">
              <button
                type="button"
                onClick={() => setLoginForm({ ...loginForm, role: "user" })}
                className={`role-button ${
                  loginForm.role === "user" ? "active" : ""
                }`}
              >
                <UserCheck size={18} />
                Employee
              </button>
              <button
                type="button"
                onClick={() => setLoginForm({ ...loginForm, role: "admin" })}
                className={`role-button ${
                  loginForm.role === "admin" ? "active" : ""
                }`}
              >
                <Shield size={18} />
                Administrator
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form">
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

            {/* Demo Credentials */}
            <div className="demo-credentials">
              <div className="demo-title">Demo Credentials:</div>
              <div className="demo-info">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("admin")}
                  className="demo-button"
                >
                  <Shield size={16} />
                  Admin: admin@hangnadim.com / admin123
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("user")}
                  className="demo-button"
                >
                  <UserCheck size={16} />
                  User: user@hangnadim.com / user123
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;