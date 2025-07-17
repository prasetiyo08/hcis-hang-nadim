// TentangHCIS.js - Fixed Navigation
import React from "react";
import {
  Users,
  Target,
  Award,
  TrendingUp,
  Globe,
  BookOpen,
  ArrowRight,
  CheckCircle,
  LogIn,
  Shield,
} from "lucide-react";

const TentangHCIS = ({ setCurrentPage, handleProtectedNavigation }) => {
  return (
    <div className="about-container">
      {/* Navigation Header */}
      <div className="nav-header">
        <div className="nav-content">
          {/* Logo */}
          <div className="logo-section">
            <div className="logo-text">
              H<span className="logo-plane">✈</span>
              NGNADIM
            </div>
            <div className="logo-subtitle">
              BANDARA
              <br />
              INTERNASIONAL
              <br />
              BATAM
            </div>
          </div>

          {/* Navigation - FIXED: Added proper routing */}
          <div className="nav-menu">
            <button
              onClick={() => setCurrentPage("login")}
              className="nav-button"
            >
              Beranda
            </button>
            <span className="nav-button active">Tentang HCIS</span>
            {/* FIXED: Use handleProtectedNavigation for Pusat Informasi */}
            <button
              onClick={() => handleProtectedNavigation("pusat-informasi")}
              className="nav-button"
            >
              Pusat Informasi
            </button>
            <button
              onClick={() => setCurrentPage("login")}
              className="nav-button"
            >
              Daftar Perusahaan
            </button>
            <button
              onClick={() => setCurrentPage("login")}
              className="nav-button-primary"
            >
              MASUK
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-bg-pattern"></div>
        <div className="hero-content">
          <div>
            <h1 className="hero-title">HCIS HANG NADIM</h1>
            <p className="hero-subtitle">
              Human Capital Information System Hang Nadim Airport (HCIS Hang
              Nadim) adalah sebuah wadah penyimpanan informasi terintegrasi bagi
              Insan Hang Nadim untuk memberikan insight bagi pembuat kebijakan
              guna peningkatan manfaat yang berkelanjutan bagi seluruh Insan
              Hang Nadim.
            </p>
          </div>

          <div className="hero-image">
            <div className="hero-image-content">
              <Users
                size={60}
                style={{ color: "white", marginBottom: "15px", opacity: 0.9 }}
              />
              <div style={{ textAlign: "center", color: "white" }}>
                <h3 className="hero-image-title">Tim Profesional Bandara</h3>
                <p className="hero-image-subtitle">
                  Bersama membangun masa depan
                  <br />
                  penerbangan Indonesia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What is HCIS Section */}
      <div className="section section-bg-light">
        <div className="section-content">
          <div className="section-grid">
            <div>
              <h2 className="section-title">Apa itu HCIS?</h2>
              <p className="section-text">
                HCIS (Human Capital Information System) adalah platform digital
                terintegrasi yang dirancang khusus untuk mengelola seluruh aspek
                sumber daya manusia di lingkungan Bandara Internasional Hang
                Nadim Batam.
              </p>
              <div className="features-list">
                {[
                  "Manajemen data karyawan terpusat",
                  "Sistem pembelajaran dan pengembangan",
                  "Monitoring performa real-time",
                  "Analytics dan reporting advanced",
                ].map((item, index) => (
                  <div key={index} className="feature-item">
                    <CheckCircle size={20} style={{ color: "#06b6d4" }} />
                    <span className="feature-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="stats-card">
              <div className="stats-grid">
                {[
                  { number: "5000+", label: "Karyawan" },
                  { number: "50+", label: "Departemen" },
                  { number: "99.9%", label: "Uptime" },
                  { number: "24/7", label: "Support" },
                ].map((stat, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="section section-bg-white">
        <div className="section-content">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#1f2937",
                margin: "0 0 15px 0",
              }}
            >
              Fitur Unggulan HCIS
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#6b7280",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Platform komprehensif dengan teknologi terdepan untuk transformasi
              digital HR
            </p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: <Users size={40} />,
                title: "Employee Management",
                description:
                  "Kelola data karyawan secara terpusat dengan sistem yang terintegrasi dan aman",
              },
              {
                icon: <TrendingUp size={40} />,
                title: "Performance Analytics",
                description:
                  "Dashboard analytics real-time untuk monitoring dan evaluasi performa karyawan",
              },
              {
                icon: <BookOpen size={40} />,
                title: "Learning & Development",
                description:
                  "Platform pembelajaran digital untuk pengembangan kompetensi dan karir karyawan",
              },
              {
                icon: <Shield size={40} />,
                title: "Security & Compliance",
                description:
                  "Sistem keamanan berlapis dengan standar enterprise dan compliance terjamin",
              },
              {
                icon: <Globe size={40} />,
                title: "Cloud Integration",
                description:
                  "Akses dari mana saja dengan teknologi cloud yang scalable dan reliable",
              },
              {
                icon: <Award size={40} />,
                title: "Recognition System",
                description:
                  "Sistem penghargaan dan pengakuan untuk meningkatkan motivasi karyawan",
              },
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vision & Mission Section */}
      <div className="vision-mission-section">
        <div className="section-content">
          <div className="vision-mission-grid">
            <div>
              <h2 className="vm-title">Visi</h2>
              <p className="vm-text">
                Menjadi platform HCIS terdepan yang mendukung transformasi
                digital industri penerbangan Indonesia dengan memberikan solusi
                inovatif untuk pengelolaan sumber daya manusia yang efektif dan
                berkelanjutan.
              </p>
            </div>
            <div>
              <h2 className="vm-title">Misi</h2>
              <ul className="mission-list">
                <li className="mission-item">
                  <ArrowRight
                    size={16}
                    style={{ marginTop: "4px", flexShrink: 0 }}
                  />
                  Mengoptimalkan potensi SDM melalui teknologi digital
                </li>
                <li className="mission-item">
                  <ArrowRight
                    size={16}
                    style={{ marginTop: "4px", flexShrink: 0 }}
                  />
                  Meningkatkan efisiensi operasional bandara
                </li>
                <li className="mission-item">
                  <ArrowRight
                    size={16}
                    style={{ marginTop: "4px", flexShrink: 0 }}
                  />
                  Membangun ekosistem pembelajaran berkelanjutan
                </li>
                <li className="mission-item">
                  <ArrowRight
                    size={16}
                    style={{ marginTop: "4px", flexShrink: 0 }}
                  />
                  Mendukung pengembangan karir karyawan
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Bergabunglah dengan HCIS</h2>
          <p className="cta-text">
            Mulai transformasi digital HR Anda hari ini. Akses platform terdepan
            untuk pengelolaan sumber daya manusia yang efektif dan modern.
          </p>
          <div className="cta-buttons">
            <button
              onClick={() => setCurrentPage("login")}
              className="cta-button-primary"
            >
              <LogIn size={20} />
              Masuk ke Sistem
            </button>
            <button className="cta-button-secondary">
              <BookOpen size={20} />
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#2563eb",
                  marginBottom: "15px",
                }}
              >
                H<span style={{ color: "#06b6d4", margin: "0 -2px" }}>✈</span>
                NGNADIM
              </div>
              <p className="footer-info">
                Human Capital Information System untuk Bandara Internasional
                Hang Nadim Batam. Membangun masa depan industri penerbangan
                melalui transformasi digital SDM.
              </p>
            </div>
            <div>
              <h4>Quick Links</h4>
              <div className="footer-links">
                <button
                  onClick={() => setCurrentPage("login")}
                  className="footer-link"
                >
                  Beranda
                </button>
                <span className="footer-link" style={{ color: "#06b6d4" }}>
                  Tentang HCIS
                </span>
                <button
                  onClick={() => handleProtectedNavigation("pusat-informasi")}
                  className="footer-link"
                >
                  Pusat Informasi
                </button>
                <button
                  onClick={() => setCurrentPage("login")}
                  className="footer-link"
                >
                  Bantuan
                </button>
              </div>
            </div>
            <div>
              <h4>Kontak</h4>
              <div className="footer-info">
                <div style={{ marginBottom: "8px" }}>
                  <strong>Bandara Internasional Hang Nadim</strong>
                </div>
                <div>Jl. Raya Hang Nadim</div>
                <div>Batam, Kepulauan Riau 29461</div>
                <div>Indonesia</div>
                <div style={{ marginTop: "15px" }}>
                  <div>📧 hcis@hangnadim.com</div>
                  <div>📞 +62 778 123 456</div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            © 2025 HCIS Hang Nadim Airport. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

// Add more descriptive content
const SeoRichContent = () => (
  <section>
    <h1>Tentang HCIS Hang Nadim Airport</h1>
    <p>
      Human Capital Information System (HCIS) Hang Nadim Airport adalah solusi
      digital terdepan untuk manajemen sumber daya manusia di Bandara
      Internasional Hang Nadim Batam. Sebagai bandara tersibuk di Kepulauan
      Riau, Hang Nadim Airport membutuhkan sistem informasi yang dapat mendukung
      lebih dari 1000 karyawan dalam operasional harian.
    </p>

    <h2>Mengapa HCIS Hang Nadim?</h2>
    <p>
      Dikembangkan khusus untuk kebutuhan industri penerbangan di Indonesia,
      HCIS Hang Nadim mengintegrasikan teknologi cloud computing dengan keamanan
      enterprise-grade. Sistem ini mendukung transformasi digital HR di sektor
      aviasi Indonesia.
    </p>

    <h2>Manfaat untuk Pegawai Hang Nadim</h2>
    <ul>
      <li>Akses 24/7 ke informasi personal dan perusahaan</li>
      <li>Platform komunikasi langsung dengan management</li>
      <li>Sistem tracking pengembangan karir dan pelatihan</li>
      <li>Portal mobile-friendly untuk akses dari mana saja</li>
    </ul>
  </section>
);

export default TentangHCIS;
