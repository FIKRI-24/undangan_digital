import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

async function ensureDatabaseExists() {
  const dbName = process.env.DB_NAME || 'wedding_invitation';
  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'postgres',
  });

  try {
    await adminClient.connect();
    const res = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );
    if (res.rowCount === 0) {
      console.log(`[Migration] Database "${dbName}" not found. Creating...`);
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`[Migration] Database "${dbName}" successfully created.`);
    } else {
      console.log(`[Migration] Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('[Migration Error]: Could not verify database existence:', err.message);
    throw err;
  } finally {
    await adminClient.end();
  }
}

async function runMigrations() {
  await ensureDatabaseExists();

  const migrationsDir = path.resolve(__dirname, '../../migrations');
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'wedding_invitation',
  });

  try {
    await client.connect();

    // 1. Create schema_migrations tracking table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        version VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Fetch already applied migrations
    const appliedRes = await client.query('SELECT version FROM schema_migrations');
    const appliedVersions = new Set(appliedRes.rows.map((row) => row.version));

    // Handle existing Phase 4 databases where 001 tables already exist
    const checkWeddingsTable = await client.query(
      "SELECT to_regclass('public.weddings') AS table_exists"
    );
    if (checkWeddingsTable.rows[0].table_exists && !appliedVersions.has('001_create_wedding_tables.sql')) {
      console.log('[Migration] Detected existing Phase 4 tables. Registering 001_create_wedding_tables.sql as applied.');
      await client.query(
        'INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT (version) DO NOTHING',
        ['001_create_wedding_tables.sql']
      );
      appliedVersions.add('001_create_wedding_tables.sql');
    }

    // 3. Read migration files sorted alphabetically
    const files = fs.readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (appliedVersions.has(file)) {
        console.log(`[Migration] Skipping ${file} (already applied).`);
        continue;
      }

      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`[Migration] Applying ${file}...`);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`[Migration] Successfully applied ${file}.`);
      } catch (migrationErr) {
        await client.query('ROLLBACK');
        console.error(`[Migration Error]: Failed executing ${file}:`, migrationErr.message);
        throw migrationErr;
      }
    }

    console.log('[Migration] All migrations are up to date!');
  } catch (err) {
    console.error('[Migration Error]: Migration execution failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
