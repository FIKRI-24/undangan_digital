-- =============================================================================
-- Migration: 002_create_rsvp_tables.sql
-- Description: Creates guests and rsvps tables with constraints and indexes.
-- =============================================================================

CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    wedding_id INTEGER NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    invitation_code VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rsvps (
    id SERIAL PRIMARY KEY,
    wedding_id INTEGER NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    guest_id INTEGER REFERENCES guests(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    attendance VARCHAR(20) NOT NULL CHECK (attendance IN ('hadir', 'tidak_hadir', 'ragu')),
    guest_count INTEGER,
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        guest_count IS NULL
        OR guest_count BETWEEN 1 AND 10
    )
);

-- Indexes for guests table
CREATE INDEX IF NOT EXISTS idx_guests_wedding_id ON guests(wedding_id);
CREATE INDEX IF NOT EXISTS idx_guests_invitation_code ON guests(invitation_code);

-- Indexes for rsvps table
CREATE INDEX IF NOT EXISTS idx_rsvps_wedding_id ON rsvps(wedding_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at);
CREATE INDEX IF NOT EXISTS idx_rsvps_attendance ON rsvps(attendance);
