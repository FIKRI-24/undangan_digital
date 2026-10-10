-- =============================================================================
-- Migration: 004_add_theme_config_and_multi_client.sql
-- Description: Adds theme_config JSONB to weddings for per-client custom appearance
--              and managed_wedding_id to admins for multi-client switching.
-- =============================================================================

ALTER TABLE weddings
ADD COLUMN IF NOT EXISTS theme_config JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE admins
ADD COLUMN IF NOT EXISTS managed_wedding_id INTEGER REFERENCES weddings(id) ON DELETE SET NULL;
