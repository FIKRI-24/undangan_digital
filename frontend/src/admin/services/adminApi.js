const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/weddings$/, '')
  : 'http://localhost:3000/api';

const ADMIN_URL = `${API_BASE}/admin`;

let memoryToken = null;
let activeWeddingId =
  typeof window !== 'undefined' ? localStorage.getItem('admin_active_wedding_id') : null;

export const setMemoryToken = (token) => {
  memoryToken = token;
};

export const getMemoryToken = () => memoryToken;

export const setActiveWeddingId = (id) => {
  activeWeddingId = id ? String(id) : null;
  if (typeof window !== 'undefined') {
    if (activeWeddingId) {
      localStorage.setItem('admin_active_wedding_id', activeWeddingId);
    } else {
      localStorage.removeItem('admin_active_wedding_id');
    }
  }
};

export const getActiveWeddingId = () => activeWeddingId;

async function request(endpoint, options = {}) {
  const url = `${ADMIN_URL}${endpoint}`;
  const headers = { ...options.headers };

  if (memoryToken) {
    headers['Authorization'] = `Bearer ${memoryToken}`;
  }

  if (activeWeddingId) {
    headers['X-Wedding-Id'] = String(activeWeddingId);
  }

  // If payload is not FormData, default to JSON
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Sends HttpOnly cookie
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json.message || `Request failed with status ${response.status}`);
  }

  return json;
}

export const adminApi = {
  // Auth
  async login(username, password) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (res.data?.token) {
      setMemoryToken(res.data.token);
    }
    return res;
  },

  async logout() {
    try {
      const res = await request('/auth/logout', { method: 'POST' });
      setMemoryToken(null);
      return res;
    } catch (e) {
      setMemoryToken(null);
      return { success: true };
    }
  },

  async getMe() {
    return request('/auth/me');
  },

  async changePassword(current_password, new_password) {
    return request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ current_password, new_password }),
    });
  },

  // Multi-Client Weddings Management
  async getWeddings() {
    return request('/weddings');
  },

  async createWedding(data) {
    return request('/weddings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async selectWedding(id) {
    setActiveWeddingId(id);
    return request(`/weddings/${id}/select`, {
      method: 'POST',
    });
  },

  async deleteWedding(id) {
    return request(`/weddings/${id}`, {
      method: 'DELETE',
    });
  },

  // Wedding & Settings + Theme
  async getWedding() {
    return request('/wedding');
  },

  async updateBasicSettings(data) {
    return request('/wedding/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateTheme(theme_config) {
    return request('/wedding/theme', {
      method: 'PUT',
      body: JSON.stringify({ theme_config }),
    });
  },

  async updateCouple(data) {
    return request('/wedding/couple', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateQuote(data) {
    return request('/wedding/quote', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async uploadMainPhoto(file, photoType) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('photo_type', photoType);
    return request('/wedding/upload-photo', {
      method: 'POST',
      body: formData,
    });
  },

  async uploadMusic(file) {
    const formData = new FormData();
    formData.append('file', file);
    return request('/wedding/upload-music', {
      method: 'POST',
      body: formData,
    });
  },

  // Events
  async getEvents() {
    return request('/events');
  },
  async createEvent(data) {
    return request('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateEvent(id, data) {
    return request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async deleteEvent(id) {
    return request(`/events/${id}`, { method: 'DELETE' });
  },
  async reorderEvents(items) {
    return request('/events/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
  },

  // Stories
  async getStories() {
    return request('/stories');
  },
  async createStory(formData) {
    return request('/stories', {
      method: 'POST',
      body: formData instanceof FormData ? formData : JSON.stringify(formData),
    });
  },
  async updateStory(id, formData) {
    return request(`/stories/${id}`, {
      method: 'PUT',
      body: formData instanceof FormData ? formData : JSON.stringify(formData),
    });
  },
  async deleteStory(id) {
    return request(`/stories/${id}`, { method: 'DELETE' });
  },
  async reorderStories(items) {
    return request('/stories/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
  },

  // Gallery
  async getGallery() {
    return request('/gallery');
  },
  async uploadGallery(formData) {
    return request('/gallery', {
      method: 'POST',
      body: formData,
    });
  },
  async updateGallery(id, data) {
    return request(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async deleteGallery(id) {
    return request(`/gallery/${id}`, { method: 'DELETE' });
  },
  async reorderGallery(items) {
    return request('/gallery/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
  },

  // Gifts & Shipping
  async getGifts() {
    return request('/gifts');
  },
  async createGift(data) {
    return request('/gifts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateGift(id, data) {
    return request(`/gifts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async deleteGift(id) {
    return request(`/gifts/${id}`, { method: 'DELETE' });
  },
  async reorderGifts(items) {
    return request('/gifts/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
  },
  async updateShipping(data) {
    return request('/gifts/shipping', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Guests
  async getGuests() {
    return request('/guests');
  },
  async createGuest(data) {
    return request('/guests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateGuest(id, data) {
    return request(`/guests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async deleteGuest(id) {
    return request(`/guests/${id}`, { method: 'DELETE' });
  },

  // RSVPs
  async getRsvps(attendance = '') {
    const query = attendance ? `?attendance=${encodeURIComponent(attendance)}` : '';
    return request(`/rsvps${query}`);
  },
  async deleteRsvp(id) {
    return request(`/rsvps/${id}`, { method: 'DELETE' });
  },
};