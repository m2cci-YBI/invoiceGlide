-- Seed full sample dataset linked to the seed user (look up by email)

-- Clients (5 total; Initech archived)
INSERT INTO inv_clients (id, user_id, name, email, phone, currency, region, archived, created_at, updated_at)
SELECT 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid, u.id, 'Acme Corp',      'billing@acme.com',     '555-123-4567', 'USD', 'North America', FALSE, NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL
SELECT 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2'::uuid, u.id, 'Globex Inc.',    'accounts@globex.com',  '555-987-6543', 'CAD', 'North America', FALSE, NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL
SELECT 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3'::uuid, u.id, 'Soylent Corp',   'finance@soylent.com',  '555-555-1212', 'EUR', 'Europe',        FALSE, NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL
SELECT 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4'::uuid, u.id, 'Initech',        'ap@initech.com',       '555-333-2222', 'USD', 'North America', TRUE,  NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL
SELECT 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5'::uuid, u.id, 'Umbrella Corp',  'payments@umbrella.com','555-777-8888', 'GBP', 'Europe',        FALSE, NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
ON CONFLICT (id) DO NOTHING;

-- Invoices (20 total; omit id to use DEFAULT gen_random_uuid())
INSERT INTO inv_invoices (user_id, number, client_id, client_name, issue_date, due_date, currency, subtotal, tax_total, discount_total, total, status, taxes_json, discounts_json, created_at, updated_at)
SELECT u.id, 'INV-2025-001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid, 'Acme Corp',  DATE '2025-08-05', DATE '2025-08-19', 'USD', 1200, 156, 0, 1356, 'COLLECTED', '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2'::uuid, 'Globex Inc.', DATE '2025-08-10', DATE '2025-09-10', 'CAD', 800, 104, 0, 904, 'OPEN',       '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3'::uuid, 'Soylent Corp', DATE '2025-08-15', DATE '2025-08-29', 'EUR', 300, 39, 0, 339, 'COLLECTED',   '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-016', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid, 'Acme Corp',    DATE '2025-08-01', DATE '2025-08-10', 'USD', 500, 65, 0, 565, 'OVERDUE',     '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5'::uuid, 'Umbrella Corp',DATE '2025-07-01', DATE '2025-07-15', 'GBP', 2500, 325, 0, 2825, 'COLLECTED', '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid, 'Acme Corp',    DATE '2025-07-10', DATE '2025-09-15', 'USD', 1500, 195, 0, 1695, 'OPEN',       '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-006', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2'::uuid, 'Globex Inc.',  DATE '2025-07-20', DATE '2025-08-03', 'CAD', 700, 91, 0, 791, 'COLLECTED',   '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-017', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2'::uuid, 'Globex Inc.',  DATE '2025-07-05', DATE '2025-07-15', 'CAD', 1000,130, 0, 1130, 'OVERDUE',    '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-007', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3'::uuid, 'Soylent Corp', DATE '2025-06-01', DATE '2025-06-15', 'EUR', 400, 52, 0, 452, 'COLLECTED',   '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-008', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5'::uuid, 'Umbrella Corp',DATE '2025-06-10', DATE '2025-09-20', 'GBP', 3000,390, 0, 3390, 'OPEN',       '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-009', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid, 'Acme Corp',    DATE '2025-06-20', DATE '2025-07-04', 'USD', 1000,130, 0, 1130, 'COLLECTED',  '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-010', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2'::uuid, 'Globex Inc.',  DATE '2025-05-05', DATE '2025-05-19', 'CAD', 900, 117,0, 1017, 'COLLECTED',  '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-011', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3'::uuid, 'Soylent Corp', DATE '2025-05-15', DATE '2025-09-25', 'EUR', 600, 78, 0, 678, 'OPEN',        '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-019', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2'::uuid, 'Globex Inc.',  DATE '2025-05-01', DATE '2025-05-10', 'CAD', 200, 26, 0, 226, 'OVERDUE',     '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-012', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5'::uuid, 'Umbrella Corp',DATE '2025-04-01', DATE '2025-04-15', 'GBP', 2000,260, 0, 2260, 'COLLECTED', '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-013', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid, 'Acme Corp',    DATE '2025-04-10', DATE '2025-04-24', 'USD', 1100,143, 0, 1243, 'COLLECTED',  '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-020', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid, 'Acme Corp',    DATE '2025-04-05', DATE '2025-04-15', 'USD', 1500,195, 0, 1695, 'OVERDUE',     '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-014', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2'::uuid, 'Globex Inc.',  DATE '2025-03-05', DATE '2025-03-19', 'CAD', 1300,169,0, 1469, 'COLLECTED',  '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-015', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3'::uuid, 'Soylent Corp', DATE '2025-03-15', DATE '2025-03-29', 'EUR', 500, 65, 0, 565, 'COLLECTED',   '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
UNION ALL SELECT u.id, 'INV-2025-021', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2'::uuid, 'Globex Inc.',  DATE '2025-03-10', DATE '2025-03-20', 'CAD', 800, 104,0, 904, 'OVERDUE',     '[{"name":"HST","ratePct":13}]', '[]', NOW(), NOW() FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
ON CONFLICT (number) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  client_id = EXCLUDED.client_id,
  client_name = EXCLUDED.client_name,
  issue_date = EXCLUDED.issue_date,
  due_date = EXCLUDED.due_date,
  currency = EXCLUDED.currency,
  subtotal = EXCLUDED.subtotal,
  tax_total = EXCLUDED.tax_total,
  discount_total = EXCLUDED.discount_total,
  total = EXCLUDED.total,
  status = EXCLUDED.status,
  taxes_json = EXCLUDED.taxes_json,
  discounts_json = EXCLUDED.discounts_json,
  updated_at = NOW();

-- One default line per invoice; avoid duplicates
INSERT INTO inv_invoice_lines (invoice_id, description, qty, unit, unit_price, line_total)
SELECT inv.id, 'Service', 1, 'unit', inv.subtotal, inv.subtotal
FROM inv_invoices inv
JOIN (
  VALUES
    ('INV-2025-001'),('INV-2025-002'),('INV-2025-003'),('INV-2025-004'),('INV-2025-005'),
    ('INV-2025-006'),('INV-2025-007'),('INV-2025-008'),('INV-2025-009'),('INV-2025-010'),
    ('INV-2025-011'),('INV-2025-012'),('INV-2025-013'),('INV-2025-014'),('INV-2025-015'),
    ('INV-2025-016'),('INV-2025-017'),('INV-2025-019'),('INV-2025-020'),('INV-2025-021')
) AS t(num) ON inv.number = t.num
WHERE NOT EXISTS (SELECT 1 FROM inv_invoice_lines li WHERE li.invoice_id = inv.id);


-- Invoice Settings
INSERT INTO inv_settings (user_id, date_format, currency, created_at, updated_at)
SELECT u.id, 'MM/dd/yyyy', 'USD', NOW(), NOW()
FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
ON CONFLICT (user_id) DO NOTHING;