// src/components/Dashboard/DashboardRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import DashboardMain from './DashboardMain';

// Placeholder components untuk setiap modul (akan dibuat nanti)
const ProfileModule = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">👤 Profil Saya</h1>
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p>Module Profil - Coming Soon!</p>
    </div>
  </div>
);

const AttendanceModule = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">⏰ Absensi</h1>
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p>Module Absensi - Coming Soon!</p>
    </div>
  </div>
);

const LeaveModule = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">🏖️ Cuti & Izin</h1>
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p>Module Cuti & Izin - Coming Soon!</p>
    </div>
  </div>
);

const PayrollModule = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">💰 Penggajian</h1>
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p>Module Penggajian - Coming Soon!</p>
    </div>
  </div>
);

const PerformanceModule = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">📈 Penilaian Kinerja</h1>
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p>Module Penilaian Kinerja - Coming Soon!</p>
    </div>
  </div>
);

const TrainingModule = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">🎓 Pelatihan</h1>
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p>Module Pelatihan - Coming Soon!</p>
    </div>
  </div>
);

const CommunicationModule = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">💬 Komunikasi</h1>
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p>Module Komunikasi - Coming Soon!</p>
    </div>
  </div>
);

const DocumentsModule = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">📄 Dokumen</h1>
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p>Module Dokumen - Coming Soon!</p>
    </div>
  </div>
);

// Admin-only modules
const EmployeeManagementModule = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">👥 Manajemen Karyawan</h1>
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p>Module Manajemen Karyawan - Coming Soon!</p>
    </div>
  </div>
);

const AnalyticsModule = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">📊 Analytics & Reports</h1>
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p>Module Analytics - Coming Soon!</p>
    </div>
  </div>
);

const SettingsModule = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">⚙️ Pengaturan Sistem</h1>
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p>Module Settings - Coming Soon!</p>
    </div>
  </div>
);

const DashboardRoutes = ({ userRole = 'employee' }) => {
  return (
    <DashboardLayout userRole={userRole}>
      <Routes>
        {/* Main Dashboard */}
        <Route 
          path="/" 
          element={<DashboardMain userRole={userRole} />} 
        />
        
        {/* Employee Routes */}
        <Route path="/profile" element={<ProfileModule />} />
        <Route path="/attendance" element={<AttendanceModule />} />
        <Route path="/leave" element={<LeaveModule />} />
        <Route path="/payroll" element={<PayrollModule />} />
        <Route path="/performance" element={<PerformanceModule />} />
        <Route path="/training" element={<TrainingModule />} />
        <Route path="/communication" element={<CommunicationModule />} />
        <Route path="/documents" element={<DocumentsModule />} />
        
        {/* Admin Routes */}
        {userRole === 'admin' && (
          <>
            <Route path="/admin/employees" element={<EmployeeManagementModule />} />
            <Route path="/admin/analytics" element={<AnalyticsModule />} />
            <Route path="/admin/settings" element={<SettingsModule />} />
          </>
        )}
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;