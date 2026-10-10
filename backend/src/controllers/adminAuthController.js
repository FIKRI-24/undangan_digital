import bcrypt from 'bcryptjs';
import pool from '../db/pool.js';
import { signAdminToken } from '../utils/jwt.js';

const COOKIE_NAME = 'admin_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

export async function adminLogin(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username/email dan password wajib diisi.',
      });
    }

    // Lookup admin by username or email
    const cleanUser = String(username).trim();
    const adminRes = await pool.query(
      'SELECT id, username, email, password_hash FROM admins WHERE username = $1 OR email = $1 LIMIT 1',
      [cleanUser]
    );

    // Constant-time comparison prevention: if not found, use generic message
    if (adminRes.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: 'Username/email atau password salah.',
      });
    }

    const admin = adminRes.rows[0];
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Username/email atau password salah.',
      });
    }

    // Generate JWT token
    const token = signAdminToken({
      id: admin.id,
      username: admin.username,
      email: admin.email,
    });

    // Set secure HttpOnly cookie
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    // Return sanitized profile (NEVER expose password_hash)
    return res.status(200).json({
      success: true,
      message: 'Login admin berhasil.',
      data: {
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
        },
        token, // Included for API testing/tools while cookie is primary for browser
      },
    });
  } catch (err) {
    console.error('[Admin Login Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat login.',
    });
  }
}

export async function adminLogout(req, res) {
  try {
    res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
    return res.status(200).json({
      success: true,
      message: 'Berhasil keluar dari sesi admin.',
    });
  } catch (err) {
    console.error('[Admin Logout Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat logout.',
    });
  }
}

export async function getAdminMe(req, res) {
  try {
    const weddingsRes = await pool.query(
      `SELECT id, slug, title, groom_short_name, bride_short_name, status, theme_config, created_at
       FROM weddings
       ORDER BY id ASC`
    );
    return res.status(200).json({
      success: true,
      data: {
        admin: req.admin,
        wedding: req.wedding,
        weddings: weddingsRes.rows,
      },
    });
  } catch (err) {
    console.error('[Get Admin Me Error]:', err.message);
    return res.status(200).json({
      success: true,
      data: {
        admin: req.admin,
        wedding: req.wedding,
        weddings: [req.wedding],
      },
    });
  }
}

export async function changePassword(req, res) {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Password saat ini dan password baru wajib diisi.',
      });
    }

    if (new_password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password baru minimal harus 8 karakter.',
      });
    }

    // Fetch existing password hash
    const adminRes = await pool.query(
      'SELECT password_hash FROM admins WHERE id = $1',
      [req.admin.id]
    );

    if (adminRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Akun admin tidak ditemukan.',
      });
    }

    const isMatch = await bcrypt.compare(current_password, adminRes.rows[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Password saat ini yang Anda masukkan salah.',
      });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    await pool.query(
      'UPDATE admins SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newHash, req.admin.id]
    );

    // Refresh cookie
    const token = signAdminToken({
      id: req.admin.id,
      username: req.admin.username,
      email: req.admin.email,
    });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    return res.status(200).json({
      success: true,
      message: 'Password berhasil diperbarui.',
      data: { token },
    });
  } catch (err) {
    console.error('[Change Password Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengganti password.',
    });
  }
}