// src/components/Dashboard/DashboardMain.js - FINAL RENOVATED VERSION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardMain = ({ userRole = 'employee' }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  // Update time setiap detik - ALL PRESERVED
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

  // Module definitions berdasarkan role - ALL PRESERVED
  const employeeModules = [
    {
      id: 'profile',
      title: 'Profil Saya',
      description: 'Kelola data pribadi dan informasi karyawan',
      icon: '👤',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      path: '/dashboard/profile',
      stats: { label: 'Profil Lengkap', value: '95%' }
    },
    {
      id: 'attendance',
      title: 'Absensi',
      description: 'Clock in/out dan riwayat kehadiran',
      icon: '⏰',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      path: '/dashboard/attendance',
      stats: { label: 'Hadir Bulan Ini', value: '22/23' }
    },
    {
      id: 'leave',
      title: 'Cuti & Izin',
      description: 'Pengajuan cuti dan tracking izin',
      icon: '🏖️',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      path: '/dashboard/leave',
      stats: { label: 'Sisa Cuti', value: '8 hari' }
    },
    {
      id: 'payroll',
      title: 'Penggajian',
      description: 'Slip gaji dan informasi payroll',
      icon: '💰',
      gradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
      path: '/dashboard/payroll',
      stats: { label: 'Gaji Bulan Ini', value: 'Processed' }
    },
    {
      id: 'performance',
      title: 'Penilaian Kinerja',
      description: 'KPI dan evaluasi performance',
      icon: '📈',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      path: '/dashboard/performance',
      stats: { label: 'Score Rata-rata', value: '4.2/5' }
    },
    {
      id: 'training',
      title: 'Pelatihan',
      description: 'Program training dan pengembangan',
      icon: '🎓',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      path: '/dashboard/training',
      stats: { label: 'Pelatihan Aktif', value: '3 kursus' }
    },
    {
      id: 'communication',
      title: 'Komunikasi',
      description: 'Pesan internal dan pengumuman',
      icon: '💬',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      path: '/dashboard/communication',
      stats: { label: 'Pesan Baru', value: '5' }
    },
    {
      id: 'documents',
      title: 'Dokumen',
      description: 'Manajemen dokumen pribadi',
      icon: '📄',
      gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      path: '/dashboard/documents',
      stats: { label: 'Dokumen', value: '12 files' }
    }
  ];

  const adminModules = [
    ...employeeModules,
    {
      id: 'employee-management',
      title: 'Manajemen Karyawan',
      description: 'Kelola data dan informasi seluruh karyawan',
      icon: '👥',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      path: '/dashboard/admin/employees',
      stats: { label: 'Total Karyawan', value: '247' }
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      description: 'Dashboard analitik dan laporan',
      icon: '📊',
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
      path: '/dashboard/admin/analytics',
      stats: { label: 'Reports', value: '15 aktif' }
    },
    {
      id: 'settings',
      title: 'Pengaturan Sistem',
      description: 'Konfigurasi dan pengaturan aplikasi',
      icon: '⚙️',
      gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      path: '/dashboard/admin/settings',
      stats: { label: 'Sistem', value: 'Online' }
    }
  ];

  const modules = userRole === 'admin' ? adminModules : employeeModules;

  // Quick stats data - ALL PRESERVED
  const quickStats = [
    {
      title: 'Kehadiran Hari Ini',
      value: userRole === 'admin' ? '234/247' : 'Hadir',
      icon: '✅',
      bgColor: '#dcfce7',
      textColor: '#166534'
    },
    {
      title: 'Pending Approval',
      value: userRole === 'admin' ? '12' : '1',
      icon: '⏳',
      bgColor: '#fef3c7',
      textColor: '#92400e'
    },
    {
      title: 'Notifikasi Baru',
      value: '5',
      icon: '🔔',
      bgColor: '#dbeafe',
      textColor: '#1e40af'
    },
    {
      title: 'Aktivitas Hari Ini',
      value: userRole === 'admin' ? '156' : '8',
      icon: '📈',
      bgColor: '#e9d5ff',
      textColor: '#6b21a8'
    }
  ];

  const handleModuleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-main">
      {/* Header Section - RENOVATED but functions preserved */}
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="dashboard-greeting">
              {greeting}! 👋
            </h1>
            <p className="dashboard-subtitle">
              {userRole === 'admin' ? 'Admin Dashboard' : 'Employee Portal'} - 
              {currentTime.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="dashboard-time">
            {currentTime.toLocaleTimeString('id-ID')}
          </div>
        </div>
      </div>

      {/* Quick Stats - ALL PRESERVED with renovated styling */}
      <div className="quick-stats-grid">
        {quickStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-content">
              <div>
                <p className="stat-title">{stat.title}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
              <div className="stat-icon" style={{
                backgroundColor: stat.bgColor,
                color: stat.textColor
              }}>
                <span>{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modules Grid - ALL PRESERVED with renovated styling */}
      <div>
        <h2 className="modules-title">
          {userRole === 'admin' ? 'Modul Administrasi' : 'Modul Karyawan'}
        </h2>
        <div className="modules-grid">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => handleModuleClick(module.path)}
              className="module-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02) translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px 0 rgba(0, 0, 0, 0.15)';
                const arrow = e.currentTarget.querySelector('.arrow');
                if (arrow) arrow.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                const arrow = e.currentTarget.querySelector('.arrow');
                if (arrow) arrow.style.transform = 'translateX(0)';
              }}
            >
              {/* Card Header dengan Gradient - ALL PRESERVED */}
              <div className="module-header" style={{
                background: module.gradient
              }}>
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div className="module-icon">{module.icon}</div>
                  <h3 className="module-title">{module.title}</h3>
                  <p className="module-description">{module.description}</p>
                </div>
                {/* Background icon - ALL PRESERVED */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  opacity: 0.1,
                  transform: 'rotate(12deg) translate(16px, -16px)',
                  fontSize: '4rem'
                }}>
                  {module.icon}
                </div>
              </div>
              
              {/* Card Body - ALL PRESERVED */}
              <div className="module-body">
                <div className="module-stats">
                  <div>
                    <p className="module-stats-label">{module.stats.label}</p>
                    <p className="module-stats-value">{module.stats.value}</p>
                  </div>
                  <div className="arrow" style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    color: '#9ca3af',
                    transition: 'transform 0.2s ease'
                  }}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities Section - ALL PRESERVED with renovated styling */}
      <div className="activities-grid">
        {/* Recent Activities */}
        <div className="activity-card">
          <h3 className="activity-title">Aktivitas Terbaru</h3>
          <div className="activity-list">
            {[
              { icon: '⏰', text: 'Clock in pukul 08:15', time: '2 menit lalu', color: '#059669' },
              { icon: '📄', text: 'Dokumen kontrak diupload', time: '1 jam lalu', color: '#2563eb' },
              { icon: '🏖️', text: 'Pengajuan cuti disetujui', time: '3 jam lalu', color: '#d97706' },
              { icon: '💬', text: 'Pesan baru dari HR', time: '5 jam lalu', color: '#db2777' }
            ].map((activity, index) => (
              <div 
                key={index} 
                className="activity-item"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="activity-icon" style={{
                  color: activity.color
                }}>
                  {activity.icon}
                </div>
                <div className="activity-text">
                  <p className="activity-main-text">{activity.text}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions - ALL PRESERVED with renovated styling */}
        <div className="activity-card">
          <h3 className="activity-title">Quick Actions</h3>
          <div className="quick-actions-grid">
            {[
              { icon: '⏰', label: 'Clock In/Out', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
              { icon: '🏖️', label: 'Ajukan Cuti', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
              { icon: '📄', label: 'Upload Dokumen', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
              { icon: '💬', label: 'Pesan HR', gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' }
            ].map((action, index) => (
              <button
                key={index}
                className="quick-action-button"
                style={{
                  background: action.gradient
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px 0 rgba(0, 0, 0, 0.1)';
                }}
              >
                <div className="quick-action-icon">{action.icon}</div>
                <div className="quick-action-label">{action.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Admin Stats Summary - PRESERVED for admin only */}
        {userRole === 'admin' && (
          <div className="activity-card">
            <h3 className="activity-title">📊 Ringkasan Sistem</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Total Karyawan', value: '247 orang', icon: '👥', color: '#059669' },
                { label: 'Hadir Hari Ini', value: '234 (94.7%)', icon: '✅', color: '#0891b2' },
                { label: 'Pending Approval', value: '12 item', icon: '⏳', color: '#d97706' },
                { label: 'Sistem Status', value: 'Online', icon: '🟢', color: '#059669' }
              ].map((stat, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  backgroundColor: '#f8fafc',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                >
                  <div style={{
                    fontSize: '1.25rem',
                    color: stat.color
                  }}>
                    {stat.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#111827',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      {stat.label}
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Employee Personal Stats - PRESERVED for employee only */}
        {userRole === 'employee' && (
          <div className="activity-card">
            <h3 className="activity-title">📊 Statistik Personal</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Kehadiran Bulan Ini', value: '22/23 hari', percentage: '95.7%', color: '#059669' },
                { label: 'Overtime Bulan Ini', value: '8 jam', percentage: '40%', color: '#0891b2' },
                { label: 'Sisa Cuti Tahunan', value: '8 hari', percentage: '67%', color: '#d97706' },
                { label: 'Pelatihan Selesai', value: '3/4 kursus', percentage: '75%', color: '#7c3aed' }
              ].map((stat, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  backgroundColor: '#f8fafc',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                >
                  <div>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#111827',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      {stat.label}
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {stat.value}
                    </p>
                  </div>
                  <div style={{
                    color: stat.color,
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}>
                    {stat.percentage}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardMain;