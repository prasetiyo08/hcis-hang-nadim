import React, { useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Upload, 
  Edit3, 
  Save, 
  X, 
  Eye,
  Download,
  Plus,
  Trash2,
  Camera,
  Heart,
  Users,
  Award,
  FileText,
  Lock,
  Bell,
  Shield
} from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('/api/placeholder/150/150');
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    fullName: 'Ahmad Susanto',
    employeeId: 'HN2024001',
    nik: '3201234567890123',
    email: 'ahmad.susanto@hangnadim.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Hang Nadim No. 123, Batam Centre, Batam',
    birthDate: '1990-05-15',
    birthPlace: 'Jakarta',
    religion: 'Islam',
    bloodType: 'A',
    maritalStatus: 'Married',
    spouseName: 'Siti Nurhaliza',
    children: '2',
    emergencyContact: '+62 813-9876-5432',
    emergencyName: 'Siti Nurhaliza (Istri)',
    department: 'Operations',
    position: 'Senior Operator',
    joinDate: '2020-01-15',
    employmentType: 'Permanent',
    supervisor: 'Budi Santoso',
    workLocation: 'Terminal 1'
  });

  const education = [
    {
      id: 1,
      level: 'S1',
      institution: 'Universitas Indonesia',
      major: 'Teknik Penerbangan',
      year: '2008-2012',
      gpa: '3.65'
    },
    {
      id: 2,
      level: 'SMA',
      institution: 'SMA Negeri 1 Jakarta',
      major: 'IPA',
      year: '2005-2008',
      gpa: '8.5'
    }
  ];

  const workHistory = [
    {
      id: 1,
      company: 'PT Angkasa Pura II',
      position: 'Ground Handling Operator',
      duration: '2018-2020',
      description: 'Menangani operasional ground handling dan koordinasi pesawat'
    },
    {
      id: 2,
      company: 'PT Garuda Indonesia',
      position: 'Customer Service',
      duration: '2015-2018',
      description: 'Melayani penumpang dan menangani check-in counter'
    }
  ];

  const documents = [
    {
      id: 1,
      name: 'KTP.pdf',
      type: 'KTP',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      status: 'Verified'
    },
    {
      id: 2,
      name: 'Ijazah_S1.pdf',
      type: 'Ijazah',
      size: '3.1 MB',
      uploadDate: '2024-01-15',
      status: 'Verified'
    },
    {
      id: 3,
      name: 'Sertifikat_IATA.pdf',
      type: 'Sertifikat',
      size: '1.8 MB',
      uploadDate: '2024-02-10',
      status: 'Pending'
    }
  ];

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Saving profile data:', profileData);
  };

  const tabs = [
    { id: 'personal', label: 'Data Personal', icon: User },
    { id: 'family', label: 'Data Keluarga', icon: Heart },
    { id: 'education', label: 'Pendidikan', icon: GraduationCap },
    { id: 'work', label: 'Riwayat Kerja', icon: Briefcase },
    { id: 'documents', label: 'Dokumen', icon: FileText },
    { id: 'settings', label: 'Pengaturan', icon: Shield }
  ];

  const renderPersonalData = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '2rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}></div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 10 }}>
          <div style={{ position: 'relative' }}>
            <img
              src={profilePhoto}
              alt="Profile"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '4px solid rgba(255,255,255,0.3)',
                objectFit: 'cover'
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                background: '#06b6d4',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
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
          
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
              {profileData.fullName}
            </h1>
            <p style={{ opacity: 0.9, margin: '0 0 0.25rem 0' }}>
              {profileData.position} • {profileData.department}
            </p>
            <p style={{ opacity: 0.8, margin: 0, fontSize: '0.9rem' }}>
              Employee ID: {profileData.employeeId}
            </p>
            
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                <span style={{ fontSize: '0.8rem' }}>
                  Bergabung: {new Date(profileData.joinDate).toLocaleDateString('id-ID')}
                </span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                <span style={{ fontSize: '0.8rem' }}>{profileData.employmentType}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              background: isEditing ? '#ef4444' : 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              transition: 'all 0.2s ease'
            }}
          >
            {isEditing ? <X size={20} /> : <Edit3 size={20} />}
          </button>
        </div>
      </div>

      {/* Personal Information Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Basic Info */}
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
            marginBottom: '1rem',
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <User size={20} style={{ color: '#06b6d4' }} />
            Informasi Dasar
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
                NIK
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.nik}
                  onChange={(e) => setProfileData({...profileData, nik: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    marginTop: '0.25rem'
                  }}
                />
              ) : (
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
                  {profileData.nik}
                </p>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
                Tempat Lahir
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.birthPlace}
                  onChange={(e) => setProfileData({...profileData, birthPlace: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    marginTop: '0.25rem'
                  }}
                />
              ) : (
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
                  {profileData.birthPlace}
                </p>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
                Tanggal Lahir
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={profileData.birthDate}
                  onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    marginTop: '0.25rem'
                  }}
                />
              ) : (
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
                  {new Date(profileData.birthDate).toLocaleDateString('id-ID')}
                </p>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
                Agama
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.religion}
                  onChange={(e) => setProfileData({...profileData, religion: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    marginTop: '0.25rem'
                  }}
                />
              ) : (
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
                  {profileData.religion}
                </p>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
                Golongan Darah
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.bloodType}
                  onChange={(e) => setProfileData({...profileData, bloodType: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    marginTop: '0.25rem'
                  }}
                />
              ) : (
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
                  {profileData.bloodType}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
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
            marginBottom: '1rem',
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Mail size={20} style={{ color: '#06b6d4' }} />
            Kontak
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ 
                fontSize: '0.8rem', 
                color: '#6b7280', 
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Mail size={14} />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    marginTop: '0.25rem'
                  }}
                />
              ) : (
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
                  {profileData.email}
                </p>
              )}
            </div>

            <div>
              <label style={{ 
                fontSize: '0.8rem', 
                color: '#6b7280', 
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Phone size={14} />
                Nomor Telepon
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    marginTop: '0.25rem'
                  }}
                />
              ) : (
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
                  {profileData.phone}
                </p>
              )}
            </div>

            <div>
              <label style={{ 
                fontSize: '0.8rem', 
                color: '#6b7280', 
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <MapPin size={14} />
                Alamat
              </label>
              {isEditing ? (
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    marginTop: '0.25rem',
                    resize: 'vertical'
                  }}
                />
              ) : (
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
                  {profileData.address}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Work Information */}
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
          marginBottom: '1rem',
          color: '#111827',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Briefcase size={20} style={{ color: '#06b6d4' }} />
          Informasi Pekerjaan
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
              Departemen
            </label>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
              {profileData.department}
            </p>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
              Posisi
            </label>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
              {profileData.position}
            </p>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
              Tanggal Bergabung
            </label>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
              {new Date(profileData.joinDate).toLocaleDateString('id-ID')}
            </p>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
              Status Karyawan
            </label>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
              {profileData.employmentType}
            </p>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
              Atasan Langsung
            </label>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
              {profileData.supervisor}
            </p>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
              Lokasi Kerja
            </label>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
              {profileData.workLocation}
            </p>
          </div>
        </div>
      </div>

      {isEditing && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            onClick={() => setIsEditing(false)}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: 'white',
              color: '#374151',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              background: '#06b6d4',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Save size={16} />
            Simpan Perubahan
          </button>
        </div>
      )}
    </div>
  );

  const renderFamilyData = () => (
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
        marginBottom: '1rem',
        color: '#111827',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <Heart size={20} style={{ color: '#06b6d4' }} />
        Data Keluarga
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
            Status Pernikahan
          </label>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
            {profileData.maritalStatus}
          </p>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
            Nama Pasangan
          </label>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
            {profileData.spouseName}
          </p>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
            Jumlah Anak
          </label>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
            {profileData.children}
          </p>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
            Kontak Darurat
          </label>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
            {profileData.emergencyContact}
          </p>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>
            Nama Kontak Darurat
          </label>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#374151' }}>
            {profileData.emergencyName}
          </p>
        </div>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {education.map((edu) => (
        <div key={edu.id} style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#111827' }}>
                {edu.institution}
              </h4>
              <p style={{ margin: '0 0 0.25rem 0', color: '#06b6d4', fontWeight: '500' }}>
                {edu.level} - {edu.major}
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
                {edu.year} • GPA: {edu.gpa}
              </p>
            </div>
            <GraduationCap size={24} style={{ color: '#06b6d4' }} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderWorkHistory = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {workHistory.map((work) => (
        <div key={work.id} style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#111827' }}>
                {work.position}
              </h4>
              <p style={{ margin: '0 0 0.25rem 0', color: '#06b6d4', fontWeight: '500' }}>
                {work.company}
              </p>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#6b7280' }}>
                {work.duration}
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151' }}>
                {work.description}
              </p>
            </div>
            <Briefcase size={24} style={{ color: '#06b6d4' }} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderDocuments = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>
          Dokumen Saya
        </h3>
        <button style={{
          padding: '0.5rem 1rem',
          background: '#06b6d4',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem'
        }}>
          <Upload size={16} />
          Upload Dokumen
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {documents.map((doc) => (
          <div key={doc.id} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={24} style={{ color: 'white' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: '#111827' }}>
                  {doc.name}
                </h4>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#6b7280' }}>
                  {doc.type} • {doc.size} • Upload: {new Date(doc.uploadDate).toLocaleDateString('id-ID')}
                </p>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  background: doc.status === 'Verified' ? '#dcfce7' : '#fef3c7',
                  color: doc.status === 'Verified' ? '#166534' : '#92400e'
                }}>
                  {doc.status}
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{
                padding: '0.5rem',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#374151'
              }}>
                <Eye size={16} />
              </button>
              <button style={{
                padding: '0.5rem',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#374151'
              }}>
                <Download size={16} />
              </button>
              <button style={{
                padding: '0.5rem',
                background: '#fef2f2',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#dc2626'
              }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Security Settings */}
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
          marginBottom: '1rem',
          color: '#111827',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Lock size={20} style={{ color: '#06b6d4' }} />
          Keamanan
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button style={{
            padding: '1rem',
            background: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Ubah Password</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
                Terakhir diubah 30 hari yang lalu
              </p>
            </div>
            <Edit3 size={16} style={{ color: '#6b7280' }} />
          </button>
          
          <button style={{
            padding: '1rem',
            background: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Autentikasi 2 Faktor</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
                Tingkatkan keamanan akun Anda
              </p>
            </div>
            <Shield size={16} style={{ color: '#6b7280' }} />
          </button>
        </div>
      </div>

      {/* Notification Settings */}
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
          marginBottom: '1rem',
          color: '#111827',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Bell size={20} style={{ color: '#06b6d4' }} />
          Notifikasi
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '8px'
          }}>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Email Notifications</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
                Terima notifikasi melalui email
              </p>
            </div>
            <div style={{
              width: '44px',
              height: '24px',
              background: '#06b6d4',
              borderRadius: '12px',
              position: 'relative',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '18px',
                height: '18px',
                background: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: '3px',
                right: '3px',
                transition: 'all 0.2s ease'
              }}></div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '8px'
          }}>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Push Notifications</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
                Notifikasi push di browser
              </p>
            </div>
            <div style={{
              width: '44px',
              height: '24px',
              background: '#d1d5db',
              borderRadius: '12px',
              position: 'relative',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '18px',
                height: '18px',
                background: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: '3px',
                left: '3px',
                transition: 'all 0.2s ease'
              }}></div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '8px'
          }}>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>SMS Notifications</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
                Notifikasi penting via SMS
              </p>
            </div>
            <div style={{
              width: '44px',
              height: '24px',
              background: '#06b6d4',
              borderRadius: '12px',
              position: 'relative',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '18px',
                height: '18px',
                background: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: '3px',
                right: '3px',
                transition: 'all 0.2s ease'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
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
          marginBottom: '1rem',
          color: '#111827',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Eye size={20} style={{ color: '#06b6d4' }} />
          Privasi
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Visibilitas Profil</h4>
            <select style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              background: 'white'
            }}>
              <option>Publik (Semua karyawan dapat melihat)</option>
              <option>Terbatas (Hanya departemen yang sama)</option>
              <option>Privat (Hanya atasan langsung)</option>
            </select>
          </div>
          
          <div style={{
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Data Sharing</h4>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#6b7280' }}>
              Pilih data apa yang dapat dibagikan untuk keperluan internal
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" defaultChecked />
                <span style={{ fontSize: '0.9rem' }}>Kontak pribadi</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" defaultChecked />
                <span style={{ fontSize: '0.9rem' }}>Riwayat pendidikan</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" defaultChecked />
                <span style={{ fontSize: '0.9rem' }}>Riwayat pekerjaan</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalData();
      case 'family':
        return renderFamilyData();
      case 'education':
        return renderEducation();
      case 'work':
        return renderWorkHistory();
      case 'documents':
        return renderDocuments();
      case 'settings':
        return renderSettings();
      default:
        return renderPersonalData();
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
        <div style={{
          marginBottom: '2rem'
        }}>
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
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              borderRadius: '12px',
              padding: '0.75rem',
              color: 'white'
            }}>
              <User size={24} />
            </div>
            Profil Saya
          </h1>
          <p style={{
            color: '#6b7280',
            margin: 0,
            fontSize: '1rem'
          }}>
            Kelola data pribadi dan informasi karyawan Anda
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '0.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          overflowX: 'auto'
        }}>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            minWidth: 'fit-content'
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
                    background: activeTab === tab.id ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'transparent',
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

export default ProfilePage;