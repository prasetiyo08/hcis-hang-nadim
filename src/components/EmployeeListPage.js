// src/components/EmployeeListPage.js - Horizontal Layout Version
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
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
  Trash2,
  Plus,
  Upload,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Phone,
  Building,
  Grid,
  List,
  Eye
} from 'lucide-react';
import EmployeeDetailModal from './EmployeeDetailModal';
import './EmployeeListPage.css';

const EmployeeListPage = ({ userRole, userEmail, onNavigateToUpload }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
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

  const handleDelete = async (employeeId, employeeName) => {
    if (userRole !== 'admin') {
      setMessage('❌ Hanya admin yang bisa menghapus data pegawai');
      return;
    }

    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus data pegawai "${capitalizeWords(employeeName)}"?\n\nTindakan ini tidak dapat dibatalkan.`
    );

    if (!confirmDelete) return;

    try {
      console.log('🗑️ Deleting employee:', employeeId);
      
      await deleteDoc(doc(db, 'employees', employeeId));
      
      // Remove from local state
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      
      setMessage(`✅ Data pegawai "${capitalizeWords(employeeName)}" berhasil dihapus`);
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('❌ Error deleting employee:', error);
      setMessage('❌ Gagal menghapus data: ' + error.message);
    }
  };

  const handleViewDetail = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedEmployee(null);
  };

  const handleEmployeeUpdate = (updatedEmployee) => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
    setMessage('✅ Data pegawai berhasil diupdate!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Utility function to capitalize words properly
  const capitalizeWords = (str) => {
    if (!str) return '';
    return str.replace(/\b\w+/g, (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  };

  // Get employee initials for avatar
  const getInitials = (name) => {
    if (!name) return 'N/A';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderEmployeeCard = (employee) => (
    <div key={employee.id} className="employee-card-horizontal">
      <div className="employee-avatar">
        {getInitials(employee.fullName)}
      </div>
      
      <div className="employee-info">
        <h3 className="employee-name">
          {capitalizeWords(employee.fullName) || 'Nama Tidak Tersedia'}
        </h3>
        <p className="employee-position">
          {capitalizeWords(employee.position) || 'Posisi Tidak Tersedia'}
        </p>
        <p className="employee-department">
          {capitalizeWords(employee.department) || 'Departemen Tidak Tersedia'}
        </p>
        <p className="employee-contact">
          <Mail size={12} />
          {employee.email}
        </p>
      </div>

      <div className="employee-actions">
        <button
          onClick={() => handleViewDetail(employee)}
          className="btn-view"
          title="Lihat Detail"
        >
          <Eye size={16} />
        </button>
        {userRole === 'admin' && (
          <>
            <button
              onClick={() => handleDelete(employee.id, employee.fullName)}
              className="btn-delete"
              title="Hapus Pegawai"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderTableView = () => (
    <div className="table-container-horizontal">
      <table className="employees-table-horizontal">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Nama Pegawai</th>
            <th>Posisi</th>
            <th>Departemen</th>
            <th>Email</th>
            <th>Telepon</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(employee => (
            <tr key={employee.id} onClick={() => handleViewDetail(employee)} className="table-row-clickable">
              <td>
                <div className="table-employee-avatar">
                  {getInitials(employee.fullName)}
                </div>
              </td>
              <td>
                <div className="table-employee-info">
                  <strong>{capitalizeWords(employee.fullName)}</strong>
                  <small>{employee.nik || employee.id}</small>
                </div>
              </td>
              <td>{capitalizeWords(employee.position)}</td>
              <td>{capitalizeWords(employee.department)}</td>
              <td>{employee.email}</td>
              <td>{employee.phone || '-'}</td>
              <td>
                <div className="table-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleViewDetail(employee)}
                    className="btn-view-small"
                    title="Lihat Detail"
                  >
                    <Eye size={14} />
                  </button>
                  {userRole === 'admin' && (
                    <button
                      onClick={() => handleDelete(employee.id, employee.fullName)}
                      className="btn-delete-small"
                      title="Hapus Pegawai"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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
          <div className="header-icon">
            <Users size={32} />
          </div>
          <div>
            <h1>Data Pegawai</h1>
            <p>
              {userRole === 'admin' 
                ? 'Kelola Data Pegawai Perusahaan' 
                : 'Lihat Data Pegawai Perusahaan'
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
            title="Tampilan Card"
          >
            <Grid size={16} />
            Card
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
            title="Tampilan Tabel"
          >
            <List size={16} />
            Tabel
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
                <option key={dept} value={dept}>{capitalizeWords(dept)}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats-section">
        <div className="stat-card">
          <Users size={24} />
          <div>
            <h3>{filteredEmployees.length}</h3>
            <p>Total Pegawai</p>
          </div>
        </div>
        <div className="stat-card">
          <Building size={24} />
          <div>
            <h3>{getDepartments().length}</h3>
            <p>Departemen</p>
          </div>
        </div>
      </div>

      {/* Employee List */}
      {filteredEmployees.length === 0 ? (
        <div className="empty-state">
          <Users size={64} />
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
        <div className={`employees-container-horizontal ${viewMode}`}>
          {viewMode === 'grid' ? (
            <div className="employees-grid-horizontal">
              {filteredEmployees.map(renderEmployeeCard)}
            </div>
          ) : (
            renderTableView()
          )}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          userRole={userRole}
          userEmail={userEmail}
          onClose={handleCloseDetail}
          onUpdate={handleEmployeeUpdate}
        />
      )}
    </div>
  );
};

export default EmployeeListPage;