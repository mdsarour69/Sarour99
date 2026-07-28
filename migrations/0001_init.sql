PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  icon TEXT NOT NULL DEFAULT '🛍️',
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Other',
  price REAL NOT NULL CHECK(price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  balance REAL NOT NULL DEFAULT 0 CHECK(balance >= 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  product_id INTEGER,
  product_name TEXT NOT NULL,
  product_icon TEXT NOT NULL DEFAULT '🛍️',
  amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'Completed',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS deposits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  amount REAL NOT NULL CHECK(amount > 0),
  method TEXT NOT NULL,
  txid TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Unread',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT OR IGNORE INTO settings(key,value) VALUES
('store_name','Sarour Store'),
('whatsapp','8801783866415'),
('telegram',''),
('payment_number','01783866415'),
('binance_uid','993556753');

INSERT INTO products(icon,name,description,category,price,stock) SELECT '✨','Gemini AI Pro','Premium AI subscription','AI',8,15 WHERE NOT EXISTS(SELECT 1 FROM products);
INSERT INTO products(icon,name,description,category,price,stock) SELECT '◉','ChatGPT Plus','One-month premium subscription','AI',20,10 WHERE (SELECT COUNT(*) FROM products)=1;
INSERT INTO products(icon,name,description,category,price,stock) SELECT '🔵','NordVPN','Secure VPN subscription','Security',4,15 WHERE (SELECT COUNT(*) FROM products)=2;
INSERT INTO products(icon,name,description,category,price,stock) SELECT '▶️','YouTube Premium','Premium entertainment plan','Entertainment',2,15 WHERE (SELECT COUNT(*) FROM products)=3;
