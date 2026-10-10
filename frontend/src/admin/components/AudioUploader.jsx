import React, { useState, useRef } from 'react';
import { Music, Upload, Play, Pause, AlertCircle } from 'lucide-react';
import { resolveAssetUrl } from '../../utils/assetUrl';

const MAX_AUDIO_SIZE = 15 * 1024 * 1024; // 15MB

export default function AudioUploader({ currentAudioUrl, onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.mp3') && file.type !== 'audio/mpeg') {
      setError('Format audio tidak didukung. Harap pilih file MP3.');
      return;
    }

    if (file.size > MAX_AUDIO_SIZE) {
      setError('Ukuran file audio terlalu besar. Maksimal 15 MB.');
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (onFileSelect) onFileSelect(file);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const activeAudioSource = previewUrl || resolveAssetUrl(currentAudioUrl);

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7A2025',
            }}
          >
            <Music size={20} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>Musik Latar Undangan</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {selectedFile ? selectedFile.name : (currentAudioUrl ? 'Menggunakan file aktif' : 'Belum ada musik')}
            </div>
          </div>
        </div>

        {activeAudioSource && (
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Jeda Pratinjau' : 'Dengarkan Musik'}</span>
          </button>
        )}
      </div>

      {activeAudioSource && (
        <audio
          ref={audioRef}
          src={activeAudioSource}
          onEnded={handleEnded}
          style={{ display: 'none' }}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,audio/mpeg"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '12px' }}>
        <button
          type="button"
          className="admin-btn admin-btn-primary admin-btn-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={14} />
          <span>{selectedFile ? 'Pilih File Lain' : 'Pilih File MP3'}</span>
        </button>
        <span style={{ fontSize: '12px', color: '#64748b' }}>Format .MP3 (Maksimal 15 MB)</span>
      </div>

      {error && (
        <div style={{ color: '#dc2626', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}