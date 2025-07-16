// Registration.js - Fixed with Better Error Handling
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { User, Mail, Lock, Building, UserPlus } from 'lucide-react';

const Registration = ({ userRole }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    department: '',
    position: '',
    role: 'employee',
    employeeId: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const departments = [
    'Operations',
    'Customer Service', 
    'Security',
    'Human Resources',
    'Maintenance',
    'Finance',
    'IT Support',
    'Ground Handling',
    'Air Traffic Control',
    'Management'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    console.log('🔍 Validating form data:', formData);

    if (!formData.email || !formData.password || !formData.displayName) {
      setMessage('❌ Mohon lengkapi semua field wajib (Email, Password, Nama Lengkap)');
      return false;
    }

    if (formData.password.length < 6) {
      setMessage('❌ Password minimal 6 karakter');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('❌ Konfirmasi password tidak cocok');
      return false;
    }

    if (!formData.email.includes('@hangnadim.com')) {
      setMessage('❌ Email harus menggunakan domain @hangnadim.com');
      return false;
    }

    if (!formData.department) {
      setMessage('❌ Mohon pilih departemen');
      return false;
    }

    console.log('✅ Form validation passed');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Registration form submitted');
    console.log('User Role:', userRole);
    console.log('Form Data:', formData);
    console.log('Firebase Auth:', auth);
    console.log('Firebase DB:', db);
    
    if (!validateForm()) return;
    
    if (userRole !== 'admin') {
      setMessage('❌ Hanya admin yang bisa mendaftarkan pegawai baru');
      return;
    }

    // Check Firebase connection
    if (!auth || !db) {
      setMessage('❌ Koneksi Firebase bermasalah. Coba refresh halaman.');
      console.error('Firebase not properly initialized:', { auth, db });
      return;
    }

    setLoading(true);
    setMessage('⏳ Mendaftarkan pegawai...');

    try {
      console.log('📝 Creating user with email:', formData.email);
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      console.log('✅ User created in Auth:', userCredential.user.uid);

      // Create user profile in Firestore
      const userProfile = {
        uid: userCredential.user.uid,
        email: formData.email,
        displayName: formData.displayName,
        department: formData.department,
        position: formData.position || 'Staff',
        role: formData.role,
        employeeId: formData.employeeId || `HN${Date.now()}`,
        status: 'active',
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser?.email || 'admin',
        lastLoginAt: null
      };

      console.log('📄 Creating user profile:', userProfile);

      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);

      console.log('✅ User profile created in Firestore');

      setMessage(`✅ Pegawai ${formData.displayName} berhasil didaftarkan!`);
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        department: '',
        position: '',
        role: 'employee',
        employeeId: ''
      });

      // Show success for 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);

    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Gagal mendaftarkan pegawai';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email sudah terdaftar dalam sistem';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password terlalu lemah (minimal 6 karakter)';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Format email tidak valid';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/Password authentication belum diaktifkan di Firebase Console';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Koneksi internet bermasalah';
          break;
        case 'permission-denied':
          errorMessage = 'Akses ditolak. Periksa Firebase Security Rules';
          break;
        default:
          errorMessage = `Error: ${error.message}`;
      }
      
      setMessage('❌ ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Only admin can access registration
  if (userRole !== 'admin') {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#dc2626', marginBottom: '15px' }}>🚫 Akses Ditolak</h2>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Hanya administrator yang dapat mendaftarkan pegawai baru.
        </p>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '10px' }}>
          User Role Anda: <strong>{userRole}</strong>
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        background: 'white', 
        borderRadius: '10px', 
        padding: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <UserPlus size={40} style={{ color: '#06b6d4', marginBottom: '10px' }} />
          <h2 style={{ color: '#1f2937', marginBottom: '8px' }}>Daftarkan Pegawai Baru</h2>
          <p style={{ color: '#6b7280' }}>Tambah pegawai ke sistem HCIS</p>
        </div>

        {/* Debug Info */}
        <div style={{
          background: '#f3f4f6',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <strong>Debug Info:</strong> User Role = {userRole} | Firebase Auth = {auth ? 'Connected' : 'Not Connected'} | Firebase DB = {db ? 'Connected' : 'Not Connected'}
        </div>

        {message && (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            background: message.includes('✅') ? '#d1fae5' : message.includes('⏳') ? '#fef3c7' : '#fee2e2',
            color: message.includes('✅') ? '#065f46' : message.includes('⏳') ? '#92400e' : '#dc2626',
            border: `1px solid ${message.includes('✅') ? '#a7f3d0' : message.includes('⏳') ? '#fde68a' : '#fecaca'}`,
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#374151', marginBottom: '15px', fontSize: '16px' }}>👤 Informasi Personal</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                Nama Lengkap <span style={{ color: 'red' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#9ca3af' 
                }} />
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Ahmad Susanto"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                  ID Pegawai
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  placeholder="HN2025001"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                  Role <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
          </div>

          {/* Work Info */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#374151', marginBottom: '15px', fontSize: '16px' }}>🏢 Informasi Pekerjaan</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                  Departemen <span style={{ color: 'red' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Building size={16} style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#9ca3af' 
                  }} />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                    required
                  >
                    <option value="">Pilih Departemen</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                  Posisi
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Senior Operator"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#374151', marginBottom: '15px', fontSize: '16px' }}>🔐 Informasi Akun</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                Email <span style={{ color: 'red' }}>*</span> (harus @hangnadim.com)
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#9ca3af' 
                }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="ahmad.susanto@hangnadim.com"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                  Password <span style={{ color: 'red' }}>*</span> (min 6 karakter)
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#9ca3af' 
                  }} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                    required
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                  Konfirmasi Password <span style={{ color: 'red' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#9ca3af' 
                  }} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Konfirmasi Password"
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(6, 182, 212, 0.3)'
            }}
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Mendaftarkan...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Daftarkan Pegawai
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;