// src/components/PusatInformasi.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  arrayUnion, 
  orderBy, 
  query, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Plus, 
  MessageSquare, 
  Calendar, 
  User, 
  Send,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import './PusatInformasi.css';

const PusatInformasi = ({ userRole, userEmail }) => {
  const [informasi, setInformasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    konten: '',
    prioritas: 'normal'
  });
  const [komentarBaru, setKomentarBaru] = useState({});

  // Fetch informasi dari Firebase
  useEffect(() => {
    fetchInformasi();
  }, []);

  const fetchInformasi = async () => {
    setLoading(true);
    try {
      console.log('📋 Fetching informasi dari Firestore...');
      
      const q = query(collection(db, 'informasi'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ 
          id: doc.id, 
          ...doc.data() 
        });
      });
      
      console.log(`✅ Loaded ${data.length} informasi items`);
      setInformasi(data);
      
    } catch (error) {
      console.error("❌ Error fetching informasi:", error);
      setMessage('❌ Gagal memuat informasi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Tambah informasi baru (Admin only)
  const handleSubmitInformasi = async (e) => {
    e.preventDefault();
    
    if (userRole !== 'admin') {
      setMessage('❌ Hanya admin yang dapat menambah informasi');
      return;
    }

    // Validasi form
    if (!formData.judul.trim() || !formData.kategori || !formData.konten.trim()) {
      setMessage('❌ Mohon lengkapi semua field yang diperlukan');
      return;
    }

    setSaving(true);
    setMessage('⏳ Menyimpan informasi...');

    try {
      console.log('💾 Saving new informasi:', formData);
      
      const newInformasi = {
        judul: formData.judul.trim(),
        kategori: formData.kategori,
        konten: formData.konten.trim(),
        prioritas: formData.prioritas,
        author: userEmail,
        timestamp: serverTimestamp(),
        komentar: [],
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'informasi'), newInformasi);
      
      console.log('✅ Informasi saved with ID:', docRef.id);
      
      // Reset form
      setFormData({
        judul: '',
        kategori: '',
        konten: '',
        prioritas: 'normal'
      });
      
      setShowForm(false);
      setMessage('✅ Informasi berhasil ditambahkan!');
      
      // Refresh data
      await fetchInformasi();
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      console.error("❌ Error adding informasi:", error);
      setMessage('❌ Gagal menambahkan informasi: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle komentar input change
  const handleKomentarChange = (informasiId, value) => {
    setKomentarBaru(prev => ({
      ...prev,
      [informasiId]: value
    }));
  };

  // Tambah komentar
  const handleTambahKomentar = async (informasiId) => {
    const komentar = komentarBaru[informasiId];
    
    if (!komentar || !komentar.trim()) {
      setMessage('❌ Komentar tidak boleh kosong');
      return;
    }

    try {
      console.log('💬 Adding comment to informasi:', informasiId);
      
      const informasiRef = doc(db, 'informasi', informasiId);
      
      const komentarData = {
        text: komentar.trim(),
        author: userEmail,
        timestamp: new Date().toISOString(),
        id: Date.now() // Simple ID untuk komentar
      };

      await updateDoc(informasiRef, {
        komentar: arrayUnion(komentarData)
      });

      console.log('✅ Comment added successfully');

      // Clear komentar input
      setKomentarBaru(prev => ({
        ...prev,
        [informasiId]: ''
      }));
      
      setMessage('✅ Komentar berhasil ditambahkan!');
      
      // Refresh data
      await fetchInformasi();
      
      // Clear message after 2 seconds
      setTimeout(() => setMessage(''), 2000);
      
    } catch (error) {
      console.error("❌ Error adding komentar:", error);
      setMessage('❌ Gagal menambahkan komentar: ' + error.message);
    }
  };

  // Get priority color class
  const getPriorityColor = (prioritas) => {
    switch (prioritas) {
      case 'urgent': return 'priority-urgent';
      case 'penting': return 'priority-penting';
      default: return 'priority-normal';
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  // Get category display name
  const getCategoryDisplayName = (kategori) => {
    const categoryMap = {
      'pencapaian': 'Pencapaian Perusahaan',
      'pengumuman': 'Pengumuman Penting', 
      'kebijakan': 'Kebijakan Baru',
      'acara': 'Acara & Event',
      'lainnya': 'Lainnya'
    };
    return categoryMap[kategori] || kategori;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat informasi...</p>
      </div>
    );
  }

  return (
    <div className="pusat-informasi-container">
      {/* Header Section */}
      <div className="header-section">
        <h1>Pusat Informasi</h1>
        {userRole === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            <Plus size={20} />
            {showForm ? 'Batal' : 'Tambah Informasi'}
          </button>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <div className={`informasi-message ${
          message.includes('✅') ? 'success' : 
          message.includes('⏳') ? 'warning' : 'error'
        }`}>
          {message.includes('✅') ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {message}
        </div>
      )}

      {/* Form Tambah Informasi (Admin Only) */}
      {userRole === 'admin' && showForm && (
        <div className="form-container">
          <h2>Tambah Informasi Baru</h2>
          
          <form onSubmit={handleSubmitInformasi}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="judul">Judul Informasi *</label>
                <input
                  id="judul"
                  type="text"
                  value={formData.judul}
                  onChange={(e) => handleInputChange('judul', e.target.value)}
                  className="form-input"
                  placeholder="Masukkan judul informasi"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="kategori">Kategori *</label>
                <select
                  id="kategori"
                  value={formData.kategori}
                  onChange={(e) => handleInputChange('kategori', e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="pencapaian">Pencapaian Perusahaan</option>
                  <option value="pengumuman">Pengumuman Penting</option>
                  <option value="kebijakan">Kebijakan Baru</option>
                  <option value="acara">Acara & Event</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="prioritas">Tingkat Prioritas</label>
              <select
                id="prioritas"
                value={formData.prioritas}
                onChange={(e) => handleInputChange('prioritas', e.target.value)}
                className="form-input"
              >
                <option value="normal">Normal</option>
                <option value="penting">Penting</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="konten">Konten Informasi *</label>
              <textarea
                id="konten"
                value={formData.konten}
                onChange={(e) => handleInputChange('konten', e.target.value)}
                rows={6}
                className="form-input"
                placeholder="Masukkan konten informasi lengkap..."
                required
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-success"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Publikasikan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Daftar Informasi */}
      <div className="informasi-list">
        {informasi.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada informasi yang dipublikasikan</p>
          </div>
        ) : (
          informasi.map((item) => (
            <div key={item.id} className="informasi-card">
              
              {/* Informasi Header */}
              <div className="informasi-header">
                <h3>{item.judul}</h3>
                <div className="informasi-meta">
                  <span className={`priority-badge ${getPriorityColor(item.prioritas)}`}>
                    {item.prioritas ? item.prioritas.toUpperCase() : 'NORMAL'}
                  </span>
                  <span className="category-badge">
                    {getCategoryDisplayName(item.kategori)}
                  </span>
                  <span>
                    <User size={14} />
                    {item.author || 'Unknown'}
                  </span>
                  <span>
                    <Calendar size={14} />
                    {formatDate(item.timestamp)}
                  </span>
                </div>
              </div>
              
              {/* Informasi Content */}
              <div className="informasi-content">
                <p>{item.konten}</p>
              </div>
              
              {/* Komentar Section */}
              <div className="komentar-section">
                <h4>Komentar ({item.komentar?.length || 0})</h4>
                
                {/* Tampilkan komentar existing */}
                {item.komentar && item.komentar.length > 0 && (
                  <div className="komentar-list">
                    {item.komentar.map((komentar, index) => (
                      <div key={komentar.id || index} className="komentar-item">
                        <div className="komentar-header">
                          <span className="komentar-author">
                            {komentar.author || 'Anonymous'}
                          </span>
                          <span className="komentar-date">
                            {komentar.timestamp ? new Date(komentar.timestamp).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'Invalid date'}
                          </span>
                        </div>
                        <p className="komentar-text">{komentar.text}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Form tambah komentar */}
                <div className="komentar-form">
                  <input
                    type="text"
                    value={komentarBaru[item.id] || ''}
                    onChange={(e) => handleKomentarChange(item.id, e.target.value)}
                    placeholder="Tambahkan komentar..."
                    className="form-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleTambahKomentar(item.id);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleTambahKomentar(item.id)}
                    className="btn-primary"
                    disabled={!komentarBaru[item.id]?.trim()}
                  >
                    <Send size={16} />
                    Kirim
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PusatInformasi;