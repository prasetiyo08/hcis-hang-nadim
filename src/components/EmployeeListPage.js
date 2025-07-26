// src/components/EmployeeListPage.js - FIXED CSS Import
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '../services/firebase';
import {
  Users,
  Search,
  Filter,
  Edit3,
  Save,
  X,
  Trash2,
  Eye,
  Plus,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign
} from 'lucide-react';
// FIXED: Import CSS file
import './EmployeeListPage.css';

const EmployeeListPage = ({ userRole, userEmail, onNavigateToUpload }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [showFilters, setShowFilters] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Load employees data
  useEffect(() => {
    loadEmployees();
  }, []);

  // Filter employees when search/filter changes
  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, filterDepartment]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      console.log('📋 Loading employees from Firestore...');
      
      const q = query(
        collection(db, 'employees'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const employeeData = [];
      
      querySnapshot.forEach((doc) => {
        employeeData.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log(`✅ Loaded ${employeeData.length} employees`);
      setEmployees(employeeData);
      
    } catch (error) {
      console.error('❌ Error loading employees:', error);
      setMessage('❌ Gagal memuat data pegawai: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.fullName?.toLowerCase().includes(search) ||
        emp.email?.toLowerCase().includes(search) ||
        emp.department?.toLowerCase().includes(search) ||
        emp.position?.toLowerCase().includes(search) ||
        emp.nik?.includes(search)
      );
    }

    // Department filter
    if (filterDepartment) {
      filtered = filtered.filter(emp => emp.department === filterDepartment);
    }

    setFilteredEmployees(filtered);
  };

  const getDepartments = () => {
    const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
    return departments.sort();
  };

  const handleEdit = (employee) => {
    if (userRole !== 'admin') {
      setMessage('❌ Hanya admin yang bisa mengedit data pegawai');
      return;
    }
    setEditingEmployee({ ...employee });
  };

  const handleSave = async () => {
    if (!editingEmployee || userRole !== 'admin') return;

    setSaving(true);
    try {
      console.log('💾 Saving employee:', editingEmployee.id);

      const { id, createdAt, updatedAt, createdBy, source, ...updateData } = editingEmployee;
      
      await updateDoc(doc(db, 'employees', id), {
        ...updateData,
        updatedAt: new Date().toISOString(),
        updatedBy: userEmail
      });

      // Update local state
      setEmployees(prev => 
        prev.map(emp => 
          emp.id === id ? { ...editingEmployee, updatedAt: new Date().toISOString() } : emp
        )
      );

      setEditingEmployee(null);
      setMessage('✅ Data pegawai berhasil diupdate!');
      
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('❌ Error saving employee:', error);
      setMessage('❌ Gagal menyimpan data: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (employeeId, employeeName) => {
    if (userRole !== 'admin') {
      setMessage('❌ Hanya admin yang bisa menghapus data pegawai');
      return;
    }

    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus data pegawai "${employeeName}"?\n\nTindakan ini tidak dapat dibatalkan.`
    );

    if (!confirmDelete) return;

    try {
      console.log('🗑️ Deleting employee:', employeeId);
      
      await deleteDoc(doc(db, 'employees', employeeId));
      
      // Remove from local state
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      
      setMessage(`✅ Data pegawai "${employeeName}" berhasil dihapus`);
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('❌ Error deleting employee:', error);
      setMessage('❌ Gagal menghapus data: ' + error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setEditingEmployee(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID');
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

  const renderEmployeeCard = (employee) => (
    <div key={employee.id} className="employee-card">
      <div className="employee-card-header">
        <div className="employee-avatar">
          <User size={24} />
        </div>
        <div className="employee-basic-info">
          <h3>{employee.fullName || 'Nama tidak tersedia'}</h3>
          <p className="employee-position">
            {employee.position || 'Posisi tidak tersedia'} • {employee.department || 'Departemen tidak tersedia'}
          </p>
          <p className="employee-id">ID: {employee.nik || employee.id}</p>
        </div>
        {userRole === 'admin' && (
          <div className="employee-actions">
            <button
              onClick={() => handleEdit(employee)}
              className="btn-edit"
              title="Edit"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => handleDelete(employee.id, employee.fullName)}
              className="btn-delete"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="employee-card-body">
        <div className="employee-info-grid">
          <div className="info-item">
            <Mail size={14} />
            <span>{employee.email || '-'}</span>
          </div>
          <div className="info-item">
            <Phone size={14} />
            <span>{employee.phone || '-'}</span>
          </div>
          <div className="info-item">
            <MapPin size={14} />
            <span>{employee.address || '-'}</span>
          </div>
          <div className="info-item">
            <Calendar size={14} />
            <span>Bergabung: {formatDate(employee.joinDate)}</span>
          </div>
          <div className="info-item">
            <Briefcase size={14} />
            <span>{employee.employmentType || '-'}</span>
          </div>
          <div className="info-item">
            <DollarSign size={14} />
            <span>{formatCurrency(employee.salary)}</span>
          </div>
        </div>

        {/* Additional Fields */}
        {Object.keys(employee).some(key => 
          !['id', 'fullName', 'email', 'phone', 'department', 'position', 'address', 'joinDate', 'employmentType', 'salary', 'nik', 'createdAt', 'updatedAt', 'createdBy', 'source', 'status'].includes(key)
        ) && (
          <div className="additional-fields">
            <h4>Informasi Tambahan:</h4>
            <div className="additional-fields-grid">
              {Object.entries(employee).map(([key, value]) => {
                if (['id', 'fullName', 'email', 'phone', 'department', 'position', 'address', 'joinDate', 'employmentType', 'salary', 'nik', 'createdAt', 'updatedAt', 'createdBy', 'source', 'status'].includes(key)) {
                  return null;
                }
                return (
                  <div key={key} className="additional-field">
                    <strong>{key}:</strong> {value || '-'}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTableView = () => (
    <div className="table-container">
      <table className="employees-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Departemen</th>
            <th>Posisi</th>
            <th>Telepon</th>
            <th>Status</th>
            {userRole === 'admin' && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(employee => (
            <tr key={employee.id}>
              <td>
                <div className="table-employee-info">
                  <strong>{employee.fullName}</strong>
                  <small>{employee.nik || employee.id}</small>
                </div>
              </td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>{employee.position}</td>
              <td>{employee.phone}</td>
              <td>
                <span className={`status-badge ${employee.status || 'active'}`}>
                  {employee.status || 'Active'}
                </span>
              </td>
              {userRole === 'admin' && (
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="btn-edit-small"
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id, employee.fullName)}
                      className="btn-delete-small"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderEditModal = () => {
    if (!editingEmployee) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Edit Data Pegawai</h2>
            <button
              onClick={() => setEditingEmployee(null)}
              className="modal-close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            <div className="edit-form-grid">
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  value={editingEmployee.fullName || ''}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editingEmployee.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Departemen</label>
                <input
                  type="text"
                  value={editingEmployee.department || ''}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Posisi</label>
                <input
                  type="text"
                  value={editingEmployee.position || ''}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Telepon</label>
                <input
                  type="text"
                  value={editingEmployee.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>NIK</label>
                <input
                  type="text"
                  value={editingEmployee.nik || ''}
                  onChange={(e) => handleInputChange('nik', e.target.value)}
                />
              </div>

              <div className="form-group full-width">
                <label>Alamat</label>
                <textarea
                  value={editingEmployee.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Gaji</label>
                <input
                  type="number"
                  value={editingEmployee.salary || ''}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Status Karyawan</label>
                <select
                  value={editingEmployee.employmentType || ''}
                  onChange={(e) => handleInputChange('employmentType', e.target.value)}
                >
                  <option value="">Pilih Status</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              {/* Dynamic fields from Excel */}
              {Object.entries(editingEmployee).map(([key, value]) => {
                const skipFields = ['id', 'fullName', 'email', 'department', 'position', 'phone', 'nik', 'address', 'salary', 'employmentType', 'createdAt', 'updatedAt', 'createdBy', 'source', 'status'];
                
                if (skipFields.includes(key)) return null;

                return (
                  <div key={key} className="form-group">
                    <label>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                    <input
                      type="text"
                      value={value || ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="modal-footer">
            <button
              onClick={() => setEditingEmployee(null)}
              className="btn-cancel"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-save"
            >
              {saving ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Simpan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat data pegawai...</p>
      </div>
    );
  }

  return (
    <div className="employee-list-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <Users size={32} />
          <div>
            <h1>Data Pegawai</h1>
            <p>
              {userRole === 'admin' 
                ? 'Kelola data pegawai perusahaan' 
                : 'Lihat data pegawai perusahaan'
              }
            </p>
          </div>
        </div>
        <div className="header-actions">
          {userRole === 'admin' && (
            <button
              onClick={onNavigateToUpload}
              className="btn-primary"
            >
              <Upload size={16} />
              Upload Excel
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message.includes('✅') ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {message}
        </div>
      )}

      {/* Controls */}
      <div className="controls-section">
        <div className="search-controls">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Cari nama, email, departemen, atau NIK..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
          >
            <Filter size={16} />
            Filter
          </button>
        </div>

        <div className="view-controls">
          <button
            onClick={() => setViewMode('grid')}
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="filters-section">
          <div className="filter-group">
            <label>Departemen:</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">Semua Departemen</option>
              {getDepartments().map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats-section">
        <div className="stat-card">
          <Users size={20} />
          <div>
            <h3>{filteredEmployees.length}</h3>
            <p>Total Pegawai</p>
          </div>
        </div>
        <div className="stat-card">
          <Briefcase size={20} />
          <div>
            <h3>{getDepartments().length}</h3>
            <p>Departemen</p>
          </div>
        </div>
      </div>

      {/* Employee List */}
      {filteredEmployees.length === 0 ? (
        <div className="empty-state">
          <Users size={48} />
          <h3>Belum Ada Data Pegawai</h3>
          <p>
            {employees.length === 0 
              ? 'Belum ada pegawai yang terdaftar dalam sistem'
              : 'Tidak ada pegawai yang sesuai dengan filter yang dipilih'
            }
          </p>
          {userRole === 'admin' && employees.length === 0 && (
            <button
              onClick={onNavigateToUpload}
              className="btn-primary"
            >
              <Upload size={16} />
              Upload Data Pegawai
            </button>
          )}
        </div>
      ) : (
        <div className={`employees-container ${viewMode}`}>
          {viewMode === 'grid' ? (
            <div className="employees-grid">
              {filteredEmployees.map(renderEmployeeCard)}
            </div>
          ) : (
            renderTableView()
          )}
        </div>
      )}

      {/* Edit Modal */}
      {renderEditModal()}
    </div>
  );
};

export default EmployeeListPage;