import app from './src/app.js';
import pool from './src/db/pool.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = parseInt(process.env.PORT, 10) || 3000;

const server = app.listen(PORT, () => {
  console.log(`[Server] Wedding API server running on http://localhost:${PORT}`);
  console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[Server] Wedding endpoint: http://localhost:${PORT}/api/weddings/raka-alya`);
});

// Graceful Shutdown
async function shutdown(signal) {
  console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
  server.close(async () => {
    console.log('[Server] HTTP server closed.');
    try {
      await pool.end();
      console.log('[PostgreSQL] Connection pool closed.');
      process.exit(0);
    } catch (err) {
      console.error('[PostgreSQL Error]: Error closing pool:', err.message);
      process.exit(1);
    }
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
