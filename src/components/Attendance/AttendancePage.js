import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  PlayCircle, 
  StopCircle, 
  Coffee, 
  TrendingUp,
  Timer,
  Activity,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';

const AttendancePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('clock');
  const [attendanceStatus, setAttendanceStatus] = useState('out'); // 'in', 'break', 'out'
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [attendanceData, setAttendanceData] = useState({
    clockIn: null,
    clockOut: null,
    breakStart: null,
    breakEnd: null
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    const now = new Date();
    setAttendanceData({
      ...attendanceData,
      clockIn: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    });
    setAttendanceStatus('in');
  };

  const handleClockOut = () => {
    const now = new Date();
    setAttendanceData({
      ...attendanceData,
      clockOut: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    });
    setAttendanceStatus('out');
  };

  const handleBreakStart = () => {
    const now = new Date();
    setAttendanceData({
      ...attendanceData,
      breakStart: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    });
    setAttendanceStatus('break');
  };

  const handleBreakEnd = () => {
    const now = new Date();
    setAttendanceData({
      ...attendanceData,
      breakEnd: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    });
    setAttendanceStatus('in');
  };

  const monthlyStats = {
    totalPresent: 22,
    totalAbsent: 1,
    totalLate: 3,
    attendancePercentage: 95.7
  };

  const recentActivity = [
    { date: '2024-07-22', clockIn: '08:15', clockOut: '17:30', status: 'present' },
    { date: '2024-07-21', clockIn: '08:45', clockOut: '17:00', status: 'late' },
    { date: '2024-07-20', clockIn: '08:00', clockOut: '18:00', status: 'present' },
    { date: '2024-07-19', clockIn: '08:30', clockOut: '17:15', status: 'late' },
    { date: '2024-07-18', clockIn: '08:10', clockOut: '17:00', status: 'present' }
  ];

  const tabs = [
    { id: 'clock', label: 'Clock In/Out', icon: Clock },
    { id: 'history', label: 'Riwayat', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'overtime', label: 'Lembur', icon: Timer }
  ];

  const renderClockInterface = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Current Time Display */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: '20px',
        padding: '2rem',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Clock size={32} />
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
              {currentTime.toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </h2>
          </div>
          
          <p style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', opacity: 0.9 }}>
            {currentTime.toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <MapPin size={16} />
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Hang Nadim Airport, Terminal 1</span>
            <div style={{
              width: '8px',
              height: '8px',
              background: isLocationEnabled ? '#22c55e' : '#ef4444',
              borderRadius: '50%',
              marginLeft: '0.5rem'
            }}></div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: attendanceData.clockIn ? '#dcfce7' : '#f3f4f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <PlayCircle size={24} style={{ 
              color: attendanceData.clockIn ? '#10b981' : '#6b7280' 
            }} />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#111827' }}>
            Clock In
          </h3>
          <p style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            margin: 0, 
            color: attendanceData.clockIn ? '#10b981' : '#6b7280' 
          }}>
            {attendanceData.clockIn || '--:--'}
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: attendanceStatus === 'break' ? '#fef3c7' : '#f3f4f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <Coffee size={24} style={{ 
              color: attendanceStatus === 'break' ? '#f59e0b' : '#6b7280' 
            }} />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#111827' }}>
            Status
          </h3>
          <p style={{ 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            margin: 0,
            color: attendanceStatus === 'in' ? '#10b981' : 
                   attendanceStatus === 'break' ? '#f59e0b' : '#6b7280'
          }}>
            {attendanceStatus === 'in' ? 'Sedang Bekerja' :
             attendanceStatus === 'break' ? 'Istirahat' : 'Belum Clock In'}
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: attendanceData.clockOut ? '#fee2e2' : '#f3f4f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <StopCircle size={24} style={{ 
              color: attendanceData.clockOut ? '#ef4444' : '#6b7280' 
            }} />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#111827' }}>
            Clock Out
          </h3>
          <p style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            margin: 0, 
            color: attendanceData.clockOut ? '#ef4444' : '#6b7280' 
          }}>
            {attendanceData.clockOut || '--:--'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
        {attendanceStatus === 'out' && (
          <button
            onClick={handleClockIn}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1.5rem',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            <PlayCircle size={24} />
            Clock In Sekarang
          </button>
        )}

        {attendanceStatus === 'in' && (
          <>
            <button
              onClick={handleBreakStart}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '1.5rem',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Coffee size={24} />
              Mulai Istirahat
            </button>

            <button
              onClick={handleClockOut}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '1.5rem',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s ease'
              }}
            >
              <StopCircle size={24} />
              Clock Out
            </button>
          </>
        )}

        {attendanceStatus === 'break' && (
          <button
            onClick={handleBreakEnd}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1.5rem',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease'
            }}
          >
            <PlayCircle size={24} />
            Selesai Istirahat
          </button>
        )}
      </div>

      {/* Location Status */}
      <div style={{
        background: isLocationEnabled ? '#dcfce7' : '#fee2e2',
        borderRadius: '12px',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: isLocationEnabled ? '#10b981' : '#ef4444',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          {isLocationEnabled ? <MapPin size={20} /> : <AlertCircle size={20} />}
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: '500', color: '#111827' }}>
            {isLocationEnabled ? 'Lokasi Terdeteksi' : 'Lokasi Tidak Terdeteksi'}
          </h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
            {isLocationEnabled 
              ? 'Pastikan Anda berada di area kerja yang valid' 
              : 'Aktifkan GPS untuk melakukan absensi'}
          </p>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: 'bold',
          margin: 0,
          color: '#111827'
        }}>
          Riwayat Kehadiran
        </h3>
        
        <button style={{
          padding: '0.5rem 1rem',
          background: '#06b6d4',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Download size={14} />
          Export
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: '#374151' }}>
                Tanggal
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: '#374151' }}>
                Masuk
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: '#374151' }}>
                Keluar
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: '#374151' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((record, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                  {new Date(record.date).toLocaleDateString('id-ID', { 
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short'
                  })}
                </td>
                <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                  {record.clockIn}
                </td>
                <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                  {record.clockOut}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    background: record.status === 'present' ? '#dcfce7' : '#fef3c7',
                    color: record.status === 'present' ? '#166534' : '#92400e'
                  }}>
                    {record.status === 'present' ? 'Hadir' : 'Terlambat'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#111827'
      }}>
        Ringkasan Bulan Ini
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#dcfce7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.5rem auto'
          }}>
            <CheckCircle size={24} style={{ color: '#10b981' }} />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: '#10b981' }}>
            {monthlyStats.totalPresent}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>
            Hari Hadir
          </p>
        </div>

        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#fef3c7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.5rem auto'
          }}>
            <AlertCircle size={24} style={{ color: '#f59e0b' }} />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: '#f59e0b' }}>
            {monthlyStats.totalLate}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>
            Hari Terlambat
          </p>
        </div>

        <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#fee2e2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.5rem auto'
          }}>
            <XCircle size={24} style={{ color: '#ef4444' }} />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: '#ef4444' }}>
            {monthlyStats.totalAbsent}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>
            Hari Absen
          </p>
        </div>
      </div>

      {/* Attendance Percentage */}
      <div style={{
        padding: '1rem',
        background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        borderRadius: '12px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Tingkat Kehadiran</h4>
        <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
          {monthlyStats.attendancePercentage}%
        </p>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(255,255,255,0.3)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${monthlyStats.attendancePercentage}%`,
            height: '100%',
            background: 'white',
            borderRadius: '4px'
          }}></div>
        </div>
        <p style={{ fontSize: '0.9rem', margin: '0.5rem 0 0 0', opacity: 0.9 }}>
          Target: 95% - Status: Excellent!
        </p>
      </div>
    </div>
  );

  const renderOvertime = () => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#111827'
      }}>
        Manajemen Lembur
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <Timer size={24} style={{ marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>
            45:30
          </p>
          <p style={{ fontSize: '0.8rem', margin: 0, opacity: 0.9 }}>
            Total Bulan Ini
          </p>
        </div>

        <div style={{
          background: '#f8fafc',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #e5e7eb'
        }}>
          <Activity size={24} style={{ marginBottom: '0.5rem', color: '#06b6d4' }} />
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: '#111827' }}>
            8
          </p>
          <p style={{ fontSize: '0.8rem', margin: 0, color: '#6b7280' }}>
            Hari Lembur
          </p>
        </div>
      </div>

      <div style={{
        padding: '1rem',
        background: '#fef7ff',
        borderRadius: '8px',
        border: '1px solid #e9d5ff'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#7c3aed', fontSize: '0.9rem', fontWeight: '600' }}>
          📋 Ketentuan Lembur
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1rem', color: '#374151', fontSize: '0.8rem' }}>
          <li>Lembur maksimal 4 jam per hari</li>
          <li>Wajib approval dari atasan langsung</li>
          <li>Rate lembur: 1.5x gaji per jam pada hari kerja</li>
          <li>Rate lembur: 2x gaji per jam pada weekend/libur</li>
        </ul>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'clock':
        return renderClockInterface();
      case 'history':
        return renderHistory();
      case 'analytics':
        return renderAnalytics();
      case 'overtime':
        return renderOvertime();
      default:
        return renderClockInterface();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            margin: '0 0 0.5rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '12px',
              padding: '0.75rem',
              color: 'white'
            }}>
              <Clock size={24} />
            </div>
            Absensi
          </h1>
          <p style={{
            color: '#6b7280',
            margin: 0,
            fontSize: '1rem'
          }}>
            Clock in/out dan riwayat kehadiran Anda
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '0.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto'
          }}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    border: 'none',
                    borderRadius: '8px',
                    background: activeTab === tab.id ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: activeTab === tab.id ? '600' : '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <IconComponent size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;