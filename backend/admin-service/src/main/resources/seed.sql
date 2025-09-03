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

-- Seed specific user and subscription, updating if they already exist
INSERT INTO users (email, password_hash, name, role, created_at, updated_at, email_confirmed)
VALUES (
  'youssef.bannouni@hotmail.com',
  '$2a$10$K7kuF0e7dnM0Qwq5H2fApu5mQ7eQ8zFz2Qm5mMecH8u7E4bq6qfWS', -- bcrypt for 'admin1234' (placeholder)
  'youssef',
  'USER',
  NOW(), NOW(),
  TRUE
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  email_confirmed = TRUE,
  updated_at = NOW();

-- Ensure a FREE_TRIAL_7D subscription exists for this user
INSERT INTO subscriptions (user_id, plan_id, status, start_at, trial_end_at)
SELECT u.id, p.id, 'TRIALING', NOW(), NOW() + INTERVAL '7 days'
FROM users u
JOIN plans p ON p.code = 'FREE_TRIAL_7D'
WHERE u.email = 'youssef.bannouni@hotmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM subscriptions s WHERE s.user_id = u.id
  );
