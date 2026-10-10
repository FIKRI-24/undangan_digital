-- =============================================================================
-- Migration: 001_create_wedding_tables.sql
-- Description: Creates initial schema for weddings, events, stories, gallery, gifts, and shipping.
-- Based on PRD Section 29 (DATABASE)
-- =============================================================================

CREATE TABLE IF NOT EXISTS weddings (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    groom_short_name VARCHAR(100) NOT NULL,
    groom_full_name VARCHAR(200) NOT NULL,
    groom_father VARCHAR(200),
    groom_mother VARCHAR(200),
    groom_family_label VARCHAR(100),
    groom_instagram VARCHAR(100),
    groom_photo VARCHAR(500),
    bride_short_name VARCHAR(100) NOT NULL,
    bride_full_name VARCHAR(200) NOT NULL,
    bride_father VARCHAR(200),
    bride_mother VARCHAR(200),
    bride_family_label VARCHAR(100),
    bride_instagram VARCHAR(100),
    bride_photo VARCHAR(500),
    cover_photo VARCHAR(500),
    hero_photo VARCHAR(500),
    closing_photo VARCHAR(500),
    quote_title VARCHAR(200),
    quote_text TEXT,
    quote_source VARCHAR(200),
    invitation_intro TEXT,
    music_url VARCHAR(500),
    timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    wedding_id INTEGER NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    date_label VARCHAR(100),
    start_time VARCHAR(50),
    end_time VARCHAR(50),
    end_time_label VARCHAR(50),
    venue VARCHAR(200),
    address TEXT,
    maps_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stories (
    id SERIAL PRIMARY KEY,
    wedding_id INTEGER NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    date_label VARCHAR(100),
    body TEXT,
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    wedding_id INTEGER NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    width INTEGER,
    height INTEGER,
    object_position VARCHAR(50) DEFAULT '50% 50%',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gifts (
    id SERIAL PRIMARY KEY,
    wedding_id INTEGER NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    account_holder VARCHAR(200) NOT NULL,
    account_number VARCHAR(100) NOT NULL,
    logo_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gift_shipping (
    id SERIAL PRIMARY KEY,
    wedding_id INTEGER NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    recipient VARCHAR(200) NOT NULL,
    phone VARCHAR(50),
    address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- Indexes
-- =============================================================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_weddings_slug ON weddings(slug);
CREATE INDEX IF NOT EXISTS idx_events_wedding_id ON events(wedding_id);
CREATE INDEX IF NOT EXISTS idx_stories_wedding_id ON stories(wedding_id);
CREATE INDEX IF NOT EXISTS idx_gallery_wedding_id ON gallery(wedding_id);
CREATE INDEX IF NOT EXISTS idx_gifts_wedding_id ON gifts(wedding_id);
CREATE INDEX IF NOT EXISTS idx_gift_shipping_wedding_id ON gift_shipping(wedding_id);
