PRAGMA foreign_keys = ON;

-- The Worker runtime safely adds the two order contact columns when missing.
-- Keeping this migration idempotent avoids duplicate-column errors on databases
-- that were already auto-upgraded by a deployed Worker.
INSERT OR IGNORE INTO settings(key,value) VALUES
('telegram_id',''),
('post_purchase_message','দয়া করে প্রোডাক্ট পেতে Telegram অথবা WhatsApp-এ মেসেজ দিন।');

UPDATE settings SET value='' WHERE key='telegram' AND value='8801783866415';
