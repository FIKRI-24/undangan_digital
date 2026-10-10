import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import healthRoutes from './routes/healthRoutes.js';
import weddingRoutes from './routes/weddingRoutes.js';
import rsvpRoutes from './routes/rsvpRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security HTTP headers (allow cross-origin resource policy for static assets)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cookie parser for HttpOnly admin auth cookies
app.use(cookieParser());

// CORS configuration (PRD Section 12 & 36)
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl) or matching allowed origin
      if (!origin || origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for this origin'));
      }
    },
    credentials: true,
  })
);

// Body parser with 1mb limit (PRD Section 12)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Static uploads route for user-uploaded assets (images & audio)
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.resolve(__dirname, '../uploads'))
);

// Public API Routes (NO authentication required!)
app.use('/api/health', healthRoutes);
app.use('/api/weddings', rsvpRoutes);
app.use('/api/weddings', weddingRoutes);

// Admin Management API Routes (Protected by adminAuth within router)
app.use('/api/admin', adminRoutes);

// 404 Route Not Found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route [${req.method}] ${req.originalUrl} tidak ditemukan`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
