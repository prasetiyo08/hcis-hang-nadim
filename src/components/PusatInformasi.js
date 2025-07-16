// PusatInformasi.js - FINAL Fixed Version
import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase'; // FIXED: Correct path from components/user/ to services/
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

const PusatInformasi = ({ userRole, userEmail }) => {
  const [informasi, setInformasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
    try {
      const q = query(collection(db, 'informasi'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setInformasi(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching informasi:", error);
      setLoading(false);
    }
  };

  // Tambah informasi baru (Admin only)
  const handleSubmitInformasi = async (e) => {
    e.preventDefault();
    if (userRole !== 'admin') return;

    try {
      await addDoc(collection(db, 'informasi'), {
        ...formData,
        author: userEmail,
        timestamp: serverTimestamp(),
        komentar: []
      });
      
      setFormData({
        judul: '',
        kategori: '',
        konten: '',
        prioritas: 'normal'
      });
      setShowForm(false);
      fetchInformasi();
      alert('Informasi berhasil ditambahkan!');
    } catch (error) {
      console.error("Error adding informasi:", error);
      alert('Gagal menambahkan informasi');
    }
  };

  // Tambah komentar
  const handleTambahKomentar = async (informasiId) => {
    const komentar = komentarBaru[informasiId];
    if (!komentar || !komentar.trim()) return;

    try {
      const informasiRef = doc(db, 'informasi', informasiId);
      await updateDoc(informasiRef, {
        komentar: arrayUnion({
          text: komentar,
          author: userEmail,
          timestamp: new Date().toISOString()
        })
      });

      setKomentarBaru({
        ...komentarBaru,
        [informasiId]: ''
      });
      fetchInformasi();
    } catch (error) {
      console.error("Error adding komentar:", error);
      alert('Gagal menambahkan komentar');
    }
  };

  const getPriorityColor = (prioritas) => {
    switch (prioritas) {
      case 'urgent': return 'priority-urgent';
      case 'penting': return 'priority-penting';
      default: return 'priority-normal';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <div className="header-section">
        <h1>Pusat Informasi</h1>
        {userRole === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Batal' : 'Tambah Informasi'}
          </button>
        )}
      </div>

      {/* Form Tambah Informasi (Admin Only) */}
      {userRole === 'admin' && showForm && (
        <div className="form-container">
          <h2>Tambah Informasi Baru</h2>
          <form onSubmit={handleSubmitInformasi}>
            <div className="form-row">
              <div className="form-group">
                <label>Judul</label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={(e) => setFormData({...formData, judul: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Kategori</label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({...formData, kategori: e.target.value})}
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
              <label>Prioritas</label>
              <select
                value={formData.prioritas}
                onChange={(e) => setFormData({...formData, prioritas: e.target.value})}
                className="form-input"
              >
                <option value="normal">Normal</option>
                <option value="penting">Penting</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Konten</label>
              <textarea
                value={formData.konten}
                onChange={(e) => setFormData({...formData, konten: e.target.value})}
                rows={6}
                className="form-input"
                placeholder="Masukkan konten informasi..."
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-success">
                Publikasikan
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
              <div className="informasi-header">
                <div>
                  <h3>{item.judul}</h3>
                  <div className="informasi-meta">
                    <span className={`priority-badge ${getPriorityColor(item.prioritas)}`}>
                      {item.prioritas.toUpperCase()}
                    </span>
                    <span className="category-badge">
                      {item.kategori}
                    </span>
                    <span>By: {item.author}</span>
                    <span>{formatDate(item.timestamp)}</span>
                  </div>
                </div>
              </div>
              
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
                      <div key={index} className="komentar-item">
                        <div className="komentar-header">
                          <span className="komentar-author">{komentar.author}</span>
                          <span className="komentar-date">
                            {new Date(komentar.timestamp).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
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
                    onChange={(e) => setKomentarBaru({
                      ...komentarBaru,
                      [item.id]: e.target.value
                    })}
                    placeholder="Tambahkan komentar..."
                    className="form-input"
                  />
                  <button
                    onClick={() => handleTambahKomentar(item.id)}
                    className="btn-primary"
                  >
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