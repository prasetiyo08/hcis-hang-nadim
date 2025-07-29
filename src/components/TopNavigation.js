// src/components/TopNavigation.js - Komponen Navbar Atas Terpisah
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './TopNavigation.css';

const TopNavigation = ({
  userRole,
  userEmail,
  isAuthenticated,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isDashboardPage = location.pathname.startsWith("/dashboard");

  // Simplified sidebar items
  const sidebarItems = {
    user: [
      { icon: "🏠", label: "Dashboard", path: "/dashboard" },
      { icon: "👤", label: "Profil Saya", path: "/dashboard/profile" },
      { icon: "📄", label: "Dokumen", path: "/dashboard/documents" },
    ],
    admin: [
      { icon: "🏠", label: "Admin Dashboard", path: "/dashboard" },
      { icon: "👤", label: "Profile Admin", path: "/dashboard/admin-profile" },
      { icon: "👥", label: "Manajemen Karyawan", path: "/dashboard/employees" },
      { icon: "📊", label: "Upload Excel", path: "/dashboard/excel-upload" },
      { icon: "⚙️", label: "Settings", path: "/dashboard/settings" },
    ],
  };

  const navItems = sidebarItems[userRole] || sidebarItems.user;

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
      <div className="top-nav-header">
        <div className="top-nav-content">
          <div className="top-logo-section">
            {isAuthenticated && (
              <button
                className="top-mobile-menu-button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title="Open Menu"
              >
                <Menu size={20} />
              </button>
            )}

            <div className="top-logo-text">
              H<span className="top-logo-plane">✈</span>NGNADIM
            </div>
            <div className="top-logo-subtitle">
              BANDARA
              <br />
              INTERNASIONAL
              <br />
              BATAM
            </div>
          </div>

          <div className="top-nav-menu">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className={`top-nav-button ${isDashboardPage ? "active" : ""}`}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => navigate("/pusat-informasi")}
                  className={`top-nav-button ${
                    location.pathname === "/pusat-informasi" ? "active" : ""
                  }`}
                >
                  Pusat Informasi
                </button>

                <button
                  onClick={() => navigate("/employee")}
                  className={`top-nav-button ${
                    location.pathname === "/employee" ? "active" : ""
                  }`}
                >
                  Employee
                </button>

                {userRole === "admin" && (
                  <>
                    <button
                      onClick={() => navigate("/registration")}
                      className={`top-nav-button ${
                        location.pathname === "/registration" ? "active" : ""
                      }`}
                    >
                      Daftar Pegawai
                    </button>
                    
                    <button
                      onClick={() => navigate("/dashboard/excel-upload")}
                      className={`top-nav-button ${
                        location.pathname === "/dashboard/excel-upload" ? "active" : ""
                      }`}
                    >
                      Upload Excel
                    </button>
                  </>
                )}
              </>
            )}

            {isAuthenticated ? (
              <button onClick={onLogout} className="top-nav-button-primary">
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="top-nav-button-primary"
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
            className={`top-dashboard-sidebar ${
              isSidebarOpen ? "top-sidebar-open" : ""
            }`}
          >
            <div className="top-sidebar-header">
              <div className="top-sidebar-title">
                {userRole === 'admin' ? 'Admin Panel' : 'Dashboard Modules'}
              </div>
              <button
                className="top-sidebar-close"
                onClick={() => setIsSidebarOpen(false)}
                title="Close Menu"
              >
                <X size={16} />
              </button>
            </div>

            <div className="top-sidebar-user">
              <div className="top-user-avatar">
                {userRole === "admin" ? "A" : "E"}
              </div>
              <div className="top-user-details">
                <div className="top-user-name">
                  {userEmail ||
                    (userRole === "admin" ? "Admin User" : "Employee User")}
                </div>
                <div className="top-user-role">
                  {userRole === "admin" ? "Administrator" : "Karyawan"}
                </div>
              </div>
            </div>

            <nav className="top-sidebar-nav">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`top-sidebar-nav-item ${
                    isActivePath(item.path) ? "active" : ""
                  }`}
                >
                  <span className="top-nav-icon">{item.icon}</span>
                  <span className="top-nav-label">{item.label}</span>
                  {isActivePath(item.path) && <div className="top-nav-dot"></div>}
                </button>
              ))}
            </nav>

            <div className="top-sidebar-footer">
              <button onClick={onLogout} className="top-sidebar-logout">
                <span className="top-nav-icon">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>

          {isSidebarOpen && (
            <div
              className="top-sidebar-overlay"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}
        </>
      )}
    </>
  );
};

export default TopNavigation;