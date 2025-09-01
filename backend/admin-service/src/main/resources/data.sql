-- Seed an admin user (password: admin1234) and a free trial plan
INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at)
VALUES (
  uuid_generate_v4(),
  'admin@example.com',
  '$2a$10$K7kuF0e7dnM0Qwq5H2fApu5mQ7eQ8zFz2Qm5mMecH8u7E4bq6qfWS', -- bcrypt for 'admin1234' (example)
  'Administrator',
  'ADMIN',
  NOW(), NOW()
) ON CONFLICT DO NOTHING;

INSERT INTO plans (id, code, name, price_cents, currency, interval, trial_days, active, features_json)
VALUES (
  uuid_generate_v4(),
  'FREE_TRIAL_7D',
  'Free Trial',
  0,
  'USD',
  'MONTH',
  7,
  true,
  '{"features":["Invoices","Email templates","Reminders"]}'
) ON CONFLICT DO NOTHING;

-- Seed paid plans
INSERT INTO plans (id, code, name, price_cents, currency, interval, trial_days, active, features_json)
VALUES (
  uuid_generate_v4(),
  'BASIC_MONTHLY',
  'Basic',
  2000,
  'USD',
  'MONTH',
  0,
  true,
  '{"features":["Up to 200 invoices/yr","Reminders automation","Receipts & audit log"]}'
) ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  currency = EXCLUDED.currency,
  interval = EXCLUDED.interval,
  trial_days = EXCLUDED.trial_days,
  active = EXCLUDED.active,
  features_json = EXCLUDED.features_json;

INSERT INTO plans (id, code, name, price_cents, currency, interval, trial_days, active, features_json)
VALUES (
  uuid_generate_v4(),
  'PRO_MONTHLY',
  'Pro',
  20000,
  'USD',
  'YEAR',
  0,
  true,
  '{"features":["Unlimited invoices","Multi-user access","Priority support"]}'
) ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  currency = EXCLUDED.currency,
  interval = EXCLUDED.interval,
  trial_days = EXCLUDED.trial_days,
  active = EXCLUDED.active,
  features_json = EXCLUDED.features_json;
