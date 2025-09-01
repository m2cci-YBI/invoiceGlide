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
