import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import { Quote, Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function QuoteManagement() {
  const [formData, setFormData] = useState({
    quote_title: 'We Found Love',
    quote_text: '',
    quote_source: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getWedding();
      if (res.success && res.data?.wedding) {
        const w = res.data.wedding;
        setFormData({
          quote_title: w.quote_title || 'We Found Love',
          quote_text: w.quote_text || '',
          quote_source: w.quote_source || '',
        });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Gagal memuat quote pernikahan.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await adminApi.updateQuote(formData);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Quote / ayat suci berhasil disimpan!' });
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menyimpan quote.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={24} className="animate-spin-slow" style={{ color: '#7A2025', margin: '0 auto 12px auto' }} />
        <span>Memuat quote pernikahan...</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Quote & Ayat Pernikahan
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Kelola kutipan ayat suci atau pesan romantis yang ditampilkan setelah bagian Hero
          </p>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSubmit}
          disabled={isSaving}
        >
          <Save size={16} />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Quote'}</span>
        </button>
      </div>

      {statusMessage.text && (
        <div
          className={`admin-alert ${
            statusMessage.type === 'success' ? 'admin-alert-success' : 'admin-alert-danger'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="admin-grid-2">
        {/* Edit Form */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Formulir Quote / Ayat</h3>
              <p className="admin-card-desc">Teks disimpan dan dirender sebagai teks biasa (plain text)</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label className="admin-label">Judul Quote</label>
              <input
                type="text"
                className="admin-input"
                placeholder="Contoh: We Found Love / Makna Pernikahan"
                value={formData.quote_title}
                onChange={(e) => setFormData({ ...formData, quote_title: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Isi Quote / Terjemahan Ayat</label>
              <textarea
                className="admin-textarea"
                rows={6}
                placeholder="Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu..."
                value={formData.quote_text}
                onChange={(e) => setFormData({ ...formData, quote_text: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Sumber Kutipan / Ayat</label>
              <input
                type="text"
                className="admin-input"
                placeholder="Contoh: QS Ar-Rum : 21"
                value={formData.quote_source}
                onChange={(e) => setFormData({ ...formData, quote_source: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={isSaving}
              >
                <Save size={14} />
                <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="admin-card" style={{ background: '#FFFDF8', border: '1.5px solid #e1c98e' }}>
          <div className="admin-card-header" style={{ borderBottomColor: '#f1e6cf' }}>
            <div>
              <h3 className="admin-card-title" style={{ color: '#7A2025' }}>
                Pratinjau Tampilan Publik
              </h3>
              <p className="admin-card-desc">Visualisasi di halaman undangan pengunjung</p>
            </div>
          </div>

          <div style={{ padding: '24px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontFamily: "'Great Vibes', cursive", color: '#7A2025', marginBottom: '12px' }}>
              {formData.quote_title || 'We Found Love'}
            </div>

            <blockquote
              style={{
                fontSize: '14.5px',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: 'italic',
                lineHeight: 1.8,
                color: '#25201E',
                margin: '0 auto 16px auto',
                maxWidth: '420px',
              }}
            >
              &ldquo;{formData.quote_text || 'Dan di antara tanda-tanda kebesaran-Nya...'}&rdquo;
            </blockquote>

            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#b88a3d',
                fontWeight: 700,
              }}
            >
              {formData.quote_source || 'QS Ar-Rum : 21'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}