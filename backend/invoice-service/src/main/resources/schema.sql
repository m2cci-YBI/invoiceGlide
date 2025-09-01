CREATE TABLE IF NOT EXISTS inv_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64),
  currency VARCHAR(16) NOT NULL,
  region VARCHAR(64),
  address TEXT,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS inv_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  number VARCHAR(64) NOT NULL UNIQUE,
  client_id UUID NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  currency VARCHAR(16) NOT NULL,
  subtotal NUMERIC(14,2) NOT NULL,
  tax_total NUMERIC(14,2) NOT NULL,
  discount_total NUMERIC(14,2) NOT NULL,
  total NUMERIC(14,2) NOT NULL,
  status VARCHAR(16) NOT NULL,
  taxes_json TEXT,
  discounts_json TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS inv_invoice_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES inv_invoices(id) ON DELETE CASCADE,
  description TEXT,
  qty NUMERIC(14,2),
  unit VARCHAR(32),
  unit_price NUMERIC(14,2),
  line_total NUMERIC(14,2)
);

CREATE TABLE IF NOT EXISTS inv_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  legal_name VARCHAR(255),
  tax_id VARCHAR(128),
  support_email VARCHAR(255),
  legal_footer TEXT,
  currency VARCHAR(16),
  date_format VARCHAR(32),
  number_format VARCHAR(32),
  logo_data_url TEXT,
  invoice_number_prefix VARCHAR(64),
  invoice_number_counter INTEGER,
  template_taxes_json TEXT,
  template_discounts_json TEXT,
  invoice_styles_json TEXT,
  email_templates_json TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Backfill: ensure address column exists on inv_clients for existing DBs
ALTER TABLE IF EXISTS inv_clients ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE IF EXISTS inv_invoices ADD COLUMN IF NOT EXISTS taxes_json TEXT;
ALTER TABLE IF EXISTS inv_invoices ADD COLUMN IF NOT EXISTS discounts_json TEXT;
