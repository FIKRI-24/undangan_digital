import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { resolveAssetUrl } from '../../utils/assetUrl';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageUploader({
  currentImageUrl,
  onFileSelect,
  label = 'Pilih Foto',
  aspectRatio = 'auto',
  maxHeight = '200px',
}) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Format file tidak didukung. Harap pilih file JPG, PNG, atau WEBP.');
      return;
    }

    if (file.size > MAX_SIZE) {
      setError('Ukuran file terlalu besar. Maksimal 5 MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    if (onFileSelect) onFileSelect(file);
  };

  const handleClear = () => {
    setPreview(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onFileSelect) onFileSelect(null);
  };

  const displayUrl = preview || resolveAssetUrl(currentImageUrl);

  return (
    <div className="image-uploader-wrapper">
      <div
        style={{
          border: '1.5px dashed #cbd5e1',
          borderRadius: '10px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          position: 'relative',
        }}
      >
        {displayUrl ? (
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxHeight: maxHeight,
              display: 'flex',
              justifyContent: 'center',
              overflow: 'hidden',
              borderRadius: '8px',
              backgroundColor: '#1e1b1b',
            }}
          >
            <img
              src={displayUrl}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: maxHeight,
                objectFit: 'contain',
                display: 'block',
              }}
            />
            {preview && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                }}
                title="Batal pilih"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              padding: '24px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: '#94a3b8',
              gap: '8px',
            }}
          >
            <ImageIcon size={36} />
            <span style={{ fontSize: '13px' }}>Belum ada foto</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={14} />
            <span>{preview ? 'Ganti Pilihan Foto' : label}</span>
          </button>
          <span style={{ fontSize: '11.5px', color: '#64748b' }}>
            JPG, PNG, WEBP (Maks 5 MB)
          </span>
        </div>

        {error && (
          <div
            style={{
              color: '#dc2626',
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '4px',
            }}
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}