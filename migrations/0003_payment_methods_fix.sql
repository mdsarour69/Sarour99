-- Restore the requested four manual payment methods and ensure manual deposits are enabled.
INSERT INTO settings(key,value) VALUES('manual_payment_enabled','1')
ON CONFLICT(key) DO UPDATE SET value='1';

INSERT OR IGNORE INTO settings(key,value) VALUES
('telegram_wallet_id','');
