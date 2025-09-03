-- Default reminder rules (global)
-- Uses uuid_generate_v4() from uuid-ossp extension created by admin-service
INSERT INTO reminder_rule (id, org_id, client_id, name, days_after_due, enabled, created_at, updated_at)
SELECT uuid_generate_v4(), NULL, NULL, 'Reminder before due (3 days)', -3, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM reminder_rule WHERE org_id IS NULL AND client_id IS NULL AND days_after_due = -3
);

INSERT INTO reminder_rule (id, org_id, client_id, name, days_after_due, enabled, created_at, updated_at)
SELECT uuid_generate_v4(), NULL, NULL, 'On due date', 0, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM reminder_rule WHERE org_id IS NULL AND client_id IS NULL AND days_after_due = 0
);

INSERT INTO reminder_rule (id, org_id, client_id, name, days_after_due, enabled, created_at, updated_at)
SELECT uuid_generate_v4(), NULL, NULL, 'After due (7 days)', 7, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM reminder_rule WHERE org_id IS NULL AND client_id IS NULL AND days_after_due = 7
);

INSERT INTO reminder_rule (id, org_id, client_id, name, days_after_due, enabled, created_at, updated_at)
SELECT uuid_generate_v4(), NULL, NULL, 'After due (21 days)', 21, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM reminder_rule WHERE org_id IS NULL AND client_id IS NULL AND days_after_due = 21
);


-- Seed per-user default reminder rules for the seed user
-- Assumes admin-service created the users table and seeded the user
INSERT INTO reminder_rule (id, org_id, client_id, name, days_after_due, enabled, created_at, updated_at)
SELECT 'dddddddd-dddd-dddd-dddd-dddddddddd01', u.id, NULL, 'Reminder before due (3 days)', -3, TRUE, NOW(), NOW()
FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
AND NOT EXISTS (
  SELECT 1 FROM reminder_rule r WHERE r.org_id = u.id AND r.client_id IS NULL AND r.days_after_due = -3
);

INSERT INTO reminder_rule (id, org_id, client_id, name, days_after_due, enabled, created_at, updated_at)
SELECT 'dddddddd-dddd-dddd-dddd-dddddddddd02', u.id, NULL, 'On due date', 0, TRUE, NOW(), NOW()
FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
AND NOT EXISTS (
  SELECT 1 FROM reminder_rule r WHERE r.org_id = u.id AND r.client_id IS NULL AND r.days_after_due = 0
);

INSERT INTO reminder_rule (id, org_id, client_id, name, days_after_due, enabled, created_at, updated_at)
SELECT 'dddddddd-dddd-dddd-dddd-dddddddddd03', u.id, NULL, 'After due (7 days)', 7, TRUE, NOW(), NOW()
FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
AND NOT EXISTS (
  SELECT 1 FROM reminder_rule r WHERE r.org_id = u.id AND r.client_id IS NULL AND r.days_after_due = 7
);

INSERT INTO reminder_rule (id, org_id, client_id, name, days_after_due, enabled, created_at, updated_at)
SELECT 'dddddddd-dddd-dddd-dddd-dddddddddd04', u.id, NULL, 'After due (21 days)', 21, TRUE, NOW(), NOW()
FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
AND NOT EXISTS (
  SELECT 1 FROM reminder_rule r WHERE r.org_id = u.id AND r.client_id IS NULL AND r.days_after_due = 21
);


-- Seed per-user default mail templates for the seed user
-- Assumes admin-service created the users table and seeded the user
INSERT INTO mail_template (id, org_id, name, type, subject, body_html, created_at, updated_at)
SELECT 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', u.id, 'TPL-INVOICE', 'INVOICE', 'Invoice [Invoice #] from [Your Name]', 'Please find attached invoice [Invoice #]. Due date: [Due Date].', NOW(), NOW()
FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
AND NOT EXISTS (
  SELECT 1 FROM mail_template t WHERE t.org_id = u.id AND t.name = 'TPL-INVOICE'
);

INSERT INTO mail_template (id, org_id, name, type, subject, body_html, created_at, updated_at)
SELECT 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', u.id, 'TPL-REMINDER', 'REMINDER', 'Reminder: Invoice [Invoice #] from [Your Name]', 'Just a friendly reminder that invoice [Invoice #] is due on [Due Date].', NOW(), NOW()
FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
AND NOT EXISTS (
  SELECT 1 FROM mail_template t WHERE t.org_id = u.id AND t.name = 'TPL-REMINDER'
);

INSERT INTO mail_template (id, org_id, name, type, subject, body_html, created_at, updated_at)
SELECT 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', u.id, 'TPL-RECEIPT', 'RECEIPT', 'Receipt for Invoice [Invoice #]', 'Thank you for your payment for invoice [Invoice #].', NOW(), NOW()
FROM users u WHERE u.email = 'youssef.bannouni@hotmail.com'
AND NOT EXISTS (
  SELECT 1 FROM mail_template t WHERE t.org_id = u.id AND t.name = 'TPL-RECEIPT'
);
