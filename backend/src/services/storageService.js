import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base uploads root directory inside backend/uploads
export const UPLOADS_ROOT = path.resolve(__dirname, '../../uploads');

// Ensure root directory exists
if (!fs.existsSync(UPLOADS_ROOT)) {
  fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
}

/**
 * Validate file header magic bytes
 */
export function validateMagicBytes(filePath, expectedType) {
  try {
    const buffer = Buffer.alloc(12);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 12, 0);
    fs.closeSync(fd);

    if (expectedType === 'image/jpeg') {
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    }

    if (expectedType === 'image/png') {
      return (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47
      );
    }

    if (expectedType === 'image/webp') {
      // RIFF header at 0..3, WEBP at 8..11
      const isRiff = buffer.toString('utf8', 0, 4) === 'RIFF';
      const isWebp = buffer.toString('utf8', 8, 12) === 'WEBP';
      return isRiff && isWebp;
    }

    if (expectedType === 'audio/mpeg' || expectedType === 'audio/mp3') {
      // ID3 tag or MP3 frame sync (0xFF followed by 0xFB, 0xF3, 0xF2)
      const isId3 = buffer.toString('utf8', 0, 3) === 'ID3';
      const isFrameSync = buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
      return isId3 || isFrameSync;
    }

    return false;
  } catch (err) {
    console.error('[MagicBytes Validation Error]:', err.message);
    return false;
  }
}

/**
 * Get category upload target directory
 */
export function getUploadDirectory(slug, category = 'general') {
  // Sanitize slug strictly to prevent path traversal
  const safeSlug = slug.replace(/[^a-z0-9_-]/gi, '');
  const safeCategory = category.replace(/[^a-z0-9_-]/gi, '');
  const dirPath = path.join(UPLOADS_ROOT, 'weddings', safeSlug, safeCategory);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  return dirPath;
}

/**
 * Delete a managed upload file safely.
 * Will NEVER delete packaged frontend assets (e.g. /images/...)
 */
export function deleteFileIfLocal(relativeUrl) {
  if (!relativeUrl || typeof relativeUrl !== 'string') return;

  // Only delete files hosted under /uploads/
  if (!relativeUrl.startsWith('/uploads/')) return;

  try {
    const cleanSubpath = relativeUrl.replace(/^\/uploads\//, '');
    const fullPath = path.normalize(path.join(UPLOADS_ROOT, cleanSubpath));

    // Security check: ensure resolved path is strictly inside UPLOADS_ROOT
    if (!fullPath.startsWith(UPLOADS_ROOT)) {
      console.warn(`[Storage Warning]: Blocked potential path traversal in file deletion: ${relativeUrl}`);
      return;
    }

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`[Storage]: Cleaned up old file: ${relativeUrl}`);
    }
  } catch (err) {
    console.error(`[Storage Error]: Failed deleting file ${relativeUrl}:`, err.message);
  }
}