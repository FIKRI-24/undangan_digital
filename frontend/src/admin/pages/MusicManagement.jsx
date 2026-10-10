import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import AudioUploader from '../components/AudioUploader';
import { Music, Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function MusicManagement() {
  const [currentMusicUrl, setCurrentMusicUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getWedding();
      if (res.success && res.data?.wedding) {
        setCurrentMusicUrl(res.data.wedding.music_url || '');
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Gagal memuat data musik.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setStatusMessage({ type: 'error', text: 'Pilih file musik baru (.MP3) terlebih dahulu.' });
      return;
    }

    setIsSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await adminApi.uploadMusic(selectedFile);
      if (res.success && res.data?.url) {
        setCurrentMusicUrl(res.data.url);
        setSelectedFile(null);
        setStatusMessage({ type: 'success', text: 'Lagu pernikahan berhasil diperbarui!' });
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal mengunggah file musik.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={24} className="animate-spin-slow" style={{ color: '#7A2025', margin: '0 auto 12px auto' }} />
        <span>Memuat pengaturan musik...</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Musik Latar (Background Music)
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Kelola lagu pengiring yang diputar otomatis setelah tamu menekan tombol Open Invitation
          </p>
        </div>

        {selectedFile && (
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Musik Baru'}</span>
          </button>
        )}
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

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Pilih & Pratinjau Lagu</h3>
            <p className="admin-card-desc">File MP3 berukuran maksimal 15 MB</p>
          </div>
        </div>

        <AudioUploader
          currentAudioUrl={currentMusicUrl}
          onFileSelect={(file) => setSelectedFile(file)}
        />

        {selectedFile && (
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save size={14} />
              <span>{isSaving ? 'Mengunggah...' : 'Simpan Perubahan Musik'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="admin-card" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px 0', color: '#334155' }}>
          Kebijakan Pemutaran Musik
        </h4>
        <ul style={{ fontSize: '12.5px', color: '#64748b', paddingLeft: '20px', margin: 0, lineHeight: 1.6 }}>
          <li>Audio tidak akan pernah diputar otomatis di panel admin.</li>
          <li>Pada halaman tamu publik, musik hanya akan mulai berputar setelah tamu mengetuk tombol "OPEN INVITATION" demi mematuhi kebijakan autoplay browser modern.</li>
          <li>Tamu dapat menjeda dan memutar kembali musik kapan saja melalui piringan musik mengambang di pojok kanan bawah.</li>
        </ul>
      </div>
    </div>
  );
}