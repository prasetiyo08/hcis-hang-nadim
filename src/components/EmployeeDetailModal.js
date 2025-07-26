// src/components/EmployeeDetailModal.js - Premium Enhanced Version
import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import {
  X,
  Edit3,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  Building,
  Users,
  Heart,
  GraduationCap,
  Shield,
  CheckCircle,
  AlertCircle,
  Copy,
  Download,
  Share2
} from 'lucide-react';
import './EmployeeDetailModal.css';

const EmployeeDetailModal = ({ employee, userRole, userEmail, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...employee });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [copySuccess, setCopySuccess] = useState('');

  // Auto-dismiss messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Auto-dismiss copy success
  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  // Utility functions
  const capitalizeWords = (str) => {
    if (!str) return '';
    return str.replace(/\b\w+/g, (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  };

  const formatFieldName = (fieldName) => {
    if (!fieldName) return '';
    
    // Special field name mappings
    const fieldMappings = {
      'fullName': 'Nama Lengkap',
      'birthPlace': 'Tempat Lahir',
      'birthDate': 'Tanggal Lahir',
      'maritalStatus': 'Status Pernikahan',
      'employmentType': 'Status Karyawan',
      'joinDate': 'Tanggal Bergabung',
      'emergencyContact': 'Kontak Darurat',
      'emergencyName': 'Nama Kontak Darurat'
    };
    
    if (fieldMappings[fieldName]) {
      return fieldMappings[fieldName];
    }
    
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    try {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount);
    } catch {
      return amount;
    }
  };

  const getInitials = (name) => {
    if (!name) return 'N/A';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Copy to clipboard function
  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${label} berhasil disalin!`);
    } catch (err) {
      setCopySuccess('Gagal menyalin ke clipboard');
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save changes
  const handleSave = async () => {
    if (userRole !== 'admin') {
      setMessage('❌ Hanya admin yang bisa mengedit data pegawai');
      return;
    }

    setSaving(true);
    try {
      const { id, createdAt, updatedAt, createdBy, source, ...updateData } = editData;
      
      await updateDoc(doc(db, 'employees', id), {
        ...updateData,
        updatedAt: new Date().toISOString(),
        updatedBy: userEmail
      });

      onUpdate({ ...editData, updatedAt: new Date().toISOString() });
      setIsEditing(false);
      setMessage('✅ Data pegawai berhasil diperbarui!');

    } catch (error) {
      console.error('❌ Error saving employee:', error);
      setMessage('❌ Gagal menyimpan data: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData({ ...employee });
    setIsEditing(false);
    setMessage('');
  };

  // Export employee data
  const exportEmployeeData = () => {
    const exportData = {
      nama: editData.fullName,
      email: editData.email,
      departemen: editData.department,
      posisi: editData.position,
      telepon: editData.phone,
      alamat: editData.address,
      tanggalBergabung: editData.joinDate,
      gaji: editData.salary
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${editData.fullName?.replace(/\s+/g, '_') || 'employee'}_data.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    setMessage('✅ Data pegawai berhasil diekspor!');
  };

  // Tab definitions with enhanced icons
  const tabs = [
    { id: 'personal', label: 'Data Personal', icon: User, color: '#3b82f6' },
    { id: 'work', label: 'Data Pekerjaan', icon: Briefcase, color: '#10b981' },
    { id: 'contact', label: 'Kontak & Alamat', icon: Phone, color: '#f59e0b' },
    { id: 'additional', label: 'Informasi Tambahan', icon: Users, color: '#8b5cf6' }
  ];

  // Enhanced field categorization
  const getPersonalFields = () => {
    const personalFields = [
      'fullName', 'nik', 'birthPlace', 'birthDate', 'gender', 
      'religion', 'bloodType', 'nationality', 'maritalStatus'
    ];
    return personalFields.filter(field => editData[field] !== undefined && editData[field] !== '');
  };

  const getWorkFields = () => {
    const workFields = [
      'position', 'department', 'joinDate', 'employmentType', 
      'salary', 'supervisor', 'workLocation', 'workShift'
    ];
    return workFields.filter(field => editData[field] !== undefined && editData[field] !== '');
  };

  const getContactFields = () => {
    const contactFields = [
      'email', 'phone', 'address', 'emergencyContact', 
      'emergencyName', 'emergencyRelation'
    ];
    return contactFields.filter(field => editData[field] !== undefined && editData[field] !== '');
  };

  const getAdditionalFields = () => {
    const standardFields = [
      'id', 'fullName', 'email', 'phone', 'department', 'position', 'address', 
      'joinDate', 'employmentType', 'salary', 'nik', 'createdAt', 'updatedAt', 
      'createdBy', 'source', 'status', 'birthPlace', 'birthDate', 'gender', 
      'religion', 'bloodType', 'nationality', 'maritalStatus', 'supervisor', 
      'workLocation', 'emergencyContact', 'emergencyName', 'emergencyRelation', 'workShift'
    ];
    
    return Object.keys(editData).filter(key => 
      !standardFields.includes(key) && 
      editData[key] !== undefined && 
      editData[key] !== ''
    );
  };

  // Enhanced field value rendering
  const renderFieldValue = (field, value) => {
    if (!value) return '-';
    
    if (field.includes('date') || field.includes('Date')) {
      return formatDate(value);
    }
    
    if (field.includes('salary') || field.includes('gaji')) {
      return formatCurrency(value);
    }
    
    if (field === 'email') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{value}</span>
          <button
            onClick={() => copyToClipboard(value, 'Email')}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
            title="Salin email"
          >
            <Copy size={14} />
          </button>
        </div>
      );
    }
    
    if (field === 'phone') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{value}</span>
          <button
            onClick={() => copyToClipboard(value, 'Nomor telepon')}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
            title="Salin nomor telepon"
          >
            <Copy size={14} />
          </button>
        </div>
      );
    }
    
    return capitalizeWords(value.toString());
  };

  // Enhanced editable field rendering
  const renderEditableField = (field, value, type = 'text') => {
    if (type === 'select') {
      const options = {
        gender: ['Laki-laki', 'Perempuan'],
        religion: ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'],
        employmentType: ['Permanent', 'Contract', 'Temporary', 'Intern'],
        maritalStatus: ['Belum Menikah', 'Menikah', 'Cerai', 'Janda/Duda'],
        workShift: ['Pagi (06:00-14:00)', 'Siang (14:00-22:00)', 'Malam (22:00-06:00)', 'Normal (08:00-17:00)']
      };
      
      return (
        <select
          value={value || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="form-input"
        >
          <option value="">Pilih {formatFieldName(field)}</option>
          {options[field]?.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }
    
    if (type === 'textarea') {
      return (
        <textarea
          value={value || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="form-input"
          rows={3}
          placeholder={`Masukkan ${formatFieldName(field).toLowerCase()}`}
        />
      );
    }
    
    return (
      <input
        type={type}
        value={value || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="form-input"
        placeholder={`Masukkan ${formatFieldName(field).toLowerCase()}`}
      />
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-detail" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header-detail">
          <div className="employee-header-info">
            <div className="employee-avatar-large">
              {getInitials(editData.fullName)}
            </div>
            <div className="employee-basic-info">
              <h2>{capitalizeWords(editData.fullName) || 'Nama Tidak Tersedia'}</h2>
              <p className="employee-position-large">
                {capitalizeWords(editData.position) || 'Posisi Tidak Tersedia'}
              </p>
              <p className="employee-department-large">
                {capitalizeWords(editData.department) || 'Departemen Tidak Tersedia'}
              </p>
              <div className="employee-id-large">
                ID: {editData.nik || editData.id}
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <button
              onClick={exportEmployeeData}
              className="btn-export"
              title="Ekspor Data"
              style={{
                padding: '1rem',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                color: '#7c3aed',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)',
                border: '1px solid rgba(124, 58, 237, 0.1)'
              }}
            >
              <Download size={20} />
            </button>
            
            {userRole === 'admin' && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`btn-edit-toggle ${isEditing ? 'editing' : ''}`}
                title={isEditing ? 'Batal Edit' : 'Edit Data'}
              >
                {isEditing ? <X size={20} /> : <Edit3 size={20} />}
              </button>
            )}
            
            <button
              onClick={onClose}
              className="btn-close-detail"
              title="Tutup"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`detail-message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message.includes('✅') ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message}
          </div>
        )}

        {copySuccess && (
          <div className="detail-message success">
            <CheckCircle size={16} />
            {copySuccess}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tab-navigation">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                style={activeTab === tab.id ? { color: tab.color } : {}}
              >
                <IconComponent size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="modal-body-detail">
          {activeTab === 'personal' && (
            <div className="tab-content">
              <h3 className="section-title">
                <User size={24} />
                Informasi Personal
              </h3>
              <div className="info-grid">
                {getPersonalFields().map(field => (
                  <div key={field} className="info-item-detail">
                    <label>{formatFieldName(field)}</label>
                    {isEditing ? 
                      renderEditableField(field, editData[field], 
                        ['gender', 'religion', 'maritalStatus'].includes(field) ? 'select' : 
                        field.includes('date') ? 'date' : 'text'
                      ) :
                      <span>{renderFieldValue(field, editData[field])}</span>
                    }
                  </div>
                ))}
                
                {getPersonalFields().length === 0 && (
                  <div className="no-additional-info">
                    <User size={48} />
                    <p>Belum ada informasi personal</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'work' && (
            <div className="tab-content">
              <h3 className="section-title">
                <Briefcase size={24} />
                Informasi Pekerjaan
              </h3>
              <div className="info-grid">
                {getWorkFields().map(field => (
                  <div key={field} className="info-item-detail">
                    <label>{formatFieldName(field)}</label>
                    {isEditing ? 
                      renderEditableField(field, editData[field], 
                        ['employmentType', 'workShift'].includes(field) ? 'select' :
                        field.includes('date') ? 'date' :
                        field === 'salary' ? 'number' : 'text'
                      ) :
                      <span>{renderFieldValue(field, editData[field])}</span>
                    }
                  </div>
                ))}
                
                {getWorkFields().length === 0 && (
                  <div className="no-additional-info">
                    <Briefcase size={48} />
                    <p>Belum ada informasi pekerjaan</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="tab-content">
              <h3 className="section-title">
                <Phone size={24} />
                Informasi Kontak & Alamat
              </h3>
              <div className="info-grid">
                {getContactFields().map(field => (
                  <div key={field} className="info-item-detail">
                    <label>{formatFieldName(field)}</label>
                    {isEditing ? 
                      renderEditableField(field, editData[field], 
                        field === 'address' ? 'textarea' :
                        field === 'email' ? 'email' :
                        field.includes('phone') || field.includes('Contact') ? 'tel' : 'text'
                      ) :
                      <span>{renderFieldValue(field, editData[field])}</span>
                    }
                  </div>
                ))}
                
                {getContactFields().length === 0 && (
                  <div className="no-additional-info">
                    <Phone size={48} />
                    <p>Belum ada informasi kontak</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'additional' && (
            <div className="tab-content">
              <h3 className="section-title">
                <Users size={24} />
                Informasi Tambahan
              </h3>
              {getAdditionalFields().length > 0 ? (
                <div className="info-grid">
                  {getAdditionalFields().map(field => (
                    <div key={field} className="info-item-detail">
                      <label>{formatFieldName(field)}</label>
                      {isEditing ? 
                        renderEditableField(field, editData[field]) :
                        <span>{renderFieldValue(field, editData[field])}</span>
                      }
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-additional-info">
                  <Users size={48} />
                  <p>Tidak ada informasi tambahan yang tersedia</p>
                  <small style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
                    Informasi tambahan akan muncul dari data Excel yang diupload
                  </small>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {isEditing && (
          <div className="modal-footer-detail">
            <button
              onClick={handleCancel}
              className="btn-cancel-detail"
            >
              <X size={16} />
              Batal Perubahan
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-save-detail"
            >
              {saving ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Menyimpan Data...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetailModal;