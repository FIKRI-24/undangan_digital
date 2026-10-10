import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { getUploadDirectory, validateMagicBytes } from '../services/storageService.js';

const ALLOWED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];
const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

const ALLOWED_AUDIO_EXTS = ['.mp3'];
const ALLOWED_AUDIO_MIMES = ['audio/mpeg', 'audio/mp3'];

// Custom disk storage resolving directory dynamically from req.wedding.slug and req.uploadCategory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const slug = req.wedding?.slug || 'raka-alya';
    const category = req.uploadCategory || 'general';
    const destDir = getUploadDirectory(slug, category);
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

// Image upload instance (Max 5MB)
export const uploadImage = (category = 'general') => {
  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!ALLOWED_IMAGE_EXTS.includes(ext) || !ALLOWED_IMAGE_MIMES.includes(file.mimetype)) {
        return cb(new Error('Hanya file gambar dengan format JPG, JPEG, PNG, atau WEBP yang diperbolehkan.'));
      }
      cb(null, true);
    },
  }).single('file');

  return (req, res, next) => {
    req.uploadCategory = category;
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Ukuran file gambar melebihi batas maksimal 5 MB.',
          });
        }
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Tidak ada file gambar yang diunggah.',
        });
      }

      // Verify file signature (magic bytes)
      const isValidMagic = validateMagicBytes(req.file.path, req.file.mimetype);
      if (!isValidMagic) {
        // Delete invalid/spoofed file immediately
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'Isi file gambar tidak sesuai dengan tipe atau ekstensi yang diizinkan (file rusak atau tidak valid).',
        });
      }

      // Construct public relative URL
      const slug = req.wedding?.slug || 'raka-alya';
      req.fileUrl = `/uploads/weddings/${slug}/${category}/${req.file.filename}`;
      next();
    });
  };
};

// Audio upload instance (Max 15MB)
export const uploadAudio = () => {
  const upload = multer({
    storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!ALLOWED_AUDIO_EXTS.includes(ext) || !ALLOWED_AUDIO_MIMES.includes(file.mimetype)) {
        return cb(new Error('Hanya file audio dengan format MP3 yang diperbolehkan.'));
      }
      cb(null, true);
    },
  }).single('file');

  return (req, res, next) => {
    req.uploadCategory = 'audio';
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Ukuran file musik melebihi batas maksimal 15 MB.',
          });
        }
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Tidak ada file musik yang diunggah.',
        });
      }

      // Verify audio magic bytes
      const isValidMagic = validateMagicBytes(req.file.path, req.file.mimetype);
      if (!isValidMagic) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'Isi file audio tidak sesuai dengan format MP3 yang valid.',
        });
      }

      const slug = req.wedding?.slug || 'raka-alya';
      req.fileUrl = `/uploads/weddings/${slug}/audio/${req.file.filename}`;
      next();
    });
  };
};