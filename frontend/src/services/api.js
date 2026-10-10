/**
 * API Service for Wedding Digital Invitation
 * Based on PRD Section 14, 17, 30 & Phase 5 Contract
 */

import { weddingConfig } from '../data/weddingConfig';
import { adaptWeddingApi } from './weddingAdapter';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const weddingApi = {
  /**
   * Fetch wedding details by slug
   * PRD Section 14 & 30: GET /api/weddings/:slug
   */
  async getWeddingBySlug(slug = 'raka-alya') {
    try {
      const response = await fetch(`${API_BASE_URL}/weddings/${slug}`);

      if (response.status === 404) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Undangan tidak ditemukan');
      }

      if (!response.ok) {
        throw new Error(`Gagal memuat data undangan (HTTP ${response.status})`);
      }

      const json = await response.json();

      if (json.success && json.data) {
        const adapted = adaptWeddingApi(json.data);
        return {
          success: true,
          data: adapted,
          isLiveApi: true,
        };
      }

      throw new Error('Format data undangan tidak sesuai');
    } catch (err) {
      // In development, provide fallback for wedding static config if backend is unreachable
      if (import.meta.env.DEV && err.message !== 'Undangan tidak ditemukan') {
        console.warn(
          '[Wedding API Dev Fallback]: Backend tidak dapat dijangkau. Menggunakan data lokal.',
          err.message
        );
        return {
          success: true,
          data: weddingConfig,
          isFallback: true,
        };
      }

      throw err;
    }
  },

  /**
   * Fetch paginated wishes and statistics from PostgreSQL
   * PRD Section 30 & Requirement 6, 7, 8: GET /api/weddings/:slug/wishes?page=1&limit=10
   * Strictly NO dummy wishes fallback on failure!
   */
  async getWeddingWishes(slug = 'raka-alya', page = 1, limit = 10) {
    const response = await fetch(`${API_BASE_URL}/weddings/${slug}/wishes?page=${page}&limit=${limit}`);

    if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Undangan tidak ditemukan');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Gagal memuat ucapan (HTTP ${response.status})`);
    }

    const json = await response.json();
    if (json.success && json.data) {
      return json.data;
    }

    throw new Error('Format respons ucapan tidak valid');
  },

  /**
   * Submit RSVP & wish to backend
   * PRD Section 30 & Requirement 6, 9, 10, 14: POST /api/weddings/:slug/rsvp
   * Strictly NO local pseudo-success on failure!
   */
  async submitWeddingRsvp(slug = 'raka-alya', payload) {
    const response = await fetch(`${API_BASE_URL}/weddings/${slug}/rsvp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await response.json().catch(() => ({}));

    if (response.status === 429) {
      throw new Error(json.message || 'Terlalu banyak permintaan RSVP. Silakan coba beberapa saat lagi.');
    }

    if (!response.ok) {
      throw new Error(json.message || 'Ucapan gagal dikirim.');
    }

    if (json.success && json.data) {
      return json;
    }

    throw new Error('Respons server tidak valid');
  },

  /**
   * Health check
   * PRD Section 13: GET /api/health
   */
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch {
      return { success: false, database: 'disconnected' };
    }
  },
};
