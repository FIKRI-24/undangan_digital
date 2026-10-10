import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import pool from './pool.js';

dotenv.config();

export async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const email = process.env.ADMIN_EMAIL || 'admin@wedding.local';
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;

  if (!initialPassword) {
    console.warn('[Seed Admin]: ADMIN_INITIAL_PASSWORD environment variable is not set. Skipping admin account creation.');
    return;
  }

  if (initialPassword.length < 8) {
    console.error('[Seed Admin Error]: ADMIN_INITIAL_PASSWORD must be at least 8 characters long.');
    throw new Error('ADMIN_INITIAL_PASSWORD too short');
  }

  try {
    // Check if an admin with the same username or email already exists
    const existing = await pool.query(
      'SELECT id, username, email FROM admins WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existing.rowCount > 0) {
      console.log(`[Seed Admin]: Admin account already exists (ID: ${existing.rows[0].id}, username: ${existing.rows[0].username}). Skipping creation.`);
      return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(initialPassword, saltRounds);

    const insertResult = await pool.query(
      `INSERT INTO admins (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username, email, passwordHash]
    );

    const newAdmin = insertResult.rows[0];
    console.log(`[Seed Admin]: Successfully created initial admin account (ID: ${newAdmin.id}, username: ${newAdmin.username}, email: ${newAdmin.email}).`);
  } catch (err) {
    console.error('[Seed Admin Error]: Failed to seed admin account:', err.message);
    throw err;
  }
}

// Standalone execution
if (process.argv[1] && process.argv[1].endsWith('seedAdmin.js')) {
  seedAdmin()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error(err);
      await pool.end();
      process.exit(1);
    });
}