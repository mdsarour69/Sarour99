PRAGMA foreign_keys = ON;

ALTER TABLE products ADD COLUMN featured INTEGER NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN delivery_note TEXT NOT NULL DEFAULT '';
ALTER TABLE products ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;

ALTER TABLE users ADD COLUMN display_name TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN email TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN phone TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN last_seen_at TEXT;

ALTER TABLE orders ADD COLUMN quantity INTEGER NOT NULL DEFAULT 1;
ALTER TABLE orders ADD COLUMN customer_note TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN updated_at TEXT;
UPDATE orders SET updated_at = created_at WHERE updated_at IS NULL;

ALTER TABLE deposits ADD COLUMN currency TEXT NOT NULL DEFAULT 'USD';
ALTER TABLE deposits ADD COLUMN provider TEXT NOT NULL DEFAULT 'Manual';
ALTER TABLE deposits ADD COLUMN provider_reference TEXT NOT NULL DEFAULT '';
ALTER TABLE deposits ADD COLUMN admin_note TEXT NOT NULL DEFAULT '';
ALTER TABLE deposits ADD COLUMN metadata_json TEXT NOT NULL DEFAULT '{}';

ALTER TABLE messages ADD COLUMN updated_at TEXT;
UPDATE messages SET updated_at = created_at WHERE updated_at IS NULL;

CREATE TABLE IF NOT EXISTS wallet_ledger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  entry_type TEXT NOT NULL CHECK(entry_type IN ('CREDIT','DEBIT')),
  amount REAL NOT NULL CHECK(amount > 0),
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  UNIQUE(source_type, source_id, entry_type)
);

CREATE TABLE IF NOT EXISTS payment_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'SSLCOMMERZ',
  amount REAL NOT NULL CHECK(amount > 0),
  currency TEXT NOT NULL DEFAULT 'BDT',
  status TEXT NOT NULL DEFAULT 'Initiated',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  gateway_url TEXT NOT NULL DEFAULT '',
  gateway_session_key TEXT NOT NULL DEFAULT '',
  validation_id TEXT NOT NULL DEFAULT '',
  bank_transaction_id TEXT NOT NULL DEFAULT '',
  risk_level INTEGER NOT NULL DEFAULT 0,
  raw_response_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wallet_adjustments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount_signed REAL NOT NULL CHECK(amount_signed <> 0),
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  ip TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  window_started_at INTEGER NOT NULL,
  locked_until INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL DEFAULT '',
  target_id TEXT NOT NULL DEFAULT '',
  details TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_active_sort ON products(active, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_deposits_user_created ON deposits(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_deposits_status_created ON deposits(status, created_at);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_user_created ON payment_sessions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_status_created ON payment_sessions(status, created_at);
CREATE INDEX IF NOT EXISTS idx_wallet_ledger_user_created ON wallet_ledger(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_status_created ON messages(status, created_at);

INSERT OR IGNORE INTO settings(key,value) VALUES
('store_tagline','Premium digital products with secure delivery'),
('store_currency','USD'),
('support_email',''),
('manual_payment_enabled','1'),
('auto_payment_enabled','0'),
('payment_instructions','Send payment, then submit the exact transaction ID.'),
('announcement','Secure checkout and verified payment processing.'),
('maintenance_mode','0');

DROP TRIGGER IF EXISTS trg_order_validate;
DROP TRIGGER IF EXISTS trg_order_apply;
DROP TRIGGER IF EXISTS trg_order_refund;
DROP TRIGGER IF EXISTS trg_manual_deposit_credit;
DROP TRIGGER IF EXISTS trg_auto_payment_credit;
DROP TRIGGER IF EXISTS trg_wallet_adjustment_validate;
DROP TRIGGER IF EXISTS trg_wallet_adjustment_apply;

CREATE TRIGGER trg_order_validate
BEFORE INSERT ON orders
BEGIN
  SELECT CASE
    WHEN NEW.quantity < 1 THEN RAISE(ABORT, 'INVALID_QUANTITY')
    WHEN NOT EXISTS (SELECT 1 FROM products WHERE id = NEW.product_id AND active = 1) THEN RAISE(ABORT, 'PRODUCT_UNAVAILABLE')
    WHEN (SELECT stock FROM products WHERE id = NEW.product_id) < NEW.quantity THEN RAISE(ABORT, 'OUT_OF_STOCK')
    WHEN ABS(NEW.amount - ((SELECT price FROM products WHERE id = NEW.product_id) * NEW.quantity)) > 0.009 THEN RAISE(ABORT, 'PRICE_MISMATCH')
    WHEN NOT EXISTS (SELECT 1 FROM users WHERE id = NEW.user_id) THEN RAISE(ABORT, 'USER_NOT_FOUND')
    WHEN (SELECT balance FROM users WHERE id = NEW.user_id) < NEW.amount THEN RAISE(ABORT, 'INSUFFICIENT_BALANCE')
  END;
END;

CREATE TRIGGER trg_order_apply
AFTER INSERT ON orders
BEGIN
  UPDATE users
    SET balance = balance - NEW.amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;

  UPDATE products
    SET stock = stock - NEW.quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.product_id;

  INSERT INTO wallet_ledger(user_id, entry_type, amount, source_type, source_id, description)
  VALUES(NEW.user_id, 'DEBIT', NEW.amount, 'order', CAST(NEW.id AS TEXT), 'Product purchase');
END;

CREATE TRIGGER trg_order_refund
AFTER UPDATE OF status ON orders
WHEN NEW.status = 'Refunded'
 AND OLD.status <> 'Refunded'
 AND NOT EXISTS (
   SELECT 1 FROM wallet_ledger
   WHERE source_type = 'order_refund'
     AND source_id = CAST(NEW.id AS TEXT)
     AND entry_type = 'CREDIT'
 )
BEGIN
  UPDATE users
    SET balance = balance + NEW.amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;

  UPDATE products
    SET stock = stock + NEW.quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.product_id;

  INSERT INTO wallet_ledger(user_id, entry_type, amount, source_type, source_id, description)
  VALUES(NEW.user_id, 'CREDIT', NEW.amount, 'order_refund', CAST(NEW.id AS TEXT), 'Order refund');
END;

CREATE TRIGGER trg_manual_deposit_credit
AFTER UPDATE OF status ON deposits
WHEN NEW.status = 'Approved'
 AND OLD.status <> 'Approved'
 AND NOT EXISTS (
   SELECT 1 FROM wallet_ledger
   WHERE source_type = 'manual_deposit'
     AND source_id = CAST(NEW.id AS TEXT)
     AND entry_type = 'CREDIT'
 )
BEGIN
  UPDATE users
    SET balance = balance + NEW.amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;

  INSERT INTO wallet_ledger(user_id, entry_type, amount, source_type, source_id, description)
  VALUES(NEW.user_id, 'CREDIT', NEW.amount, 'manual_deposit', CAST(NEW.id AS TEXT), 'Manual deposit approved');
END;

CREATE TRIGGER trg_auto_payment_credit
AFTER UPDATE OF status ON payment_sessions
WHEN NEW.status = 'Paid'
 AND OLD.status <> 'Paid'
 AND NOT EXISTS (
   SELECT 1 FROM wallet_ledger
   WHERE source_type = 'auto_payment'
     AND source_id = NEW.id
     AND entry_type = 'CREDIT'
 )
BEGIN
  UPDATE users
    SET balance = balance + NEW.amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;

  INSERT INTO wallet_ledger(user_id, entry_type, amount, source_type, source_id, description)
  VALUES(NEW.user_id, 'CREDIT', NEW.amount, 'auto_payment', NEW.id, 'Verified online payment');
END;

CREATE TRIGGER trg_wallet_adjustment_validate
BEFORE INSERT ON wallet_adjustments
BEGIN
  SELECT CASE
    WHEN NOT EXISTS (SELECT 1 FROM users WHERE id = NEW.user_id) THEN RAISE(ABORT, 'USER_NOT_FOUND')
    WHEN (SELECT balance FROM users WHERE id = NEW.user_id) + NEW.amount_signed < 0 THEN RAISE(ABORT, 'NEGATIVE_BALANCE_NOT_ALLOWED')
  END;
END;

CREATE TRIGGER trg_wallet_adjustment_apply
AFTER INSERT ON wallet_adjustments
BEGIN
  UPDATE users
    SET balance = balance + NEW.amount_signed,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;

  INSERT INTO wallet_ledger(user_id, entry_type, amount, source_type, source_id, description)
  VALUES(
    NEW.user_id,
    CASE WHEN NEW.amount_signed > 0 THEN 'CREDIT' ELSE 'DEBIT' END,
    ABS(NEW.amount_signed),
    'admin_adjustment',
    NEW.id,
    NEW.reason
  );
END;

INSERT OR IGNORE INTO wallet_ledger(user_id, entry_type, amount, source_type, source_id, description)
SELECT user_id, 'DEBIT', amount, 'order', CAST(id AS TEXT), 'Imported order record'
FROM orders;

INSERT OR IGNORE INTO wallet_ledger(user_id, entry_type, amount, source_type, source_id, description)
SELECT user_id, 'CREDIT', amount, 'manual_deposit', CAST(id AS TEXT), 'Imported approved deposit record'
FROM deposits WHERE status = 'Approved';
