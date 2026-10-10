import { Router } from 'express';
import {
  adminLogin,
  adminLogout,
  getAdminMe,
  changePassword,
} from '../controllers/adminAuthController.js';
import {
  getAdminWedding,
  updateBasicSettings,
  updateCouple,
  updateQuote,
  uploadMainPhoto,
  uploadMusic,
  updateThemeConfig,
  listWeddings,
  createWedding,
  selectWedding,
  deleteWedding,
} from '../controllers/adminWeddingController.js';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  reorderEvents,
} from '../controllers/adminEventController.js';
import {
  getStories,
  createStory,
  updateStory,
  deleteStory,
  reorderStories,
} from '../controllers/adminStoryController.js';
import {
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
  reorderGallery,
} from '../controllers/adminGalleryController.js';
import {
  getGifts,
  createGift,
  updateGift,
  deleteGift,
  reorderGifts,
  updateShipping,
} from '../controllers/adminGiftController.js';
import {
  getGuests,
  createGuest,
  updateGuest,
  deleteGuest,
} from '../controllers/adminGuestController.js';
import {
  getRsvps,
  deleteRsvp,
} from '../controllers/adminRsvpController.js';

import { requireAdmin } from '../middleware/adminAuth.js';
import { adminLoginLimiter } from '../middleware/adminLoginLimiter.js';
import { verifyAdminOrigin } from '../middleware/adminCsrfProtection.js';
import { uploadImage, uploadAudio } from '../middleware/uploadMiddleware.js';

const router = Router();

// =============================================================================
// AUTH ROUTES
// =============================================================================
// Public admin login (with dedicated rate limiter & CSRF origin check)
router.post('/auth/login', adminLoginLimiter, verifyAdminOrigin, adminLogin);
router.post('/auth/logout', verifyAdminOrigin, adminLogout);

// Protected Auth Endpoints
router.get('/auth/me', requireAdmin, getAdminMe);
router.put('/auth/password', requireAdmin, verifyAdminOrigin, changePassword);

// =============================================================================
// ALL SUBSEQUENT ROUTES REQUIRE ADMIN AUTHENTICATION
// =============================================================================
router.use(requireAdmin);

// =============================================================================
// MULTI-CLIENT WEDDINGS MANAGEMENT
// =============================================================================
router.get('/weddings', listWeddings);
router.post('/weddings', verifyAdminOrigin, createWedding);
router.post('/weddings/:id/select', verifyAdminOrigin, selectWedding);
router.delete('/weddings/:id', verifyAdminOrigin, deleteWedding);

// =============================================================================
// ACTIVE WEDDING & BASIC SETTINGS + THEME CUSTOMIZATION
// =============================================================================
router.get('/wedding', getAdminWedding);
router.put('/wedding/settings', verifyAdminOrigin, updateBasicSettings);
router.put('/wedding/couple', verifyAdminOrigin, updateCouple);
router.put('/wedding/quote', verifyAdminOrigin, updateQuote);
router.put('/wedding/theme', verifyAdminOrigin, updateThemeConfig);

// Main Photos & Music Upload
router.post(
  '/wedding/upload-photo',
  verifyAdminOrigin,
  uploadImage('couple'),
  uploadMainPhoto
);
router.post(
  '/wedding/upload-music',
  verifyAdminOrigin,
  uploadAudio(),
  uploadMusic
);

// =============================================================================
// EVENTS MANAGEMENT
// Static route /reorder registered BEFORE /:id (Rule #6)
// =============================================================================
router.get('/events', getEvents);
router.post('/events', verifyAdminOrigin, createEvent);
router.put('/events/reorder', verifyAdminOrigin, reorderEvents);
router.put('/events/:id', verifyAdminOrigin, updateEvent);
router.delete('/events/:id', verifyAdminOrigin, deleteEvent);

// =============================================================================
// STORIES MANAGEMENT
// Static route /reorder registered BEFORE /:id (Rule #6)
// =============================================================================
router.get('/stories', getStories);
router.post('/stories', verifyAdminOrigin, createStory);
router.put('/stories/reorder', verifyAdminOrigin, reorderStories);
router.put('/stories/:id', verifyAdminOrigin, updateStory);
router.delete('/stories/:id', verifyAdminOrigin, deleteStory);

// =============================================================================
// GALLERY MANAGEMENT
// Static route /reorder registered BEFORE /:id (Rule #6)
// =============================================================================
router.get('/gallery', getGallery);
router.post('/gallery', verifyAdminOrigin, uploadImage('gallery'), createGallery);
router.put('/gallery/reorder', verifyAdminOrigin, reorderGallery);
router.put('/gallery/:id', verifyAdminOrigin, updateGallery);
router.delete('/gallery/:id', verifyAdminOrigin, deleteGallery);

// =============================================================================
// GIFTS & SHIPPING MANAGEMENT
// Static routes /reorder and /shipping registered BEFORE /:id (Rule #6)
// =============================================================================
router.get('/gifts', getGifts);
router.post('/gifts', verifyAdminOrigin, createGift);
router.put('/gifts/reorder', verifyAdminOrigin, reorderGifts);
router.put('/gifts/shipping', verifyAdminOrigin, updateShipping);
router.put('/gifts/:id', verifyAdminOrigin, updateGift);
router.delete('/gifts/:id', verifyAdminOrigin, deleteGift);

// =============================================================================
// GUESTS MANAGEMENT
// =============================================================================
router.get('/guests', getGuests);
router.post('/guests', verifyAdminOrigin, createGuest);
router.put('/guests/:id', verifyAdminOrigin, updateGuest);
router.delete('/guests/:id', verifyAdminOrigin, deleteGuest);

// =============================================================================
// RSVPS & WISHES MANAGEMENT
// =============================================================================
router.get('/rsvps', getRsvps);
router.delete('/rsvps/:id', verifyAdminOrigin, deleteRsvp);

export default router;