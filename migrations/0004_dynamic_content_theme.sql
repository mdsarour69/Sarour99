PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS payment_methods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  method_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  account_label TEXT NOT NULL DEFAULT 'Account',
  account_value TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '💳',
  subtitle TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS homepage_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  icon TEXT NOT NULL DEFAULT '✨',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_active_sort ON payment_methods(active, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_homepage_cards_active_sort ON homepage_cards(active, sort_order, id);

INSERT OR IGNORE INTO payment_methods(method_key,label,account_label,account_value,icon,subtitle,active,sort_order)
VALUES
('bkash','bKash','bKash number',(SELECT value FROM settings WHERE key='payment_number'),'৳','Personal',1,10),
('nagad','Nagad','Nagad number',(SELECT value FROM settings WHERE key='payment_number'),'৳','Personal',1,20),
('binance','Binance Pay','Binance Pay UID',(SELECT value FROM settings WHERE key='binance_uid'),'₿','UID',1,30),
('telegram','Telegram Wallet','Telegram Wallet ID',COALESCE((SELECT value FROM settings WHERE key='telegram_wallet_id'),''),'✈','Wallet ID',1,40);

INSERT INTO homepage_cards(icon,title,description,active,sort_order)
SELECT '⚡','Fast checkout','Atomic stock and wallet updates prevent duplicate or invalid orders.',1,10
WHERE NOT EXISTS(SELECT 1 FROM homepage_cards);
INSERT INTO homepage_cards(icon,title,description,active,sort_order)
SELECT '◎','Admin visibility','Every user order, payment and message is stored in Cloudflare D1.',1,20
WHERE (SELECT COUNT(*) FROM homepage_cards)=1;
INSERT INTO homepage_cards(icon,title,description,active,sort_order)
SELECT '🛡','Secure sessions','Signed HttpOnly cookies protect user and admin sessions.',1,30
WHERE (SELECT COUNT(*) FROM homepage_cards)=2;

INSERT OR IGNORE INTO settings(key,value) VALUES
('theme_primary','#4f8cff'),
('theme_secondary','#7c5cff'),
('theme_surface','#151b23'),
('rainbow_enabled','0'),
('blood_style_enabled','0'),
('hero_title_line1','Digital products.'),
('hero_title_line2','Delivered with confidence.'),
('hero_description','Browse trusted subscriptions, pay securely, and track every purchase from one polished dashboard.'),
('footer_text','Secure digital commerce on Cloudflare');
