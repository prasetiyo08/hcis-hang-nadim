// src/components/Profile/AdminProfilePage.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { 
  updateProfile, 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential 
} from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  Users, 
  Edit3, 
  Save, 
  X, 
  Camera,
  Lock,
  Shield,
  Building,
  Briefcase,
  GraduationCap,
  Bell,
  Eye,
  Plus,
  Trash2
} from 'lucide-react';
import './AdminProfilePage.css';

const AdminProfilePage = ({ userEmail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('https://via.placeholder.com/150');
  const [activeTab, setActiveTab] = useState('personal');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  // Employee data state
  const [employeeData, setEmployeeData] = useState({
    // Data Personal
    fullName: '',
    employeeId: '',
    nik: '',
    email: userEmail || '',
    phone: '',
    address: '',
    birthDate: '',
    birthPlace: '',
    age: '',
    religion: '',
    bloodType: '',
    gender: '',
    nationality: 'Indonesia',
    
    // Data Keluarga
    maritalStatus: '',
    spouseName: '',
    spouseOccupation: '',
    spouseBirthDate: '',
    children: [],
    fatherName: '',
    motherName: '',
    emergencyContact: '',
    emergencyName: '',
    emergencyRelation: '',
    
    // Data Pekerjaan
    department: '',
    position: '',
    joinDate: '',
    employmentType: 'Permanent',
    supervisor: '',
    workLocation: '',
    salary: '',
    workShift: '',
    
    // Pendidikan
    education: [],
    
    // Pengaturan
    profileVisibility: 'public',
    notifications: {
      email: true,
      push: false,
      sms: true
    },
    
    // Metadata
    createdAt: '',
    updatedAt: ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load employee data dari Firebase
  useEffect(() => {
    loadEmployeeData();
  }, [userEmail]);

  const loadEmployeeData = async () => {
    if (!userEmail) return;
    
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'employee_details', userEmail));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setEmployeeData(prev => ({
          ...prev,
          ...data,
          email: userEmail
        }));
        
        if (data.profilePhoto) {
          setProfilePhoto(data.profilePhoto);
        }
      } else {
        // Create initial profile jika belum ada
        const initialData = {
          ...employeeData,
          email: userEmail,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'employee_details', userEmail), initialData);
        console.log('Initial employee profile created');
      }
    } catch (error) {
      console.error('Error loading employee data:', error);
      setMessage('❌ Gagal memuat data pegawai');
    } finally {
      setLoading(false);
    }
  };

  // Save employee data ke Firebase
  const handleSaveEmployee = async () => {
    setSaving(true);
    setMessage('⏳ Menyimpan data pegawai...');
    
    try {
      const updatedData = {
        ...employeeData,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(doc(db, 'employee_details', userEmail), updatedData);
      
      setMessage('✅ Data pegawai berhasil disimpan!');
      setIsEditing(false);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving employee data:', error);
      setMessage('❌ Gagal menyimpan data pegawai');
    } finally {
      setSaving(false);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('❌ Ukuran file terlalu besar (maksimal 5MB)');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target.result;
        setProfilePhoto(photoUrl);
        setEmployeeData(prev => ({
          ...prev,
          profilePhoto: photoUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate age dari birthDate
  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEmployeeData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate age ketika birthDate berubah
      if (field === 'birthDate') {
        updated.age = calculateAge(value);
      }
      
      return updated;
    });
  };

  // Add child
  const addChild = () => {
    const newChild = {
      id: Date.now(),
      name: '',
      birthDate: '',
      age: '',
      gender: '',
      education: '',
      occupation: ''
    };
    
    setEmployeeData(prev => ({
      ...prev,
      children: [...prev.children, newChild]
    }));
  };

  // Remove child
  const removeChild = (id) => {
    setEmployeeData(prev => ({
      ...prev,
      children: prev.children.filter(child => child.id !== id)
    }));
  };

  // Update child data
  const updateChild = (id, field, value) => {
    setEmployeeData(prev => ({
      ...prev,
      children: prev.children.map(child => {
        if (child.id === id) {
          const updated = { ...child, [field]: value };
          if (field === 'birthDate') {
            updated.age = calculateAge(value);
          }
          return updated;
        }
        return child;
      })
    }));
  };

  // Add education
  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      level: '',
      institution: '',
      major: '',
      year: '',
      gpa: '',
      location: ''
    };
    
    setEmployeeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  // Remove education
  const removeEducation = (id) => {
    setEmployeeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // Update education data
  const updateEducation = (id, field, value) => {
    setEmployeeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  // Tab definitions
  const tabs = [
    { id: 'personal', label: 'Data Personal', icon: User },
    { id: 'family', label: 'Data Keluarga', icon: Heart },
    { id: 'work', label: 'Data Pekerjaan', icon: Briefcase },
    { id: 'education', label: 'Pendidikan', icon: GraduationCap },
    { id: 'settings', label: 'Pengaturan', icon: Shield }
  ];

  if (loading) {
    return (
      <div className="employee-detail-loading">
        <div className="loading-spinner"></div>
        <p>Memuat data pegawai...</p>
      </div>
    );
  }

  return (
    <div className="employee-detail-container">
      {/* Header */}
      <div className="employee-detail-header">
        <h1 className="employee-detail-title">
          <div className="title-icon">
            <User size={28} />
          </div>
          Detail Pegawai
        </h1>
        <p className="employee-detail-subtitle">
          Kelola informasi lengkap data pegawai
        </p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`employee-detail-message ${
          message.includes('✅') ? 'success' : 
          message.includes('⏳') ? 'warning' : 'error'
        }`}>
          {message}
        </div>
      )}

      {/* Employee Header Card */}
      <div className="employee-detail-card">
        <div className="employee-header-content">
          <div className="employee-photo-section">
            <img
              src={profilePhoto}
              alt="Employee"
              className="employee-photo"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="photo-upload-btn"
              disabled={!isEditing}
            >
              <Camera size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
          </div>
          
          <div className="employee-info">
            <h2 className="employee-name">
              {employeeData.fullName || 'Nama Pegawai'}
            </h2>
            <p className="employee-position">
              {employeeData.position || 'Posisi'} • {employeeData.department || 'Departemen'}
            </p>
            <p className="employee-id">
              ID Pegawai: {employeeData.employeeId || '-'}
            </p>
            
            <div className="employee-badges">
              <span className="employee-badge">
                Bergabung: {employeeData.joinDate ? 
                  new Date(employeeData.joinDate).toLocaleDateString('id-ID') : 
                  'Belum diisi'
                }
              </span>
              <span className="employee-badge">
                {employeeData.employmentType}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`edit-toggle-btn ${isEditing ? 'editing' : ''}`}
          >
            {isEditing ? <X size={20} /> : <Edit3 size={20} />}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="employee-detail-tabs">
        <div className="tabs-container">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              >
                <IconComponent size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="employee-detail-content">
        {activeTab === 'personal' && (
          <div className="tab-content">
            <h3 className="section-title">
              <User size={20} />
              Informasi Personal
            </h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Nama Lengkap *</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={employeeData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Masukkan nama lengkap"
                  />
                ) : (
                  <p>{employeeData.fullName || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>ID Pegawai</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={employeeData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    placeholder="EMP001"
                  />
                ) : (
                  <p>{employeeData.employeeId || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>NIK *</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={employeeData.nik}
                    onChange={(e) => handleInputChange('nik', e.target.value)}
                    placeholder="3201234567890123"
                    maxLength={16}
                  />
                ) : (
                  <p>{employeeData.nik || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Jenis Kelamin *</label>
                {isEditing ? (
                  <select
                    value={employeeData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  >
                    <option value="">Pilih jenis kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                ) : (
                  <p>{employeeData.gender || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Tempat Lahir *</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={employeeData.birthPlace}
                    onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                    placeholder="Jakarta"
                  />
                ) : (
                  <p>{employeeData.birthPlace || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Tanggal Lahir *</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={employeeData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  />
                ) : (
                  <p>{employeeData.birthDate ? 
                    new Date(employeeData.birthDate).toLocaleDateString('id-ID') : '-'
                  }</p>
                )}
              </div>

              <div className="form-group">
                <label>Umur</label>
                <p>{employeeData.age || '-'} tahun</p>
              </div>

              <div className="form-group">
                <label>Agama *</label>
                {isEditing ? (
                  <select
                    value={employeeData.religion}
                    onChange={(e) => handleInputChange('religion', e.target.value)}
                  >
                    <option value="">Pilih agama</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                ) : (
                  <p>{employeeData.religion || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Golongan Darah</label>
                {isEditing ? (
                  <select
                    value={employeeData.bloodType}
                    onChange={(e) => handleInputChange('bloodType', e.target.value)}
                  >
                    <option value="">Pilih golongan darah</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                ) : (
                  <p>{employeeData.bloodType || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Kewarganegaraan</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={employeeData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    placeholder="Indonesia"
                  />
                ) : (
                  <p>{employeeData.nationality || '-'}</p>
                )}
              </div>

              <div className="form-group full-width">
                <label>Email</label>
                <p>{employeeData.email}</p>
              </div>

              <div className="form-group">
                <label>Nomor Telepon *</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={employeeData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+62 812-3456-7890"
                  />
                ) : (
                  <p>{employeeData.phone || '-'}</p>
                )}
              </div>

              <div className="form-group full-width">
                <label>Alamat Lengkap *</label>
                {isEditing ? (
                  <textarea
                    value={employeeData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Masukkan alamat lengkap"
                    rows={3}
                  />
                ) : (
                  <p>{employeeData.address || '-'}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'family' && (
          <div className="tab-content">
            <h3 className="section-title">
              <Heart size={20} />
              Data Keluarga
            </h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Status Pernikahan *</label>
                {isEditing ? (
                  <select
                    value={employeeData.maritalStatus}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                  >
                    <option value="">Pilih status</option>
                    <option value="Belum Menikah">Belum Menikah</option>
                    <option value="Menikah">Menikah</option>
                    <option value="Cerai">Cerai</option>
                    <option value="Janda/Duda">Janda/Duda</option>
                  </select>
                ) : (
                  <p>{employeeData.maritalStatus || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Nama Ayah</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={employeeData.fatherName}
                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    placeholder="Nama ayah"
                  />
                ) : (
                  <p>{employeeData.fatherName || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Nama Ibu</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={employeeData.motherName}
                    onChange={(e) => handleInputChange('motherName', e.target.value)}
                    placeholder="Nama ibu"
                  />
                ) : (
                  <p>{employeeData.motherName || '-'}</p>
                )}
              </div>

              {employeeData.maritalStatus === 'Menikah' && (
                <>
                  <div className="form-group">
                    <label>Nama Pasangan</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={employeeData.spouseName}
                        onChange={(e) => handleInputChange('spouseName', e.target.value)}
                        placeholder="Nama pasangan"
                      />
                    ) : (
                      <p>{employeeData.spouseName || '-'}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Pekerjaan Pasangan</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={employeeData.spouseOccupation}
                        onChange={(e) => handleInputChange('spouseOccupation', e.target.value)}
                        placeholder="Pekerjaan pasangan"
                      />
                    ) : (
                      <p>{employeeData.spouseOccupation || '-'}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Tanggal Lahir Pasangan</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={employeeData.spouseBirthDate}
                        onChange={(e) => handleInputChange('spouseBirthDate', e.target.value)}
                      />
                    ) : (
                      <p>{employeeData.spouseBirthDate ? 
                        new Date(employeeData.spouseBirthDate).toLocaleDateString('id-ID') : '-'
                      }</p>
                    )}
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Kontak Darurat *</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={employeeData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="+62 813-9876-5432"
                  />
                ) : (
                  <p>{employeeData.emergencyContact || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Nama Kontak Darurat *</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={employeeData.emergencyName}
                    onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                    placeholder="Nama kontak darurat"
                  />
                ) : (
                  <p>{employeeData.emergencyName || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Hubungan Kontak Darurat *</label>
                {isEditing ? (
                  <select
                    value={employeeData.emergencyRelation}
                    onChange={(e) => handleInputChange('emergencyRelation', e.target.value)}
                  >
                    <option value="">Pilih hubungan</option>
                    <option value="Suami">Suami</option>
                    <option value="Istri">Istri</option>
                    <option value="Ayah">Ayah</option>
                    <option value="Ibu">Ibu</option>
                    <option value="Anak">Anak</option>
                    <option value="Saudara">Saudara</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                ) : (
                  <p>{employeeData.emergencyRelation || '-'}</p>
                )}
              </div>
            </div>

            {/* Children Section */}
            <div className="children-section">
              <div className="section-header">
                <h4>Susunan Anak</h4>
                {isEditing && (
                  <button
                    type="button"
                    onClick={addChild}
                    className="add-btn"
                  >
                    <Plus size={16} />
                    Tambah Anak
                  </button>
                )}
              </div>

              {employeeData.children && employeeData.children.length > 0 ? (
                <div className="children-list">
                  {employeeData.children.map((child, index) => (
                    <div key={child.id} className="child-card">
                      <div className="child-header">
                        <h5>Anak ke-{index + 1}</h5>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeChild(child.id)}
                            className="remove-btn"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      
                      <div className="child-form">
                        <div className="form-group">
                          <label>Nama Lengkap</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={child.name}
                              onChange={(e) => updateChild(child.id, 'name', e.target.value)}
                              placeholder="Nama anak"
                            />
                          ) : (
                            <p>{child.name || '-'}</p>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Jenis Kelamin</label>
                          {isEditing ? (
                            <select
                              value={child.gender}
                              onChange={(e) => updateChild(child.id, 'gender', e.target.value)}
                            >
                              <option value="">Pilih</option>
                              <option value="Laki-laki">Laki-laki</option>
                              <option value="Perempuan">Perempuan</option>
                            </select>
                          ) : (
                            <p>{child.gender || '-'}</p>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Tanggal Lahir</label>
                          {isEditing ? (
                            <input
                              type="date"
                              value={child.birthDate}
                              onChange={(e) => updateChild(child.id, 'birthDate', e.target.value)}
                            />
                          ) : (
                            <p>{child.birthDate ? 
                              new Date(child.birthDate).toLocaleDateString('id-ID') : '-'
                            }</p>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Umur</label>
                          <p>{child.age || '-'} tahun</p>
                        </div>

                        <div className="form-group">
                          <label>Pendidikan</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={child.education}
                              onChange={(e) => updateChild(child.id, 'education', e.target.value)}
                              placeholder="SD, SMP, SMA, dst"
                            />
                          ) : (
                            <p>{child.education || '-'}</p>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Pekerjaan</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={child.occupation}
                              onChange={(e) => updateChild(child.id, 'occupation', e.target.value)}
                              placeholder="Pelajar, Mahasiswa, dst"
                            />
                          ) : (
                            <p>{child.occupation || '-'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">Belum ada data anak</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'work' && (
          <div className="tab-content">
            <h3 className="section-title">
              <Briefcase size={20} />
              Informasi Pekerjaan
            </h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Departemen</label>
                {isEditing ? (
                  <select
                    value={employeeData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                  >
                    <option value="">Pilih departemen</option>
                    <option value="IT Department">IT Department</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Operations">Operations</option>
                    <option value="Finance">Finance</option>
                    <option value="Security">Security</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="Management">Management</option>
                    <option value="Ground Handling">Ground Handling</option>
                    <option value="Air Traffic Control">Air Traffic Control</option>
                  </select>
                ) : (
                  <p>{employeeData.department || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Posisi</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={employeeData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="Staff, Supervisor, Manager"
                  />
                ) : (
                  <p>{employeeData.position || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Tanggal Bergabung</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={employeeData.joinDate}
                    onChange={(e) => handleInputChange('joinDate', e.target.value)}
                  />
                ) : (
                  <p>{employeeData.joinDate ? 
                    new Date(employeeData.joinDate).toLocaleDateString('id-ID') : '-'
                  }</p>
                )}
              </div>

              <div className="form-group">
                <label>Status Karyawan</label>
                {isEditing ? (
                  <select
                    value={employeeData.employmentType}
                    onChange={(e) => handleInputChange('employmentType', e.target.value)}
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Intern">Intern</option>
                  </select>
                ) : (
                  <p>{employeeData.employmentType || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Atasan Langsung</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={employeeData.supervisor}
                    onChange={(e) => handleInputChange('supervisor', e.target.value)}
                    placeholder="Nama atasan langsung"
                  />
                ) : (
                  <p>{employeeData.supervisor || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Lokasi Kerja</label>
                {isEditing ? (
                  <select
                    value={employeeData.workLocation}
                    onChange={(e) => handleInputChange('workLocation', e.target.value)}
                  >
                    <option value="">Pilih lokasi</option>
                    <option value="Terminal 1">Terminal 1</option>
                    <option value="Terminal 2">Terminal 2</option>
                    <option value="Cargo Building">Cargo Building</option>
                    <option value="Admin Building">Admin Building</option>
                    <option value="Control Tower">Control Tower</option>
                    <option value="Maintenance Hangar">Maintenance Hangar</option>
                  </select>
                ) : (
                  <p>{employeeData.workLocation || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Shift Kerja</label>
                {isEditing ? (
                  <select
                    value={employeeData.workShift}
                    onChange={(e) => handleInputChange('workShift', e.target.value)}
                  >
                    <option value="">Pilih shift</option>
                    <option value="Pagi (06:00-14:00)">Pagi (06:00-14:00)</option>
                    <option value="Siang (14:00-22:00)">Siang (14:00-22:00)</option>
                    <option value="Malam (22:00-06:00)">Malam (22:00-06:00)</option>
                    <option value="Normal (08:00-17:00)">Normal (08:00-17:00)</option>
                  </select>
                ) : (
                  <p>{employeeData.workShift || '-'}</p>
                )}
              </div>

              <div className="form-group">
                <label>Gaji Pokok</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={employeeData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="5000000"
                    min="0"
                  />
                ) : (
                  <p>{employeeData.salary ? 
                    `Rp ${parseInt(employeeData.salary).toLocaleString('id-ID')}` : '-'
                  }</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="tab-content">
            <h3 className="section-title">
              <GraduationCap size={20} />
              Riwayat Pendidikan
            </h3>

            <div className="education-section">
              <div className="section-header">
                <h4>Data Pendidikan</h4>
                {isEditing && (
                  <button
                    type="button"
                    onClick={addEducation}
                    className="add-btn"
                  >
                    <GraduationCap size={16} />
                    Tambah Pendidikan
                  </button>
                )}
              </div>

              {employeeData.education && employeeData.education.length > 0 ? (
                <div className="education-list">
                  {employeeData.education.map((edu) => (
                    <div key={edu.id} className="education-card">
                      <div className="education-header">
                        <div className="education-icon">
                          <GraduationCap size={24} style={{ color: '#8b5cf6' }} />
                        </div>
                        <div className="education-info">
                          <h5>{edu.institution || 'Institusi Pendidikan'}</h5>
                          <p>{edu.level} - {edu.major}</p>
                          <span>{edu.year}</span>
                        </div>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeEducation(edu.id)}
                            className="remove-btn"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      
                      {isEditing && (
                        <div className="education-form">
                          <div className="form-group">
                            <label>Jenjang</label>
                            <select
                              value={edu.level}
                              onChange={(e) => updateEducation(edu.id, 'level', e.target.value)}
                            >
                              <option value="">Pilih jenjang</option>
                              <option value="SD">SD</option>
                              <option value="SMP">SMP</option>
                              <option value="SMA/SMK">SMA/SMK</option>
                              <option value="D3">D3</option>
                              <option value="S1">S1</option>
                              <option value="S2">S2</option>
                              <option value="S3">S3</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Nama Institusi</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                              placeholder="Universitas Indonesia"
                            />
                          </div>

                          <div className="form-group">
                            <label>Jurusan/Program Studi</label>
                            <input
                              type="text"
                              value={edu.major}
                              onChange={(e) => updateEducation(edu.id, 'major', e.target.value)}
                              placeholder="Teknik Informatika"
                            />
                          </div>

                          <div className="form-group">
                            <label>Tahun</label>
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                              placeholder="2015-2019"
                            />
                          </div>

                          <div className="form-group">
                            <label>IPK/Nilai</label>
                            <input
                              type="text"
                              value={edu.gpa}
                              onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                              placeholder="3.75"
                            />
                          </div>

                          <div className="form-group">
                            <label>Lokasi</label>
                            <input
                              type="text"
                              value={edu.location}
                              onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                              placeholder="Jakarta"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">Belum ada data pendidikan</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-content">
            <h3 className="section-title">
              <Shield size={20} />
              Pengaturan & Keamanan
            </h3>
            
            {/* Notification Settings */}
            <div className="settings-card">
              <h4>
                <Bell size={18} />
                Pengaturan Notifikasi
              </h4>
              
              <div className="notification-settings">
                <div className="setting-item">
                  <div className="setting-info">
                    <h5>Email Notifications</h5>
                    <p>Terima notifikasi melalui email</p>
                  </div>
                  <div 
                    className={`toggle-switch ${employeeData.notifications?.email ? 'active' : ''}`}
                    onClick={() => handleInputChange('notifications', {
                      ...employeeData.notifications,
                      email: !employeeData.notifications?.email
                    })}
                  >
                    <div className="toggle-slider"></div>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h5>Push Notifications</h5>
                    <p>Notifikasi push di browser</p>
                  </div>
                  <div 
                    className={`toggle-switch ${employeeData.notifications?.push ? 'active' : ''}`}
                    onClick={() => handleInputChange('notifications', {
                      ...employeeData.notifications,
                      push: !employeeData.notifications?.push
                    })}
                  >
                    <div className="toggle-slider"></div>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h5>SMS Notifications</h5>
                    <p>Notifikasi penting via SMS</p>
                  </div>
                  <div 
                    className={`toggle-switch ${employeeData.notifications?.sms ? 'active' : ''}`}
                    onClick={() => handleInputChange('notifications', {
                      ...employeeData.notifications,
                      sms: !employeeData.notifications?.sms
                    })}
                  >
                    <div className="toggle-slider"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="settings-card">
              <h4>
                <Eye size={18} />
                Pengaturan Privasi
              </h4>
              
              <div className="privacy-settings">
                <div className="form-group">
                  <label>Visibilitas Profil</label>
                  <select
                    value={employeeData.profileVisibility}
                    onChange={(e) => handleInputChange('profileVisibility', e.target.value)}
                  >
                    <option value="public">Publik (Semua karyawan dapat melihat)</option>
                    <option value="limited">Terbatas (Hanya departemen yang sama)</option>
                    <option value="private">Privat (Hanya atasan langsung)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="employee-detail-actions">
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              loadEmployeeData(); // Reset data
            }}
            className="cancel-btn"
          >
            <X size={16} />
            Batal
          </button>
          
          <button
            type="button"
            onClick={handleSaveEmployee}
            disabled={saving}
            className="save-btn"
          >
            {saving ? (
              <>
                <div className="loading-spinner-small"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={16} />
                Simpan Data Pegawai
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProfilePage;