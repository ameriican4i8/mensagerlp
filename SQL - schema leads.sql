CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_session_id VARCHAR(100) UNIQUE NOT NULL,
  nickname VARCHAR(80) NOT NULL,
  fbp TEXT,
  fbc TEXT,
  fbclid TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  landing_page_url TEXT,
  messenger_sender_id VARCHAR(255),
  messenger_message_id VARCHAR(255),
  messenger_page_id VARCHAR(255),
  meta_event_id VARCHAR(255) UNIQUE,
  first_message_at TIMESTAMPTZ,
  status VARCHAR(50) NOT NULL DEFAULT 'started',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_messenger_sender_id_idx
  ON leads (messenger_sender_id);

CREATE INDEX IF NOT EXISTS leads_status_idx
  ON leads (status);