-- Neutralized: this migration previously created QA test accounts in auth.users
-- with a hardcoded password. Test users must never live in migrations.
-- Create them ad-hoc during a QA session and delete them in the same session.
-- No-op.
SELECT 1;
