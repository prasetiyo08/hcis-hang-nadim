// src/components/Dashboard/DashboardMain.js - FIXED with Inline Styles
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardMain = ({ userRole = 'employee' }) => {
  const navigate = useNavigate();
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

  // Module definitions berdasarkan role
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

  // Quick stats data
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

  // Inline styles untuk mengganti Tailwind
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '1.5rem'
    },
    header: {
      marginBottom: '2rem'
    },
    greeting: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#6b7280'
    },
    time: {
      fontSize: '1.5rem',
      fontFamily: 'monospace',
      color: '#374151',
      marginTop: '1rem'
    },
    quickStatsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '1rem',
      border: '1px solid #e5e7eb'
    },
    statCardContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    statTitle: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '0.25rem'
    },
    statValue: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#111827'
    },
    statIcon: {
      padding: '0.75rem',
      borderRadius: '0.5rem',
      fontSize: '1.25rem'
    },
    modulesTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '1.5rem'
    },
    modulesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    moduleCard: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    },
    moduleCardHover: {
      transform: 'scale(1.02)',
      boxShadow: '0 10px 25px 0 rgba(0, 0, 0, 0.15)'
    },
    moduleHeader: {
      padding: '1.5rem',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    },
    moduleIcon: {
      fontSize: '2.5rem',
      marginBottom: '0.75rem',
      display: 'block'
    },
    moduleTitle: {
      fontWeight: 'bold',
      fontSize: '1.125rem',
      marginBottom: '0.5rem'
    },
    moduleDescription: {
      fontSize: '0.875rem',
      opacity: 0.9
    },
    moduleBody: {
      padding: '1rem'
    },
    moduleStats: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    moduleStatsLabel: {
      fontSize: '0.75rem',
      color: '#6b7280',
      marginBottom: '0.25rem'
    },
    moduleStatsValue: {
      fontWeight: 'bold'
    },
    arrow: {
      width: '1.25rem',
      height: '1.25rem',
      color: '#9ca3af',
      transition: 'transform 0.2s ease'
    },
    activitiesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '1.5rem'
    },
    activityCard: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      border: '1px solid #e5e7eb'
    },
    activityTitle: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '1rem'
    },
    activityList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    activityItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      transition: 'background-color 0.2s ease'
    },
    activityItemHover: {
      backgroundColor: '#f9fafb'
    },
    activityIcon: {
      fontSize: '1.25rem'
    },
    activityText: {
      flex: 1
    },
    activityMainText: {
      fontSize: '0.875rem',
      color: '#111827'
    },
    activityTime: {
      fontSize: '0.75rem',
      color: '#6b7280'
    },
    quickActionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '0.75rem'
    },
    quickActionButton: {
      color: 'white',
      border: 'none',
      padding: '1rem',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)'
    },
    quickActionIcon: {
      fontSize: '1.5rem'
    },
    quickActionLabel: {
      fontSize: '0.875rem'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={styles.greeting}>
              {greeting}! 👋
            </h1>
            <p style={styles.subtitle}>
              {userRole === 'admin' ? 'Admin Dashboard' : 'Employee Portal'} - 
              {currentTime.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div style={styles.time}>
            {currentTime.toLocaleTimeString('id-ID')}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={styles.quickStatsGrid}>
        {quickStats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statCardContent}>
              <div>
                <p style={styles.statTitle}>{stat.title}</p>
                <p style={styles.statValue}>{stat.value}</p>
              </div>
              <div style={{
                ...styles.statIcon,
                backgroundColor: stat.bgColor,
                color: stat.textColor
              }}>
                <span>{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modules Grid */}
      <div>
        <h2 style={styles.modulesTitle}>
          {userRole === 'admin' ? 'Modul Administrasi' : 'Modul Karyawan'}
        </h2>
        <div style={styles.modulesGrid}>
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => handleModuleClick(module.path)}
              style={styles.moduleCard}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, styles.moduleCardHover);
                e.currentTarget.querySelector('.arrow').style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                e.currentTarget.querySelector('.arrow').style.transform = 'translateX(0)';
              }}
            >
              {/* Card Header dengan Gradient */}
              <div style={{
                ...styles.moduleHeader,
                background: module.gradient
              }}>
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div style={styles.moduleIcon}>{module.icon}</div>
                  <h3 style={styles.moduleTitle}>{module.title}</h3>
                  <p style={styles.moduleDescription}>{module.description}</p>
                </div>
                {/* Background icon */}
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
              
              {/* Card Body */}
              <div style={styles.moduleBody}>
                <div style={styles.moduleStats}>
                  <div>
                    <p style={styles.moduleStatsLabel}>{module.stats.label}</p>
                    <p style={styles.moduleStatsValue}>{module.stats.value}</p>
                  </div>
                  <div className="arrow" style={styles.arrow}>
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

      {/* Recent Activities Section */}
      <div style={styles.activitiesGrid}>
        {/* Recent Activities */}
        <div style={styles.activityCard}>
          <h3 style={styles.activityTitle}>Aktivitas Terbaru</h3>
          <div style={styles.activityList}>
            {[
              { icon: '⏰', text: 'Clock in pukul 08:15', time: '2 menit lalu', color: '#059669' },
              { icon: '📄', text: 'Dokumen kontrak diupload', time: '1 jam lalu', color: '#2563eb' },
              { icon: '🏖️', text: 'Pengajuan cuti disetujui', time: '3 jam lalu', color: '#d97706' },
              { icon: '💬', text: 'Pesan baru dari HR', time: '5 jam lalu', color: '#db2777' }
            ].map((activity, index) => (
              <div 
                key={index} 
                style={styles.activityItem}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.activityItemHover)}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{
                  ...styles.activityIcon,
                  color: activity.color
                }}>
                  {activity.icon}
                </div>
                <div style={styles.activityText}>
                  <p style={styles.activityMainText}>{activity.text}</p>
                  <p style={styles.activityTime}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.activityCard}>
          <h3 style={styles.activityTitle}>Quick Actions</h3>
          <div style={styles.quickActionsGrid}>
            {[
              { icon: '⏰', label: 'Clock In/Out', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
              { icon: '🏖️', label: 'Ajukan Cuti', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
              { icon: '📄', label: 'Upload Dokumen', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
              { icon: '💬', label: 'Pesan HR', gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' }
            ].map((action, index) => (
              <button
                key={index}
                style={{
                  ...styles.quickActionButton,
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
                <div style={styles.quickActionIcon}>{action.icon}</div>
                <div style={styles.quickActionLabel}>{action.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;