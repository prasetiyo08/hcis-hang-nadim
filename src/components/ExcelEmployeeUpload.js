// src/components/ExcelEmployeeUpload.js - FIXED & ENHANCED VERSION
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  Check, 
  X, 
  AlertCircle, 
  Download,
  Users,
  Eye,
  Save,
  CheckCircle,
  Shield
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import './ExcelEmployeeUpload.css';

const ExcelEmployeeUpload = ({ userRole, userEmail }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [validData, setValidData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [detectedColumns, setDetectedColumns] = useState(null);
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Complete
  const [saveProgress, setSaveProgress] = useState(0);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  // Core template dengan field wajib dan mapping otomatis
  const coreTemplate = {
    // Field WAJIB - harus ada
    'Nama Lengkap': 'fullName',
    'Email': 'email',
    'Departemen': 'department',
    
    // Field UMUM - mapping otomatis jika ada
    'NIK': 'nik',
    'No. Telepon': 'phone', 
    'Telepon': 'phone',
    'HP': 'phone',
    'Handphone': 'phone',
    'Tempat Lahir': 'birthPlace',
    'Tanggal Lahir': 'birthDate',
    'Tgl Lahir': 'birthDate',
    'Jenis Kelamin': 'gender',
    'Gender': 'gender',
    'Agama': 'religion',
    'Alamat': 'address',
    'Posisi': 'position',
    'Jabatan': 'position',
    'Tanggal Bergabung': 'joinDate',
    'Tgl Bergabung': 'joinDate',
    'Mulai Kerja': 'joinDate',
    'Status Karyawan': 'employmentType',
    'Status': 'employmentType',
    'Gaji': 'salary',
    'Gaji Pokok': 'salary'
  };

  // Kata kunci untuk auto-detect field keluarga
  const familyKeywords = {
    'anak': 'numberOfChildren',
    'jumlah anak': 'numberOfChildren', 
    'berapa anak': 'numberOfChildren',
    'total anak': 'numberOfChildren',
    'pasangan': 'spouseName',
    'suami': 'spouseName', 
    'istri': 'spouseName',
    'menikah': 'maritalStatus',
    'status nikah': 'maritalStatus',
    'status pernikahan': 'maritalStatus'
  };

  // Function untuk auto-detect kolom dari header Excel
  const autoDetectColumns = (headers) => {
    const detectedMapping = { ...coreTemplate };
    const additionalFields = [];

    headers.forEach((header, index) => {
      const cleanHeader = header.toString().toLowerCase().trim();
      let mapped = false;

      // Cek exact match dari core template
      Object.keys(coreTemplate).forEach(templateKey => {
        if (templateKey.toLowerCase() === cleanHeader) {
          detectedMapping[header] = coreTemplate[templateKey];
          mapped = true;
        }
      });

      // Jika belum mapped, cek family keywords
      if (!mapped) {
        Object.keys(familyKeywords).forEach(keyword => {
          if (cleanHeader.includes(keyword)) {
            detectedMapping[header] = familyKeywords[keyword];
            mapped = true;
          }
        });
      }

      // Jika belum mapped, tambahkan sebagai field dinamis
      if (!mapped) {
        // Convert header ke camelCase untuk field name
        const fieldName = header.replace(/[^a-zA-Z0-9]/g, '_')
          .toLowerCase()
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '');
        
        detectedMapping[header] = fieldName;
        additionalFields.push({
          originalHeader: header,
          fieldName: fieldName,
          columnIndex: index,
          category: detectFieldCategory(cleanHeader)
        });
      }
    });

    return {
      mapping: detectedMapping,
      additionalFields
    };
  };

  // Function untuk detect kategori field berdasarkan nama
  const detectFieldCategory = (headerName) => {
    const personalKeywords = ['nama', 'nik', 'ktp', 'lahir', 'umur', 'gender', 'kelamin', 'agama', 'darah'];
    const familyKeywords = ['anak', 'pasangan', 'suami', 'istri', 'nikah', 'keluarga', 'darurat'];
    const workKeywords = ['kerja', 'jabatan', 'dept', 'divisi', 'gaji', 'salary', 'shift', 'lokasi'];
    const educationKeywords = ['pendidikan', 'sekolah', 'kuliah', 'universitas', 'jurusan', 'ipk', 'nilai'];
    const financialKeywords = ['bank', 'rekening', 'bpjs', 'npwp', 'pajak'];

    if (personalKeywords.some(keyword => headerName.includes(keyword))) return 'personal';
    if (familyKeywords.some(keyword => headerName.includes(keyword))) return 'family';
    if (workKeywords.some(keyword => headerName.includes(keyword))) return 'work';
    if (educationKeywords.some(keyword => headerName.includes(keyword))) return 'education';
    if (financialKeywords.some(keyword => headerName.includes(keyword))) return 'financial';
    
    return 'other';
  };

  // Reset state
  const resetUpload = () => {
    setFile(null);
    setData([]);
    setValidData([]);
    setErrors([]);
    setDetectedColumns(null);
    setStep(1);
    setSaveProgress(0);
    setMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    
    if (!uploadedFile) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];

    if (!validTypes.includes(uploadedFile.type)) {
      setMessage('❌ File harus berformat Excel (.xlsx, .xls) atau CSV');
      return;
    }

    // Validate file size (max 10MB)
    if (uploadedFile.size > 10 * 1024 * 1024) {
      setMessage('❌ Ukuran file maksimal 10MB');
      return;
    }

    setFile(uploadedFile);
    setLoading(true);
    setMessage('⏳ Membaca file Excel...');

    try {
      console.log('📁 Reading Excel file:', uploadedFile.name);
      
      // Read file as array buffer
      const arrayBuffer = await uploadedFile.arrayBuffer();
      
      // Parse Excel file
      const workbook = XLSX.read(arrayBuffer, {
        cellStyles: true,
        cellDates: true,
        cellFormulas: false,
        sheetStubs: false
      });

      console.log('📊 Workbook sheets:', workbook.SheetNames);

      // Get first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1, // Use first row as header
        defval: '' // Default value for empty cells
      });

      console.log('📋 Raw data:', jsonData);

      if (jsonData.length < 2) {
        throw new Error('File Excel harus memiliki minimal 1 baris header dan 1 baris data');
      }

      // Process data with auto-detection
      const headers = jsonData[0];
      const rows = jsonData.slice(1);

      console.log('📝 Headers detected:', headers);

      // Auto-detect column mapping
      const detection = autoDetectColumns(headers);
      console.log('🔍 Auto-detection result:', detection);

      // Map and validate data
      const processedData = [];
      const validationErrors = [];

      rows.forEach((row, index) => {
        const rowIndex = index + 2; // Excel row number (starting from 2)
        const employee = {};
        let hasData = false;

        // Map each column using detected mapping
        headers.forEach((header, colIndex) => {
          const value = row[colIndex];
          const fieldName = detection.mapping[header];

          if (fieldName && value !== undefined && value !== '') {
            employee[fieldName] = value;
            hasData = true;
          }
        });

        // Skip empty rows
        if (!hasData) return;

        // Add metadata
        employee._rowIndex = rowIndex;
        employee._detectedFields = detection.additionalFields.filter(field => 
          employee[field.fieldName] !== undefined
        );

        // Validate required fields (hanya field wajib)
        const requiredFields = ['fullName', 'email', 'department'];
        const missingFields = requiredFields.filter(field => !employee[field]);

        if (missingFields.length > 0) {
          validationErrors.push({
            row: rowIndex,
            type: 'missing_required',
            message: `Baris ${rowIndex}: Field wajib kosong - ${missingFields.join(', ')}`,
            data: employee
          });
        }

        // Validate email format
        if (employee.email && !isValidEmail(employee.email)) {
          validationErrors.push({
            row: rowIndex,
            type: 'invalid_email',
            message: `Baris ${rowIndex}: Format email tidak valid - ${employee.email}`,
            data: employee
          });
        }

        // Validate NIK (optional, hanya jika ada)
        if (employee.nik && (employee.nik.toString().length !== 16 || isNaN(employee.nik))) {
          validationErrors.push({
            row: rowIndex,
            type: 'invalid_nik',
            message: `Baris ${rowIndex}: NIK harus 16 digit angka - ${employee.nik}`,
            data: employee
          });
        }

        // Validate numberOfChildren (jika ada)
        if (employee.numberOfChildren && isNaN(employee.numberOfChildren)) {
          validationErrors.push({
            row: rowIndex,
            type: 'invalid_number',
            message: `Baris ${rowIndex}: Jumlah anak harus berupa angka - ${employee.numberOfChildren}`,
            data: employee
          });
        }

        processedData.push(employee);
      });

      setData(processedData);
      setErrors(validationErrors);
      
      // Set detection result untuk ditampilkan
      setDetectedColumns(detection);
      
      // Filter valid data (without critical errors)
      const criticalErrorRows = validationErrors
        .filter(error => error.type === 'missing_required' || error.type === 'invalid_email')
        .map(error => error.row);
      
      const validEmployees = processedData.filter(emp => 
        !criticalErrorRows.includes(emp._rowIndex)
      );

      setValidData(validEmployees);
      setStep(2);
      setMessage('✅ File berhasil diproses!');

      console.log('✅ Data processed with auto-detection:', {
        total: processedData.length,
        valid: validEmployees.length,
        errors: validationErrors.length,
        additionalFields: detection.additionalFields.length
      });

    } catch (error) {
      console.error('❌ Excel read error:', error);
      setMessage('❌ Gagal membaca file Excel: ' + error.message);
      resetUpload();
    } finally {
      setLoading(false);
    }
  };

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Save data to Firebase
  const saveToFirebase = async () => {
    if (validData.length === 0) {
      setMessage('❌ Tidak ada data valid untuk disimpan');
      return;
    }

    setLoading(true);
    setSaveProgress(0);
    setMessage('⏳ Menyimpan data ke database...');

    try {
      console.log('💾 Saving to Firebase:', validData.length, 'employees');

      const savedEmployees = [];
      const saveErrors = [];

      for (let i = 0; i < validData.length; i++) {
        const employee = validData[i];
        
        try {
          // Prepare employee data for Firebase
          const employeeData = {
            // Remove metadata fields
            ...employee
          };
          delete employeeData._rowIndex;
          delete employeeData._detectedFields;

          // Add system metadata
          employeeData.createdAt = serverTimestamp();
          employeeData.updatedAt = serverTimestamp();
          employeeData.createdBy = userEmail;
          employeeData.status = 'active';
          employeeData.source = 'excel_upload';

          // Save to Firestore
          const docRef = await addDoc(collection(db, 'employees'), employeeData);
          
          savedEmployees.push({
            id: docRef.id,
            ...employeeData,
            _rowIndex: employee._rowIndex
          });

          console.log(`✅ Saved employee ${i + 1}/${validData.length}:`, employee.fullName);

        } catch (saveError) {
          console.error(`❌ Save error for employee ${i + 1}:`, saveError);
          saveErrors.push({
            row: employee._rowIndex,
            name: employee.fullName,
            error: saveError.message
          });
        }

        // Update progress
        setSaveProgress(Math.round(((i + 1) / validData.length) * 100));
      }

      console.log('🎉 Save completed:', {
        saved: savedEmployees.length,
        errors: saveErrors.length
      });

      if (saveErrors.length > 0) {
        console.warn('⚠️ Some save errors:', saveErrors);
        setMessage(`⚠️ ${savedEmployees.length} pegawai berhasil disimpan, ${saveErrors.length} gagal disimpan`);
      } else {
        setMessage(`🎉 Semua ${savedEmployees.length} pegawai berhasil disimpan!`);
      }

      setStep(3);

    } catch (error) {
      console.error('❌ Save process error:', error);
      setMessage('❌ Gagal menyimpan data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Download Excel template - Simple core template
  const downloadTemplate = () => {
    const templateHeaders = [
      'Nama Lengkap', 'Email', 'Departemen', // WAJIB
      'NIK', 'No. Telepon', 'Tempat Lahir', 'Tanggal Lahir', 'Jenis Kelamin', 'Agama', 'Alamat', // Personal
      'Posisi', 'Tanggal Bergabung', 'Status Karyawan', 'Gaji Pokok', // Work
      'Jumlah Anak', 'Nama Anak 1', 'Nama Anak 2', 'Status Pernikahan' // Family (contoh)
    ];

    const exampleData = [
      'John Doe', 'john.doe@hangnadim.com', 'IT',
      '1234567890123456', '081234567890', 'Jakarta', '1990-01-15', 'Laki-laki', 'Islam', 'Jl. Contoh No. 123',
      'Software Developer', '2024-01-01', 'Permanent', '8000000',
      '2', 'Alice Doe', 'Bob Doe', 'Menikah'
    ];

    const templateData = [templateHeaders, exampleData];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Pegawai');

    // Download file
    XLSX.writeFile(workbook, 'Template_Data_Pegawai.xlsx');
  };

  // Render based on step
  const renderContent = () => {
    switch (step) {
      case 1:
        return renderUploadStep();
      case 2:
        return renderPreviewStep();
      case 3:
        return renderCompleteStep();
      default:
        return renderUploadStep();
    }
  };

  // Step 1: Upload
  const renderUploadStep = () => (
    <div className="upload-section">
      <div className="upload-header">
        <FileSpreadsheet size={48} />
        <h2>Upload Data Pegawai dari Excel</h2>
        <p>Upload file Excel (.xlsx, .xls) atau CSV yang berisi data pegawai</p>
      </div>

      <div className="template-download">
        <p>💡 Belum punya template Excel? Download template di bawah ini:</p>
        <button
          onClick={downloadTemplate}
          className="btn-download-template"
        >
          <Download size={20} />
          Download Template Excel
        </button>
      </div>

      <div className="upload-area">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        
        <div
          className="drop-zone"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={40} />
          <p>Klik untuk pilih file atau drag & drop</p>
          <small>Format: .xlsx, .xls, .csv (Max: 10MB)</small>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Membaca file Excel...</p>
        </div>
      )}
    </div>
  );

  // Step 2: Preview
  const renderPreviewStep = () => (
    <div className="preview-section">
      <div className="preview-header">
        <Eye size={32} />
        <h2>Preview Data Excel</h2>
        <p>File: <strong>{file?.name}</strong></p>
      </div>

      <div className="data-summary">
        <div className="summary-card success">
          <Users size={24} />
          <div>
            <h3>{validData.length}</h3>
            <p>Data Valid</p>
          </div>
        </div>
        
        <div className="summary-card warning">
          <AlertCircle size={24} />
          <div>
            <h3>{errors.length}</h3>
            <p>Error/Warning</p>
          </div>
        </div>
        
        <div className="summary-card info">
          <FileSpreadsheet size={24} />
          <div>
            <h3>{data.length}</h3>
            <p>Total Baris</p>
          </div>
        </div>

        <div className="summary-card info">
          <Check size={24} />
          <div>
            <h3>{detectedColumns?.additionalFields?.length || 0}</h3>
            <p>Field Tambahan</p>
          </div>
        </div>
      </div>

      {/* Column Detection Results */}
      {detectedColumns?.additionalFields && detectedColumns.additionalFields.length > 0 && (
        <div className="detected-fields-section">
          <h3>Kolom Tambahan Terdeteksi:</h3>
          <div className="detected-fields-grid">
            {detectedColumns.additionalFields.map((field, index) => (
              <div key={index} className="detected-field-item">
                <div className="field-header">
                  <strong>"{field.originalHeader}"</strong>
                  <span className={`field-category ${field.category}`}>
                    {field.category}
                  </span>
                </div>
                <div className="field-mapping">
                  → {field.fieldName}
                </div>
              </div>
            ))}
          </div>
          <p className="detection-note">
            Semua kolom ini akan otomatis disimpan ke database
          </p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="errors-section">
          <h3>Error & Warning:</h3>
          <div className="errors-list">
            {errors.map((error, index) => (
              <div key={index} className="error-item">
                <AlertCircle size={16} />
                <span>{error.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="preview-table-section">
        <h3>Data Valid ({validData.length}):</h3>
        <div className="preview-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Departemen</th>
                <th>Field Tambahan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {validData.slice(0, 10).map((employee, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{employee.fullName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>
                    {employee._detectedFields?.length > 0 ? 
                      `+${employee._detectedFields.length} field` : 
                      'Standard'
                    }
                  </td>
                  <td>
                    <span className="status-badge valid">Valid</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {validData.length > 10 && (
            <p className="table-note">
              Menampilkan 10 dari {validData.length} data valid
            </p>
          )}
        </div>
      </div>

      <div className="preview-actions">
        <button
          onClick={resetUpload}
          className="btn-secondary"
        >
          <X size={20} />
          Batal
        </button>
        
        <button
          onClick={saveToFirebase}
          disabled={validData.length === 0 || loading}
          className="btn-primary"
        >
          {loading ? (
            <>
              <div className="loading-spinner"></div>
              Menyimpan... ({saveProgress}%)
            </>
          ) : (
            <>
              <Save size={20} />
              Simpan {validData.length} Pegawai
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Step 3: Complete
  const renderCompleteStep = () => (
    <div className="complete-section">
      <div className="success-icon">
        <Check size={64} />
      </div>
      <h2>🎉 Upload Berhasil!</h2>
      <p>Data pegawai telah berhasil disimpan ke database</p>
      
      <div className="complete-summary">
        <div className="summary-item">
          <strong>{validData.length}</strong>
          <span>Pegawai Disimpan</span>
        </div>
        <div className="summary-item">
          <strong>{file?.name.split('.')[0]}</strong>
          <span>File Diproses</span>
        </div>
      </div>

      <button
        onClick={resetUpload}
        className="btn-primary"
      >
        <Upload size={20} />
        Upload File Lain
      </button>
    </div>
  );

  // Admin only access
  if (userRole !== 'admin') {
    return (
      <div className="access-denied">
        <Shield size={48} />
        <h2>🚫 Akses Ditolak</h2>
        <p>Hanya administrator yang dapat mengupload data pegawai</p>
      </div>
    );
  }

  return (
    <div className="excel-upload-container">
      {/* Message Display */}
      {message && (
        <div className={`informasi-message ${
          message.includes('✅') || message.includes('🎉') ? 'success' : 
          message.includes('⏳') ? 'warning' : 'error'
        }`} style={{ marginBottom: '1.5rem' }}>
          {message.includes('✅') || message.includes('🎉') ? 
            <CheckCircle size={16} /> : 
            <AlertCircle size={16} />
          }
          {message}
        </div>
      )}

      {renderContent()}
    </div>
  );
};

export default ExcelEmployeeUpload;