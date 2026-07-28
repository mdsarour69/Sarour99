const USER_COOKIE = 'sarour_user';
const ADMIN_COOKIE = 'sarour_admin';
const USER_SESSION_SECONDS = 60 * 60 * 24 * 365;
const ADMIN_SESSION_SECONDS = 60 * 60 * 8;
const DEFAULT_ADMIN_PASSWORD = 'Jihad@2026#Store';
let runtimeSchemaPromise = null;
let adminAuthSchemaPromise = null;
const encoder = new TextEncoder();
const decoder = new TextDecoder();


function normalizedSecret(value, max = 500) {
  let text = String(value ?? '').trim().slice(0, max);
  if (text.length >= 2) {
    const first = text[0];
    const last = text[text.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      text = text.slice(1, -1).trim();
    }
  }
  return text;
}

function configuredAdminPassword(env) {
  return normalizedSecret(env.ADMIN_PASSWORD, 300) || DEFAULT_ADMIN_PASSWORD;
}

function runtimeSecret(env, purpose) {
  const explicit = purpose === 'admin' ? env.ADMIN_SECRET : env.SESSION_SECRET;
  const normalized = normalizedSecret(explicit, 1000);
  if (normalized) return normalized;
  return `sarour-store-v4:${purpose}:${configuredAdminPassword(env)}`;
}

async function tableColumnNames(db, table) {
  const result = await db.prepare(`PRAGMA table_info(${table})`).all();
  return new Set((result.results || []).map((item) => String(item.name)));
}

async function addMissingColumns(db, table, definitions) {
  const columns = await tableColumnNames(db, table);
  for (const [name, definition] of definitions) {
    if (!columns.has(name)) {
      await db.prepare(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`).run();
    }
  }
}

async function initializeRuntimeSchema(db) {
  const createStatements = [
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      icon TEXT NOT NULL DEFAULT '🛍️',
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'Other',
      price REAL NOT NULL DEFAULT 0 CHECK(price >= 0),
      stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
      active INTEGER NOT NULL DEFAULT 1,
      featured INTEGER NOT NULL DEFAULT 0,
      delivery_note TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      balance REAL NOT NULL DEFAULT 0 CHECK(balance >= 0),
      display_name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      last_seen_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      product_icon TEXT NOT NULL DEFAULT '🛍️',
      amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'Completed',
      quantity INTEGER NOT NULL DEFAULT 1,
      customer_note TEXT NOT NULL DEFAULT '',
      customer_telegram TEXT NOT NULL DEFAULT '',
      customer_whatsapp TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )`,
    `CREATE TABLE IF NOT EXISTS deposits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      amount REAL NOT NULL CHECK(amount > 0),
      currency TEXT NOT NULL DEFAULT 'USD',
      method TEXT NOT NULL,
      txid TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'Pending',
      provider TEXT NOT NULL DEFAULT 'Manual',
      provider_reference TEXT NOT NULL DEFAULT '',
      admin_note TEXT NOT NULL DEFAULT '',
      metadata_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      reviewed_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Unread',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS wallet_ledger (
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
    )`,
    `CREATE TABLE IF NOT EXISTS payment_sessions (
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
    )`,
    `CREATE TABLE IF NOT EXISTS wallet_adjustments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount_signed REAL NOT NULL CHECK(amount_signed <> 0),
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS admin_login_attempts (
      ip TEXT PRIMARY KEY,
      attempts INTEGER NOT NULL DEFAULT 0,
      window_started_at INTEGER NOT NULL,
      locked_until INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL DEFAULT '',
      target_id TEXT NOT NULL DEFAULT '',
      details TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS payment_methods (
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
    )`,
    `CREATE TABLE IF NOT EXISTS homepage_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      icon TEXT NOT NULL DEFAULT '✨',
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  await db.batch(createStatements.map((sql) => db.prepare(sql)));

  await addMissingColumns(db, 'products', [
    ['featured', "INTEGER NOT NULL DEFAULT 0"],
    ['delivery_note', "TEXT NOT NULL DEFAULT ''"],
    ['sort_order', "INTEGER NOT NULL DEFAULT 0"]
  ]);
  await addMissingColumns(db, 'users', [
    ['display_name', "TEXT NOT NULL DEFAULT ''"],
    ['email', "TEXT NOT NULL DEFAULT ''"],
    ['phone', "TEXT NOT NULL DEFAULT ''"],
    ['last_seen_at', 'TEXT']
  ]);
  await addMissingColumns(db, 'orders', [
    ['quantity', 'INTEGER NOT NULL DEFAULT 1'],
    ['customer_note', "TEXT NOT NULL DEFAULT ''"],
    ['customer_telegram', "TEXT NOT NULL DEFAULT ''"],
    ['customer_whatsapp', "TEXT NOT NULL DEFAULT ''"],
    ['updated_at', 'TEXT']
  ]);
  await addMissingColumns(db, 'deposits', [
    ['currency', "TEXT NOT NULL DEFAULT 'USD'"],
    ['provider', "TEXT NOT NULL DEFAULT 'Manual'"],
    ['provider_reference', "TEXT NOT NULL DEFAULT ''"],
    ['admin_note', "TEXT NOT NULL DEFAULT ''"],
    ['metadata_json', "TEXT NOT NULL DEFAULT '{}'" ]
  ]);
  await addMissingColumns(db, 'messages', [['updated_at', 'TEXT']]);
  await addMissingColumns(db, 'wallet_ledger', [
    ['description', "TEXT NOT NULL DEFAULT ''"],
    ['created_at', 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP']
  ]);
  await addMissingColumns(db, 'payment_sessions', [
    ['provider', "TEXT NOT NULL DEFAULT 'SSLCOMMERZ'"],
    ['currency', "TEXT NOT NULL DEFAULT 'BDT'"],
    ['status', "TEXT NOT NULL DEFAULT 'Initiated'"],
    ['customer_name', "TEXT NOT NULL DEFAULT ''"],
    ['customer_email', "TEXT NOT NULL DEFAULT ''"],
    ['customer_phone', "TEXT NOT NULL DEFAULT ''"],
    ['gateway_url', "TEXT NOT NULL DEFAULT ''"],
    ['gateway_session_key', "TEXT NOT NULL DEFAULT ''"],
    ['validation_id', "TEXT NOT NULL DEFAULT ''"],
    ['bank_transaction_id', "TEXT NOT NULL DEFAULT ''"],
    ['risk_level', 'INTEGER NOT NULL DEFAULT 0'],
    ['raw_response_json', "TEXT NOT NULL DEFAULT '{}'"],
    ['paid_at', 'TEXT'],
    ['updated_at', 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP']
  ]);
  await addMissingColumns(db, 'wallet_adjustments', [
    ['reason', "TEXT NOT NULL DEFAULT ''"],
    ['created_at', 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP']
  ]);
  await addMissingColumns(db, 'admin_login_attempts', [
    ['attempts', 'INTEGER NOT NULL DEFAULT 0'],
    ['window_started_at', 'INTEGER NOT NULL DEFAULT 0'],
    ['locked_until', 'INTEGER NOT NULL DEFAULT 0']
  ]);
  await addMissingColumns(db, 'audit_logs', [
    ['actor', "TEXT NOT NULL DEFAULT 'admin'"],
    ['action', "TEXT NOT NULL DEFAULT ''"],
    ['target_type', "TEXT NOT NULL DEFAULT ''"],
    ['target_id', "TEXT NOT NULL DEFAULT ''"],
    ['details', "TEXT NOT NULL DEFAULT ''"],
    ['created_at', 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP']
  ]);
  await addMissingColumns(db, 'payment_methods', [
    ['method_key', "TEXT NOT NULL DEFAULT ''"],
    ['label', "TEXT NOT NULL DEFAULT ''"],
    ['account_label', "TEXT NOT NULL DEFAULT 'Account'"],
    ['account_value', "TEXT NOT NULL DEFAULT ''"],
    ['icon', "TEXT NOT NULL DEFAULT '💳'"],
    ['subtitle', "TEXT NOT NULL DEFAULT ''"],
    ['active', 'INTEGER NOT NULL DEFAULT 1'],
    ['sort_order', 'INTEGER NOT NULL DEFAULT 0'],
    ['created_at', 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP'],
    ['updated_at', 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP']
  ]);
  await addMissingColumns(db, 'homepage_cards', [
    ['icon', "TEXT NOT NULL DEFAULT '✨'"],
    ['title', "TEXT NOT NULL DEFAULT ''"],
    ['description', "TEXT NOT NULL DEFAULT ''"],
    ['active', 'INTEGER NOT NULL DEFAULT 1'],
    ['sort_order', 'INTEGER NOT NULL DEFAULT 0'],
    ['created_at', 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP'],
    ['updated_at', 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP']
  ]);

  const setupStatements = [
    `CREATE INDEX IF NOT EXISTS idx_products_active_sort ON products(active, sort_order, id)`,
    `CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_deposits_user_created ON deposits(user_id, created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_messages_status_created ON messages(status, created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_payment_methods_active_sort ON payment_methods(active, sort_order, id)`,
    `CREATE INDEX IF NOT EXISTS idx_homepage_cards_active_sort ON homepage_cards(active, sort_order, id)`,
    `INSERT OR IGNORE INTO settings(key,value) VALUES
      ('store_name','SAROUR STORE'),
      ('store_tagline','Premium digital products with secure delivery'),
      ('store_currency','USD'),
      ('whatsapp','8801783866415'),
      ('telegram',''),
      ('telegram_id',''),
      ('payment_number','01783866415'),
      ('binance_uid','993556753'),
      ('telegram_wallet_id',''),
      ('support_email',''),
      ('whatsapp_group_link',''),
      ('support_admin_link',''),
      ('support_group_link',''),
      ('support_notice','অর্ডার করার পর কিছু সময় অপেক্ষা করুন। প্রোডাক্ট না পেলে Order ID সহ Support Admin অথবা Support Group-এ যোগাযোগ করুন।'),
      ('manual_payment_enabled','1'),
      ('auto_payment_enabled','0'),
      ('payment_instructions','Send payment, then submit the exact transaction ID.'),
      ('post_purchase_message','দয়া করে প্রোডাক্ট পেতে Telegram অথবা WhatsApp-এ মেসেজ দিন।'),
      ('announcement','Secure checkout and verified payment processing.'),
      ('maintenance_mode','0'),
      ('theme_primary','#4f8cff'),
      ('theme_secondary','#7c5cff'),
      ('theme_surface','#151b23'),
      ('rainbow_enabled','0'),
      ('blood_style_enabled','0'),
      ('hero_title_line1','Digital products.'),
      ('hero_title_line2','Delivered with confidence.'),
      ('hero_description','Browse trusted subscriptions, pay securely, and track every purchase from one polished dashboard.'),
      ('footer_text','Secure digital commerce on Cloudflare')`,
    `UPDATE settings SET value='' WHERE key='telegram' AND value='8801783866415'`,
    `INSERT OR IGNORE INTO payment_methods(method_key,label,account_label,account_value,icon,subtitle,active,sort_order)
      VALUES
      ('bkash','bKash','bKash number',COALESCE((SELECT value FROM settings WHERE key='payment_number'),'01783866415'),'৳','Personal',1,10),
      ('nagad','Nagad','Nagad number',COALESCE((SELECT value FROM settings WHERE key='payment_number'),'01783866415'),'৳','Personal',1,20),
      ('binance','Binance Pay','Binance Pay UID',COALESCE((SELECT value FROM settings WHERE key='binance_uid'),'993556753'),'₿','UID',1,30),
      ('telegram','Telegram Wallet','Telegram Wallet ID',COALESCE((SELECT value FROM settings WHERE key='telegram_wallet_id'),''),'✈','Wallet ID',1,40)`,
    `INSERT INTO homepage_cards(icon,title,description,active,sort_order)
      SELECT '⚡','Fast checkout','Atomic stock and wallet updates prevent duplicate or invalid orders.',1,10
      WHERE NOT EXISTS(SELECT 1 FROM homepage_cards)`,
    `INSERT INTO homepage_cards(icon,title,description,active,sort_order)
      SELECT '◎','Admin visibility','Every user order, payment and message is stored in Cloudflare D1.',1,20
      WHERE (SELECT COUNT(*) FROM homepage_cards)=1`,
    `INSERT INTO homepage_cards(icon,title,description,active,sort_order)
      SELECT '🛡','Secure sessions','Signed HttpOnly cookies protect user and admin sessions.',1,30
      WHERE (SELECT COUNT(*) FROM homepage_cards)=2`,
    `INSERT INTO products(icon,name,description,category,price,stock,active,featured,delivery_note,sort_order)
      SELECT '✨','Gemini AI Pro','Premium AI subscription','AI',8,15,1,1,'Contact support after purchase',10
      WHERE NOT EXISTS(SELECT 1 FROM settings WHERE key='catalog_seeded_v2') AND NOT EXISTS(SELECT 1 FROM products)`,
    `INSERT INTO products(icon,name,description,category,price,stock,active,featured,delivery_note,sort_order)
      SELECT '◉','ChatGPT Plus','One-month premium subscription','AI',20,10,1,1,'Contact support after purchase',20
      WHERE NOT EXISTS(SELECT 1 FROM settings WHERE key='catalog_seeded_v2') AND (SELECT COUNT(*) FROM products)=1`,
    `INSERT INTO products(icon,name,description,category,price,stock,active,featured,delivery_note,sort_order)
      SELECT '🔵','NordVPN','Secure VPN subscription','Security',4,15,1,0,'Contact support after purchase',30
      WHERE NOT EXISTS(SELECT 1 FROM settings WHERE key='catalog_seeded_v2') AND (SELECT COUNT(*) FROM products)=2`,
    `INSERT INTO products(icon,name,description,category,price,stock,active,featured,delivery_note,sort_order)
      SELECT '▶️','YouTube Premium','Premium entertainment plan','Entertainment',2,15,1,0,'Contact support after purchase',40
      WHERE NOT EXISTS(SELECT 1 FROM settings WHERE key='catalog_seeded_v2') AND (SELECT COUNT(*) FROM products)=3`,
    `INSERT OR IGNORE INTO settings(key,value) VALUES ('catalog_seeded_v2','1')`,
    `CREATE TRIGGER IF NOT EXISTS trg_wallet_adjustment_validate
      BEFORE INSERT ON wallet_adjustments
      BEGIN
        SELECT CASE
          WHEN NOT EXISTS (SELECT 1 FROM users WHERE id = NEW.user_id) THEN RAISE(ABORT, 'USER_NOT_FOUND')
          WHEN (SELECT balance FROM users WHERE id = NEW.user_id) + NEW.amount_signed < 0 THEN RAISE(ABORT, 'NEGATIVE_BALANCE_NOT_ALLOWED')
        END;
      END`,
    `CREATE TRIGGER IF NOT EXISTS trg_wallet_adjustment_apply
      AFTER INSERT ON wallet_adjustments
      BEGIN
        UPDATE users SET balance = balance + NEW.amount_signed, updated_at = CURRENT_TIMESTAMP WHERE id = NEW.user_id;
        INSERT INTO wallet_ledger(user_id, entry_type, amount, source_type, source_id, description)
        VALUES(NEW.user_id, CASE WHEN NEW.amount_signed > 0 THEN 'CREDIT' ELSE 'DEBIT' END, ABS(NEW.amount_signed), 'admin_adjustment', NEW.id, NEW.reason);
      END`
  ];
  await db.batch(setupStatements.map((sql) => db.prepare(sql)));
}

async function ensureAdminAuthSchema(db) {
  if (!adminAuthSchemaPromise) {
    adminAuthSchemaPromise = db.batch([
      db.prepare(`CREATE TABLE IF NOT EXISTS admin_login_attempts (
        ip TEXT PRIMARY KEY,
        attempts INTEGER NOT NULL DEFAULT 0,
        window_started_at INTEGER NOT NULL DEFAULT 0,
        locked_until INTEGER NOT NULL DEFAULT 0
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        actor TEXT NOT NULL DEFAULT 'admin',
        action TEXT NOT NULL DEFAULT '',
        target_type TEXT NOT NULL DEFAULT '',
        target_id TEXT NOT NULL DEFAULT '',
        details TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`)
    ]).catch((error) => {
      adminAuthSchemaPromise = null;
      throw error;
    });
  }
  return adminAuthSchemaPromise;
}

async function ensureRuntimeSchema(db) {
  if (!runtimeSchemaPromise) {
    runtimeSchemaPromise = initializeRuntimeSchema(db).catch((error) => {
      runtimeSchemaPromise = null;
      throw error;
    });
  }
  return runtimeSchemaPromise;
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers
    }
  });
}

function fail(message, status = 400, code = 'BAD_REQUEST', details = undefined) {
  return json({ ok: false, code, message, ...(details ? { details } : {}) }, status);
}

function redirect(location, status = 303) {
  return new Response(null, { status, headers: { location, 'cache-control': 'no-store' } });
}

function clean(value, max = 500) {
  return String(value ?? '').trim().slice(0, max);
}

function money(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 100) / 100 : NaN;
}

function integer(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) return NaN;
  return number;
}

function parseCookies(request) {
  const result = {};
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) result[key] = decodeURIComponent(value);
  }
  return result;
}

function encodeBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(text) {
  const padded = text.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (text.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function importHmacKey(secret, usage) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    [usage]
  );
}

async function signText(secret, text) {
  const key = await importHmacKey(secret, 'sign');
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(text));
  return encodeBase64Url(new Uint8Array(signature));
}

async function verifySignature(secret, text, signature) {
  try {
    const key = await importHmacKey(secret, 'verify');
    return await crypto.subtle.verify('HMAC', key, decodeBase64Url(signature), encoder.encode(text));
  } catch {
    return false;
  }
}

async function createSignedToken(secret, payload, ttlSeconds) {
  const body = { ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const encoded = encodeBase64Url(encoder.encode(JSON.stringify(body)));
  const signature = await signText(secret, encoded);
  return `${encoded}.${signature}`;
}

async function verifySignedToken(secret, token, expectedRole) {
  if (!secret || !token) return null;
  const [encoded, signature, extra] = token.split('.');
  if (!encoded || !signature || extra) return null;
  if (!(await verifySignature(secret, encoded, signature))) return null;
  try {
    const payload = JSON.parse(decoder.decode(decodeBase64Url(encoded)));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (expectedRole && payload.role !== expectedRole) return null;
    return payload;
  } catch {
    return null;
  }
}

async function constantTimeTextEqual(left, right) {
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(String(left))),
    crypto.subtle.digest('SHA-256', encoder.encode(String(right)))
  ]);
  const av = new Uint8Array(a);
  const bv = new Uint8Array(b);
  let diff = 0;
  for (let index = 0; index < av.length; index += 1) diff |= av[index] ^ bv[index];
  return diff === 0;
}

function cookie(name, value, maxAge, request, clear = false) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=${clear ? 0 : maxAge}`;
}

function securityHeaders(request) {
  const headers = {
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(self)',
    'cross-origin-opener-policy': 'same-origin',
    'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self' https://sandbox.sslcommerz.com https://securepay.sslcommerz.com"
  };
  if (new URL(request.url).protocol === 'https:') {
    headers['strict-transport-security'] = 'max-age=31536000; includeSubDomains';
  }
  return headers;
}

function finalize(response, request, cookies = []) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(securityHeaders(request))) headers.set(key, value);
  for (const value of cookies) headers.append('set-cookie', value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function requestData(request) {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return await request.json();
    } catch {
      return {};
    }
  }
  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    try {
      return Object.fromEntries((await request.formData()).entries());
    } catch {
      return {};
    }
  }
  return {};
}

function assertSameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}

async function ensureUser(db, userId) {
  await db.prepare(`
    INSERT INTO users(id, last_seen_at)
    VALUES(?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET last_seen_at = CURRENT_TIMESTAMP
  `).bind(userId).run();
}

async function getUserSession(request, env) {
  const sessionSecret = runtimeSecret(env, 'session');
  const current = parseCookies(request)[USER_COOKIE];
  const payload = await verifySignedToken(sessionSecret, current, 'user');
  if (payload?.sub) {
    await ensureUser(env.DB, payload.sub);
    return { userId: payload.sub, setCookie: null };
  }

  const userId = crypto.randomUUID();
  await ensureUser(env.DB, userId);
  const token = await createSignedToken(sessionSecret, { role: 'user', sub: userId }, USER_SESSION_SECONDS);
  return { userId, setCookie: cookie(USER_COOKIE, token, USER_SESSION_SECONDS, request) };
}

async function isAdmin(request, env) {
  const candidates = [];
  const cookieToken = parseCookies(request)[ADMIN_COOKIE];
  if (cookieToken) candidates.push(cookieToken);

  const authorization = request.headers.get('authorization') || '';
  const bearerMatch = authorization.match(/^Bearer\s+(.+)$/i);
  if (bearerMatch?.[1] && bearerMatch[1] !== cookieToken) candidates.push(bearerMatch[1].trim());

  for (const token of candidates) {
    const payload = await verifySignedToken(runtimeSecret(env, 'admin'), token, 'admin');
    if (payload?.sub === 'admin') return true;
  }
  return false;
}

async function settingsMap(db) {
  const result = await db.prepare('SELECT key, value FROM settings').all();
  return Object.fromEntries(result.results.map(item => [item.key, item.value]));
}

function publicSettings(settings) {
  const allowed = [
    'store_name', 'store_tagline', 'store_currency', 'whatsapp', 'telegram', 'telegram_id',
    'payment_number', 'binance_uid', 'telegram_wallet_id', 'support_email',
    'whatsapp_group_link', 'support_admin_link', 'support_group_link', 'support_notice', 'manual_payment_enabled',
    'auto_payment_enabled', 'payment_instructions', 'post_purchase_message', 'announcement', 'maintenance_mode',
    'theme_primary', 'theme_secondary', 'theme_surface', 'rainbow_enabled', 'blood_style_enabled',
    'hero_title_line1', 'hero_title_line2', 'hero_description', 'footer_text'
  ];
  return Object.fromEntries(allowed.map(key => [key, settings[key] ?? '']));
}

async function audit(db, action, targetType = '', targetId = '', details = '') {
  await db.prepare(`
    INSERT INTO audit_logs(actor, action, target_type, target_id, details)
    VALUES('admin', ?, ?, ?, ?)
  `).bind(clean(action, 100), clean(targetType, 60), clean(targetId, 120), clean(details, 1000)).run();
}

function gatewayBase(env) {
  return String(env.PAYMENT_MODE || 'sandbox').toLowerCase() === 'live'
    ? 'https://securepay.sslcommerz.com'
    : 'https://sandbox.sslcommerz.com';
}

function gatewayConfigured(env) {
  return Boolean(env.SSLCOMMERZ_STORE_ID && env.SSLCOMMERZ_STORE_PASSWORD);
}

async function publicState(env, userId) {
  const [products, paymentMethods, homepageCards, user, deposits, payments, orders, ledger, rawSettings] = await Promise.all([
    env.DB.prepare(`
      SELECT id, icon, name, description, category, price, stock, featured, delivery_note
      FROM products
      WHERE active = 1
      ORDER BY featured DESC, sort_order ASC, id DESC
    `).all(),
    env.DB.prepare(`
      SELECT id, method_key, label, account_label, account_value, icon, subtitle, sort_order
      FROM payment_methods
      WHERE active = 1
      ORDER BY sort_order ASC, id ASC
    `).all(),
    env.DB.prepare(`
      SELECT id, icon, title, description, sort_order
      FROM homepage_cards
      WHERE active = 1
      ORDER BY sort_order ASC, id ASC
    `).all(),
    env.DB.prepare('SELECT id, balance, display_name, email, phone, created_at FROM users WHERE id = ?').bind(userId).first(),
    env.DB.prepare(`
      SELECT id, amount, currency, method, txid, status, created_at, reviewed_at
      FROM deposits WHERE user_id = ? ORDER BY id DESC LIMIT 50
    `).bind(userId).all(),
    env.DB.prepare(`
      SELECT id, amount, currency, provider, status, created_at, paid_at
      FROM payment_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50
    `).bind(userId).all(),
    env.DB.prepare(`
      SELECT id, product_name, product_icon, amount, quantity, status, customer_note, customer_telegram, customer_whatsapp, created_at, updated_at
      FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 50
    `).bind(userId).all(),
    env.DB.prepare(`
      SELECT id, entry_type, amount, source_type, description, created_at
      FROM wallet_ledger WHERE user_id = ? ORDER BY id DESC LIMIT 80
    `).bind(userId).all(),
    settingsMap(env.DB)
  ]);

  const settings = publicSettings(rawSettings);
  const autoEnabled = settings.auto_payment_enabled === '1' && gatewayConfigured(env);
  return {
    ok: true,
    user: user || { id: userId, balance: 0 },
    products: products.results,
    payment_methods: paymentMethods.results,
    homepage_cards: homepageCards.results,
    deposits: deposits.results,
    payments: payments.results,
    orders: orders.results,
    ledger: ledger.results,
    settings,
    payment: {
      auto_enabled: autoEnabled,
      provider: 'SSLCOMMERZ',
      mode: String(env.PAYMENT_MODE || 'sandbox').toLowerCase(),
      configured: gatewayConfigured(env)
    }
  };
}

async function adminState(env) {
  const [products, paymentMethods, homepageCards, users, deposits, payments, orders, messages, rawSettings, stats, auditLogs] = await Promise.all([
    env.DB.prepare('SELECT * FROM products ORDER BY featured DESC, sort_order ASC, id DESC LIMIT 500').all(),
    env.DB.prepare('SELECT * FROM payment_methods ORDER BY sort_order ASC, id ASC LIMIT 200').all(),
    env.DB.prepare('SELECT * FROM homepage_cards ORDER BY sort_order ASC, id ASC LIMIT 200').all(),
    env.DB.prepare(`
      SELECT id, balance, display_name, email, phone, created_at, last_seen_at
      FROM users ORDER BY COALESCE(last_seen_at, created_at) DESC LIMIT 500
    `).all(),
    env.DB.prepare('SELECT * FROM deposits ORDER BY id DESC LIMIT 500').all(),
    env.DB.prepare('SELECT * FROM payment_sessions ORDER BY created_at DESC LIMIT 500').all(),
    env.DB.prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 500').all(),
    env.DB.prepare('SELECT * FROM messages ORDER BY id DESC LIMIT 500').all(),
    settingsMap(env.DB),
    env.DB.prepare(`
      SELECT
        (SELECT COUNT(*) FROM products WHERE active = 1) AS products,
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM orders) AS orders,
        (SELECT COUNT(*) FROM deposits WHERE status = 'Pending') AS pending_deposits,
        (SELECT COUNT(*) FROM payment_sessions WHERE status IN ('Initiated','Pending','RiskReview')) AS pending_payments,
        (SELECT COUNT(*) FROM messages WHERE status = 'Unread') AS unread_messages,
        (SELECT COALESCE(SUM(amount), 0) FROM orders WHERE status NOT IN ('Cancelled','Refunded')) AS order_revenue,
        (SELECT COALESCE(SUM(amount), 0) FROM deposits WHERE status = 'Approved') +
          (SELECT COALESCE(SUM(amount), 0) FROM payment_sessions WHERE status = 'Paid') AS total_funded,
        (SELECT COALESCE(SUM(balance), 0) FROM users) AS wallet_liability
    `).first(),
    env.DB.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 80').all()
  ]);

  return {
    ok: true,
    products: products.results,
    payment_methods: paymentMethods.results,
    homepage_cards: homepageCards.results,
    users: users.results,
    deposits: deposits.results,
    payments: payments.results,
    orders: orders.results,
    messages: messages.results,
    settings: rawSettings,
    stats,
    audit_logs: auditLogs.results,
    gateway: {
      provider: 'SSLCOMMERZ',
      configured: gatewayConfigured(env),
      mode: String(env.PAYMENT_MODE || 'sandbox').toLowerCase()
    }
  };
}

async function loginStatus(db, ip) {
  const now = Math.floor(Date.now() / 1000);
  const record = await db.prepare('SELECT * FROM admin_login_attempts WHERE ip = ?').bind(ip).first();
  if (!record) return { allowed: true, now, attempts: 0 };
  if (record.locked_until > now) return { allowed: false, retryAfter: record.locked_until - now, now, attempts: record.attempts };
  if (now - record.window_started_at > 900) {
    await db.prepare('DELETE FROM admin_login_attempts WHERE ip = ?').bind(ip).run();
    return { allowed: true, now, attempts: 0 };
  }
  return { allowed: true, now, attempts: record.attempts };
}

async function recordLoginFailure(db, ip, status) {
  const attempts = status.attempts + 1;
  const lock = attempts >= 5 ? status.now + 900 : 0;
  await db.prepare(`
    INSERT INTO admin_login_attempts(ip, attempts, window_started_at, locked_until)
    VALUES(?, ?, ?, ?)
    ON CONFLICT(ip) DO UPDATE SET
      attempts = excluded.attempts,
      window_started_at = excluded.window_started_at,
      locked_until = excluded.locked_until
  `).bind(ip, attempts, status.now, lock).run();
}

async function loginAdmin(request, env) {
  if (!assertSameOrigin(request)) return fail('Cross-site request blocked.', 403, 'ORIGIN_BLOCKED');
  const ip = clean(request.headers.get('cf-connecting-ip') || 'local', 80);
  const fallbackStatus = { allowed: true, now: Math.floor(Date.now() / 1000), attempts: 0 };
  let status = fallbackStatus;

  try {
    status = await loginStatus(env.DB, ip);
  } catch (error) {
    console.warn('ADMIN_RATE_LIMIT_READ_FAILED', error);
  }

  if (!status.allowed) {
    return fail(`Too many attempts. Try again in ${status.retryAfter} seconds.`, 429, 'LOGIN_LOCKED');
  }

  const data = await requestData(request);
  const submittedPassword = normalizedSecret(data.password, 300);
  const valid = await constantTimeTextEqual(submittedPassword, configuredAdminPassword(env));
  if (!valid) {
    try {
      await recordLoginFailure(env.DB, ip, status);
    } catch (error) {
      console.warn('ADMIN_RATE_LIMIT_WRITE_FAILED', error);
    }
    return fail('Incorrect admin password.', 401, 'INVALID_LOGIN');
  }

  try {
    await env.DB.prepare('DELETE FROM admin_login_attempts WHERE ip = ?').bind(ip).run();
  } catch (error) {
    console.warn('ADMIN_RATE_LIMIT_CLEAR_FAILED', error);
  }

  const token = await createSignedToken(runtimeSecret(env, 'admin'), { role: 'admin', sub: 'admin' }, ADMIN_SESSION_SECONDS);
  try {
    await audit(env.DB, 'ADMIN_LOGIN', 'session', ip, 'Successful admin login');
  } catch (error) {
    console.warn('ADMIN_LOGIN_AUDIT_FAILED', error);
  }

  return json(
    { ok: true, admin_token: token, expires_in: ADMIN_SESSION_SECONDS },
    200,
    { 'set-cookie': cookie(ADMIN_COOKIE, token, ADMIN_SESSION_SECONDS, request) }
  );
}

async function logoutAdmin(request) {
  return json({ ok: true }, 200, { 'set-cookie': cookie(ADMIN_COOKIE, '', 0, request, true) });
}

function translateDatabaseError(error) {
  const text = String(error?.message || error);
  if (text.includes('INSUFFICIENT_BALANCE')) return ['Insufficient wallet balance.', 'INSUFFICIENT_BALANCE', 409];
  if (text.includes('OUT_OF_STOCK')) return ['Product is out of stock.', 'OUT_OF_STOCK', 409];
  if (text.includes('PRODUCT_UNAVAILABLE')) return ['Product is unavailable.', 'PRODUCT_UNAVAILABLE', 404];
  if (text.includes('PRICE_MISMATCH')) return ['Product price changed. Reload and try again.', 'PRICE_CHANGED', 409];
  if (text.includes('NEGATIVE_BALANCE_NOT_ALLOWED')) return ['Adjustment would make the balance negative.', 'NEGATIVE_BALANCE', 409];
  if (text.toLowerCase().includes('unique')) return ['This reference already exists.', 'DUPLICATE_REFERENCE', 409];
  return null;
}

async function initiateSslCommerz(request, env, userId) {
  if (!assertSameOrigin(request)) return fail('Cross-site request blocked.', 403, 'ORIGIN_BLOCKED');
  if (!gatewayConfigured(env)) return fail('Automatic payment is not configured yet.', 503, 'GATEWAY_NOT_CONFIGURED');

  const settings = await settingsMap(env.DB);
  if (settings.auto_payment_enabled !== '1') return fail('Automatic payment is disabled.', 403, 'GATEWAY_DISABLED');
  if (settings.maintenance_mode === '1') return fail('Store is temporarily under maintenance.', 503, 'MAINTENANCE');

  const data = await requestData(request);
  const amount = money(data.amount);
  const currency = clean(settings.store_currency || 'BDT', 3).toUpperCase();
  const name = clean(data.name, 50);
  const email = clean(data.email, 80).toLowerCase();
  const phone = clean(data.phone, 20);

  if (!Number.isFinite(amount) || amount <= 0 || amount > 500000) return fail('Enter a valid payment amount.', 400, 'INVALID_AMOUNT');
  if (currency === 'BDT' && amount < 10) return fail('Minimum SSLCOMMERZ payment is 10 BDT.', 400, 'AMOUNT_TOO_LOW');
  if (name.length < 2) return fail('Enter your name.', 400, 'INVALID_NAME');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Enter a valid email address.', 400, 'INVALID_EMAIL');
  if (!/^[+\d][\d\s-]{7,19}$/.test(phone)) return fail('Enter a valid phone number.', 400, 'INVALID_PHONE');

  const tranId = `SR${Date.now().toString(36)}${crypto.randomUUID().replace(/-/g, '').slice(0, 9)}`.slice(0, 30).toUpperCase();
  const origin = new URL(request.url).origin;
  const base = gatewayBase(env);

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO payment_sessions(
        id, user_id, amount, currency, status, customer_name, customer_email, customer_phone
      ) VALUES(?, ?, ?, ?, 'Initiated', ?, ?, ?)
    `).bind(tranId, userId, amount, currency, name, email, phone),
    env.DB.prepare(`
      UPDATE users SET display_name = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(name, email, phone, userId)
  ]);

  const payload = new URLSearchParams({
    store_id: env.SSLCOMMERZ_STORE_ID,
    store_passwd: env.SSLCOMMERZ_STORE_PASSWORD,
    total_amount: amount.toFixed(2),
    currency,
    tran_id: tranId,
    success_url: `${origin}/api/payments/sslcommerz/success`,
    fail_url: `${origin}/api/payments/sslcommerz/fail`,
    cancel_url: `${origin}/api/payments/sslcommerz/cancel`,
    ipn_url: `${origin}/api/payments/sslcommerz/ipn`,
    cus_name: name,
    cus_email: email,
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_postcode: '1200',
    cus_country: 'Bangladesh',
    cus_phone: phone,
    shipping_method: 'NO',
    product_name: 'Wallet Top-up',
    product_category: 'Digital Service',
    product_profile: 'non-physical-goods',
    value_a: userId,
    value_b: tranId
  });

  let gatewayResponse;
  try {
    const response = await fetch(`${base}/gwprocess/v3/api.php`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: payload.toString()
    });
    gatewayResponse = await response.json();
  } catch (error) {
    await env.DB.prepare(`
      UPDATE payment_sessions SET status = 'GatewayFailed', raw_response_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(JSON.stringify({ error: String(error) }).slice(0, 5000), tranId).run();
    return fail('Could not connect to the payment gateway.', 502, 'GATEWAY_CONNECTION_FAILED');
  }

  const gatewayUrl = clean(gatewayResponse.GatewayPageURL, 1000);
  if (gatewayResponse.status !== 'SUCCESS' || !gatewayUrl.startsWith('https://')) {
    await env.DB.prepare(`
      UPDATE payment_sessions SET status = 'GatewayFailed', raw_response_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(JSON.stringify(gatewayResponse).slice(0, 5000), tranId).run();
    return fail(clean(gatewayResponse.failedreason, 300) || 'Payment gateway rejected the request.', 502, 'GATEWAY_REJECTED');
  }

  await env.DB.prepare(`
    UPDATE payment_sessions
    SET status = 'Pending', gateway_url = ?, gateway_session_key = ?, raw_response_json = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(gatewayUrl, clean(gatewayResponse.sessionkey, 100), JSON.stringify(gatewayResponse).slice(0, 5000), tranId).run();

  return json({ ok: true, transaction_id: tranId, gateway_url: gatewayUrl });
}

async function sslValidation(env, validationId) {
  const url = new URL(`${gatewayBase(env)}/validator/api/validationserverAPI.php`);
  url.searchParams.set('val_id', validationId);
  url.searchParams.set('store_id', env.SSLCOMMERZ_STORE_ID);
  url.searchParams.set('store_passwd', env.SSLCOMMERZ_STORE_PASSWORD);
  url.searchParams.set('v', '1');
  url.searchParams.set('format', 'json');
  const response = await fetch(url.toString(), { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`Validation HTTP ${response.status}`);
  return response.json();
}

function paymentReturnUrl(request, result) {
  const origin = new URL(request.url).origin;
  return `${origin}/?payment=${encodeURIComponent(result)}`;
}

async function handleSslCommerzCallback(request, env, kind) {
  if (!gatewayConfigured(env)) return fail('Gateway is not configured.', 503, 'GATEWAY_NOT_CONFIGURED');
  const url = new URL(request.url);
  const data = request.method === 'GET'
    ? Object.fromEntries(url.searchParams.entries())
    : await requestData(request);

  const tranId = clean(data.tran_id, 50);
  const postedStatus = clean(data.status, 30).toUpperCase();
  const payment = tranId
    ? await env.DB.prepare('SELECT * FROM payment_sessions WHERE id = ?').bind(tranId).first()
    : null;

  if (!payment) {
    if (kind === 'ipn') return fail('Transaction not found.', 404, 'TRANSACTION_NOT_FOUND');
    return redirect(paymentReturnUrl(request, 'not-found'));
  }

  if (kind === 'fail' || postedStatus === 'FAILED') {
    await env.DB.prepare(`
      UPDATE payment_sessions SET status = 'Failed', raw_response_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status <> 'Paid'
    `).bind(JSON.stringify(data).slice(0, 5000), tranId).run();
    return kind === 'ipn' ? json({ ok: true }) : redirect(paymentReturnUrl(request, 'failed'));
  }

  if (kind === 'cancel' || postedStatus === 'CANCELLED') {
    await env.DB.prepare(`
      UPDATE payment_sessions SET status = 'Cancelled', raw_response_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status <> 'Paid'
    `).bind(JSON.stringify(data).slice(0, 5000), tranId).run();
    return kind === 'ipn' ? json({ ok: true }) : redirect(paymentReturnUrl(request, 'cancelled'));
  }

  const validationId = clean(data.val_id, 80);
  if (!validationId) {
    if (kind === 'ipn') return fail('Validation ID missing.', 400, 'VALIDATION_ID_MISSING');
    return redirect(paymentReturnUrl(request, 'verification-failed'));
  }

  let validation;
  try {
    validation = await sslValidation(env, validationId);
  } catch (error) {
    await env.DB.prepare(`
      UPDATE payment_sessions SET status = 'VerificationPending', raw_response_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status <> 'Paid'
    `).bind(JSON.stringify({ callback: data, error: String(error) }).slice(0, 5000), tranId).run();
    if (kind === 'ipn') return fail('Validation service unavailable.', 502, 'VALIDATION_UNAVAILABLE');
    return redirect(paymentReturnUrl(request, 'verification-pending'));
  }

  const validStatus = ['VALID', 'VALIDATED'].includes(clean(validation.status, 30).toUpperCase());
  const validTranId = clean(validation.tran_id, 50) === payment.id;
  const storedCurrency = clean(payment.currency, 3).toUpperCase();
  const receivedCurrency = clean(storedCurrency === 'BDT' ? validation.currency : validation.currency_type, 3).toUpperCase();
  const receivedAmount = money(storedCurrency === 'BDT' ? validation.amount : validation.currency_amount);
  const validCurrency = receivedCurrency === storedCurrency;
  const validAmount = Number.isFinite(receivedAmount) && Math.abs(receivedAmount - Number(payment.amount)) < 0.01;
  const riskLevel = Number(validation.risk_level || 0);
  const raw = JSON.stringify(validation).slice(0, 5000);

  if (!validStatus || !validTranId || !validCurrency || !validAmount) {
    await env.DB.prepare(`
      UPDATE payment_sessions SET status = 'VerificationFailed', validation_id = ?, raw_response_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status <> 'Paid'
    `).bind(validationId, raw, tranId).run();
    if (kind === 'ipn') return fail('Payment verification failed.', 400, 'PAYMENT_MISMATCH');
    return redirect(paymentReturnUrl(request, 'verification-failed'));
  }

  if (riskLevel === 1) {
    await env.DB.prepare(`
      UPDATE payment_sessions
      SET status = 'RiskReview', validation_id = ?, bank_transaction_id = ?, risk_level = 1,
          raw_response_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status <> 'Paid'
    `).bind(validationId, clean(validation.bank_tran_id, 100), raw, tranId).run();
    if (kind === 'ipn') return json({ ok: true, review: true });
    return redirect(paymentReturnUrl(request, 'review'));
  }

  await env.DB.prepare(`
    UPDATE payment_sessions
    SET status = 'Paid', validation_id = ?, bank_transaction_id = ?, risk_level = 0,
        raw_response_json = ?, paid_at = COALESCE(paid_at, CURRENT_TIMESTAMP), updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND status <> 'Paid'
  `).bind(validationId, clean(validation.bank_tran_id, 100), raw, tranId).run();

  if (kind === 'ipn') return json({ ok: true, paid: true });
  return redirect(paymentReturnUrl(request, 'success'));
}

function csvEscape(value) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

async function exportAdminCsv(env, type) {
  const definitions = {
    orders: {
      query: 'SELECT id,user_id,product_name,amount,quantity,customer_telegram,customer_whatsapp,status,created_at FROM orders ORDER BY id DESC',
      columns: ['id', 'user_id', 'product_name', 'amount', 'quantity', 'customer_telegram', 'customer_whatsapp', 'status', 'created_at']
    },
    deposits: {
      query: 'SELECT id,user_id,amount,currency,method,txid,status,created_at,reviewed_at FROM deposits ORDER BY id DESC',
      columns: ['id', 'user_id', 'amount', 'currency', 'method', 'txid', 'status', 'created_at', 'reviewed_at']
    },
    payments: {
      query: 'SELECT id,user_id,provider,amount,currency,status,bank_transaction_id,created_at,paid_at FROM payment_sessions ORDER BY created_at DESC',
      columns: ['id', 'user_id', 'provider', 'amount', 'currency', 'status', 'bank_transaction_id', 'created_at', 'paid_at']
    },
    users: {
      query: 'SELECT id,balance,display_name,email,phone,created_at,last_seen_at FROM users ORDER BY created_at DESC',
      columns: ['id', 'balance', 'display_name', 'email', 'phone', 'created_at', 'last_seen_at']
    }
  };
  const definition = definitions[type];
  if (!definition) return fail('Unknown export type.', 400, 'INVALID_EXPORT');
  const result = await env.DB.prepare(definition.query).all();
  const lines = [definition.columns.map(csvEscape).join(',')];
  for (const row of result.results) lines.push(definition.columns.map(column => csvEscape(row[column])).join(','));
  return new Response(`\uFEFF${lines.join('\n')}`, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="sarour-${type}.csv"`,
      'cache-control': 'no-store'
    }
  });
}

async function adminApi(request, env, path, url) {
  if (!(await isAdmin(request, env))) return fail('Admin authorization required.', 401, 'ADMIN_REQUIRED');
  if (!['GET', 'HEAD'].includes(request.method) && !assertSameOrigin(request)) {
    return fail('Cross-site request blocked.', 403, 'ORIGIN_BLOCKED');
  }

  if (path === '/api/admin/state' && request.method === 'GET') return json(await adminState(env));
  if (path === '/api/admin/export' && request.method === 'GET') return exportAdminCsv(env, clean(url.searchParams.get('type'), 20));

  if (path === '/api/admin/products' && request.method === 'POST') {
    const data = await requestData(request);
    const name = clean(data.name, 120);
    const description = clean(data.description, 1000);
    const category = clean(data.category, 60);
    const icon = clean(data.icon, 20) || '🛍️';
    const deliveryNote = clean(data.delivery_note, 500);
    const price = money(data.price);
    const stock = integer(data.stock, 0, 1000000);
    const featured = data.featured === true || data.featured === '1' ? 1 : 0;
    const sortOrder = integer(Number(data.sort_order || 0), -100000, 100000);
    if (!name || !description || !category || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || !Number.isInteger(sortOrder)) {
      return fail('Invalid product information.', 400, 'INVALID_PRODUCT');
    }
    const result = await env.DB.prepare(`
      INSERT INTO products(icon,name,description,category,price,stock,active,featured,delivery_note,sort_order)
      VALUES(?,?,?,?,?,?,1,?,?,?)
    `).bind(icon, name, description, category, price, stock, featured, deliveryNote, sortOrder).run();
    await audit(env.DB, 'PRODUCT_CREATED', 'product', String(result.meta.last_row_id), name);
    return json({ ok: true, id: result.meta.last_row_id }, 201);
  }

  const stockMatch = path.match(/^\/api\/admin\/products\/(\d+)\/stock$/);
  if (stockMatch && request.method === 'POST') {
    const id = Number(stockMatch[1]);
    const data = await requestData(request);
    const delta = integer(Number(data.delta), -1000000, 1000000);
    if (!Number.isInteger(delta) || delta === 0) return fail('Invalid stock change.', 400, 'INVALID_STOCK_CHANGE');
    const result = await env.DB.prepare(`
      UPDATE products
      SET stock = MAX(0, stock + ?), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(delta, id).run();
    if (!result.meta.changes) return fail('Product not found.', 404, 'PRODUCT_NOT_FOUND');
    const product = await env.DB.prepare('SELECT stock FROM products WHERE id=?').bind(id).first();
    await audit(env.DB, 'PRODUCT_STOCK_CHANGED', 'product', String(id), `delta=${delta};stock=${product?.stock ?? 0}`);
    return json({ ok: true, stock: Number(product?.stock || 0) });
  }

  const productMatch = path.match(/^\/api\/admin\/products\/(\d+)$/);
  if (productMatch && request.method === 'PUT') {
    const data = await requestData(request);
    const id = Number(productMatch[1]);
    const name = clean(data.name, 120);
    const description = clean(data.description, 1000);
    const category = clean(data.category, 60);
    const icon = clean(data.icon, 20) || '🛍️';
    const deliveryNote = clean(data.delivery_note, 500);
    const price = money(data.price);
    const stock = integer(data.stock, 0, 1000000);
    const featured = data.featured === true || data.featured === '1' ? 1 : 0;
    const active = data.active === false || data.active === '0' ? 0 : 1;
    const sortOrder = integer(Number(data.sort_order || 0), -100000, 100000);
    if (!name || !description || !category || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || !Number.isInteger(sortOrder)) {
      return fail('Invalid product information.', 400, 'INVALID_PRODUCT');
    }
    const result = await env.DB.prepare(`
      UPDATE products SET icon=?,name=?,description=?,category=?,price=?,stock=?,active=?,featured=?,delivery_note=?,sort_order=?,updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `).bind(icon, name, description, category, price, stock, active, featured, deliveryNote, sortOrder, id).run();
    if (!result.meta.changes) return fail('Product not found.', 404, 'PRODUCT_NOT_FOUND');
    await audit(env.DB, 'PRODUCT_UPDATED', 'product', String(id), name);
    return json({ ok: true });
  }

  if (productMatch && request.method === 'DELETE') {
    const id = Number(productMatch[1]);
    const permanent = url.searchParams.get('permanent') === '1';
    if (permanent) {
      const product = await env.DB.prepare('SELECT name FROM products WHERE id=?').bind(id).first();
      if (!product) return fail('Product not found.', 404, 'PRODUCT_NOT_FOUND');
      await env.DB.batch([
        env.DB.prepare('UPDATE orders SET product_id=NULL WHERE product_id=?').bind(id),
        env.DB.prepare('DELETE FROM products WHERE id=?').bind(id)
      ]);
      await audit(env.DB, 'PRODUCT_DELETED', 'product', String(id), product.name || '');
      return json({ ok: true, deleted: true });
    }
    const product = await env.DB.prepare('SELECT active FROM products WHERE id=?').bind(id).first();
    if (!product) return fail('Product not found.', 404, 'PRODUCT_NOT_FOUND');
    const nextActive = product.active ? 0 : 1;
    await env.DB.prepare('UPDATE products SET active=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(nextActive, id).run();
    await audit(env.DB, nextActive ? 'PRODUCT_RESTORED' : 'PRODUCT_HIDDEN', 'product', String(id));
    return json({ ok: true, active: nextActive });
  }

  if (path === '/api/admin/payment-methods' && request.method === 'POST') {
    const data = await requestData(request);
    const methodKey = clean(data.method_key, 40).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const label = clean(data.label, 80);
    const accountLabel = clean(data.account_label, 100) || 'Account';
    const accountValue = clean(data.account_value, 250);
    const icon = clean(data.icon, 20) || '💳';
    const subtitle = clean(data.subtitle, 80);
    const active = data.active === false || data.active === '0' ? 0 : 1;
    const sortOrder = integer(Number(data.sort_order || 0), -100000, 100000);
    if (!methodKey || !label || !Number.isInteger(sortOrder)) return fail('Invalid payment method.', 400, 'INVALID_PAYMENT_METHOD');
    try {
      const result = await env.DB.prepare(`
        INSERT INTO payment_methods(method_key,label,account_label,account_value,icon,subtitle,active,sort_order)
        VALUES(?,?,?,?,?,?,?,?)
      `).bind(methodKey,label,accountLabel,accountValue,icon,subtitle,active,sortOrder).run();
      await audit(env.DB, 'PAYMENT_METHOD_CREATED', 'payment_method', String(result.meta.last_row_id), label);
      return json({ ok: true, id: result.meta.last_row_id }, 201);
    } catch (error) {
      const translated = translateDatabaseError(error);
      if (translated) return fail('Payment method key already exists.', 409, 'DUPLICATE_PAYMENT_METHOD');
      throw error;
    }
  }

  const paymentMethodMatch = path.match(/^\/api\/admin\/payment-methods\/(\d+)$/);
  if (paymentMethodMatch && request.method === 'PUT') {
    const data = await requestData(request);
    const id = Number(paymentMethodMatch[1]);
    const methodKey = clean(data.method_key, 40).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const label = clean(data.label, 80);
    const accountLabel = clean(data.account_label, 100) || 'Account';
    const accountValue = clean(data.account_value, 250);
    const icon = clean(data.icon, 20) || '💳';
    const subtitle = clean(data.subtitle, 80);
    const active = data.active === false || data.active === '0' ? 0 : 1;
    const sortOrder = integer(Number(data.sort_order || 0), -100000, 100000);
    if (!methodKey || !label || !Number.isInteger(sortOrder)) return fail('Invalid payment method.', 400, 'INVALID_PAYMENT_METHOD');
    const result = await env.DB.prepare(`
      UPDATE payment_methods SET method_key=?,label=?,account_label=?,account_value=?,icon=?,subtitle=?,active=?,sort_order=?,updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `).bind(methodKey,label,accountLabel,accountValue,icon,subtitle,active,sortOrder,id).run();
    if (!result.meta.changes) return fail('Payment method not found.', 404, 'PAYMENT_METHOD_NOT_FOUND');
    await audit(env.DB, 'PAYMENT_METHOD_UPDATED', 'payment_method', String(id), label);
    return json({ ok: true });
  }
  if (paymentMethodMatch && request.method === 'DELETE') {
    const id = Number(paymentMethodMatch[1]);
    const result = await env.DB.prepare('DELETE FROM payment_methods WHERE id=?').bind(id).run();
    if (!result.meta.changes) return fail('Payment method not found.', 404, 'PAYMENT_METHOD_NOT_FOUND');
    await audit(env.DB, 'PAYMENT_METHOD_DELETED', 'payment_method', String(id));
    return json({ ok: true });
  }

  if (path === '/api/admin/homepage-cards' && request.method === 'POST') {
    const data = await requestData(request);
    const title = clean(data.title, 120);
    const description = clean(data.description, 700);
    const icon = clean(data.icon, 20) || '✨';
    const active = data.active === false || data.active === '0' ? 0 : 1;
    const sortOrder = integer(Number(data.sort_order || 0), -100000, 100000);
    if (!title || !description || !Number.isInteger(sortOrder)) return fail('Invalid homepage card.', 400, 'INVALID_HOMEPAGE_CARD');
    const result = await env.DB.prepare(`
      INSERT INTO homepage_cards(icon,title,description,active,sort_order) VALUES(?,?,?,?,?)
    `).bind(icon,title,description,active,sortOrder).run();
    await audit(env.DB, 'HOMEPAGE_CARD_CREATED', 'homepage_card', String(result.meta.last_row_id), title);
    return json({ ok: true, id: result.meta.last_row_id }, 201);
  }

  const homepageCardMatch = path.match(/^\/api\/admin\/homepage-cards\/(\d+)$/);
  if (homepageCardMatch && request.method === 'PUT') {
    const data = await requestData(request);
    const id = Number(homepageCardMatch[1]);
    const title = clean(data.title, 120);
    const description = clean(data.description, 700);
    const icon = clean(data.icon, 20) || '✨';
    const active = data.active === false || data.active === '0' ? 0 : 1;
    const sortOrder = integer(Number(data.sort_order || 0), -100000, 100000);
    if (!title || !description || !Number.isInteger(sortOrder)) return fail('Invalid homepage card.', 400, 'INVALID_HOMEPAGE_CARD');
    const result = await env.DB.prepare(`
      UPDATE homepage_cards SET icon=?,title=?,description=?,active=?,sort_order=?,updated_at=CURRENT_TIMESTAMP WHERE id=?
    `).bind(icon,title,description,active,sortOrder,id).run();
    if (!result.meta.changes) return fail('Homepage card not found.', 404, 'HOMEPAGE_CARD_NOT_FOUND');
    await audit(env.DB, 'HOMEPAGE_CARD_UPDATED', 'homepage_card', String(id), title);
    return json({ ok: true });
  }
  if (homepageCardMatch && request.method === 'DELETE') {
    const id = Number(homepageCardMatch[1]);
    const result = await env.DB.prepare('DELETE FROM homepage_cards WHERE id=?').bind(id).run();
    if (!result.meta.changes) return fail('Homepage card not found.', 404, 'HOMEPAGE_CARD_NOT_FOUND');
    await audit(env.DB, 'HOMEPAGE_CARD_DELETED', 'homepage_card', String(id));
    return json({ ok: true });
  }

  const depositMatch = path.match(/^\/api\/admin\/deposits\/(\d+)\/(approve|reject)$/);
  if (depositMatch && request.method === 'POST') {
    const id = Number(depositMatch[1]);
    const action = depositMatch[2];
    const data = await requestData(request);
    const deposit = await env.DB.prepare('SELECT * FROM deposits WHERE id=?').bind(id).first();
    if (!deposit) return fail('Deposit not found.', 404, 'DEPOSIT_NOT_FOUND');
    if (deposit.status !== 'Pending') return fail('Deposit was already reviewed.', 409, 'ALREADY_REVIEWED');
    const status = action === 'approve' ? 'Approved' : 'Rejected';
    await env.DB.prepare(`
      UPDATE deposits SET status=?,admin_note=?,reviewed_at=CURRENT_TIMESTAMP WHERE id=? AND status='Pending'
    `).bind(status, clean(data.note, 500), id).run();
    await audit(env.DB, `DEPOSIT_${status.toUpperCase()}`, 'deposit', String(id), deposit.txid);
    return json({ ok: true });
  }

  const riskPaymentMatch = path.match(/^\/api\/admin\/payments\/([A-Za-z0-9_-]{8,80})\/(approve|reject)$/);
  if (riskPaymentMatch && request.method === 'POST') {
    const paymentId = riskPaymentMatch[1];
    const action = riskPaymentMatch[2];
    const payment = await env.DB.prepare('SELECT * FROM payment_sessions WHERE id=?').bind(paymentId).first();
    if (!payment) return fail('Payment not found.', 404, 'PAYMENT_NOT_FOUND');
    if (payment.status !== 'RiskReview') return fail('Only risk-review payments can be resolved manually.', 409, 'PAYMENT_NOT_IN_REVIEW');
    const nextStatus = action === 'approve' ? 'Paid' : 'Rejected';
    const result = await env.DB.prepare(`
      UPDATE payment_sessions SET status=?, paid_at=CASE WHEN ?='Paid' THEN COALESCE(paid_at,CURRENT_TIMESTAMP) ELSE paid_at END,
        updated_at=CURRENT_TIMESTAMP WHERE id=? AND status='RiskReview'
    `).bind(nextStatus, nextStatus, paymentId).run();
    if (!result.meta.changes) return fail('Payment was already reviewed.', 409, 'ALREADY_REVIEWED');
    await audit(env.DB, `RISK_PAYMENT_${nextStatus.toUpperCase()}`, 'payment', paymentId, payment.bank_transaction_id || '');
    return json({ ok: true });
  }

  const orderMatch = path.match(/^\/api\/admin\/orders\/(\d+)$/);
  if (orderMatch && request.method === 'PUT') {
    const data = await requestData(request);
    const status = clean(data.status, 30);
    const allowed = ['Completed', 'Processing', 'Delivered', 'Cancelled', 'Refunded'];
    if (!allowed.includes(status)) return fail('Invalid order status.', 400, 'INVALID_STATUS');
    const id = Number(orderMatch[1]);
    const result = await env.DB.prepare('UPDATE orders SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(status, id).run();
    if (!result.meta.changes) return fail('Order not found.', 404, 'ORDER_NOT_FOUND');
    await audit(env.DB, 'ORDER_STATUS_UPDATED', 'order', String(id), status);
    return json({ ok: true });
  }

  const messageMatch = path.match(/^\/api\/admin\/messages\/(\d+)$/);
  if (messageMatch && request.method === 'PUT') {
    const data = await requestData(request);
    const status = clean(data.status, 20);
    if (!['Unread', 'Read', 'Resolved'].includes(status)) return fail('Invalid message status.', 400, 'INVALID_STATUS');
    await env.DB.prepare('UPDATE messages SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(status, Number(messageMatch[1])).run();
    return json({ ok: true });
  }
  if (messageMatch && request.method === 'DELETE') {
    await env.DB.prepare('DELETE FROM messages WHERE id=?').bind(Number(messageMatch[1])).run();
    return json({ ok: true });
  }

  const adjustmentMatch = path.match(/^\/api\/admin\/users\/([A-Za-z0-9_-]{8,80})\/adjust$/);
  if (adjustmentMatch && request.method === 'POST') {
    const data = await requestData(request);
    const amount = money(data.amount);
    const reason = clean(data.reason, 300);
    if (!Number.isFinite(amount) || amount === 0 || Math.abs(amount) > 1000000 || reason.length < 3) {
      return fail('Enter a non-zero amount and a reason.', 400, 'INVALID_ADJUSTMENT');
    }
    const adjustmentId = crypto.randomUUID();
    try {
      await env.DB.prepare(`
        INSERT INTO wallet_adjustments(id,user_id,amount_signed,reason) VALUES(?,?,?,?)
      `).bind(adjustmentId, adjustmentMatch[1], amount, reason).run();
    } catch (error) {
      const translated = translateDatabaseError(error);
      if (translated) return fail(translated[0], translated[2], translated[1]);
      throw error;
    }
    await audit(env.DB, 'WALLET_ADJUSTED', 'user', adjustmentMatch[1], `${amount}: ${reason}`);
    return json({ ok: true });
  }

  if (path === '/api/admin/settings' && request.method === 'PUT') {
    const data = await requestData(request);
    const allowed = [
      'store_name', 'store_tagline', 'store_currency', 'whatsapp', 'telegram', 'telegram_id',
      'support_email', 'whatsapp_group_link', 'support_admin_link', 'support_group_link', 'support_notice', 'manual_payment_enabled',
      'auto_payment_enabled', 'payment_instructions', 'post_purchase_message', 'announcement', 'maintenance_mode',
      'theme_primary', 'theme_secondary', 'theme_surface', 'rainbow_enabled', 'blood_style_enabled',
      'hero_title_line1', 'hero_title_line2', 'hero_description', 'footer_text'
    ];
    const statements = allowed.map(key => {
      const longKeys = ['payment_instructions', 'post_purchase_message', 'support_notice', 'hero_description'];
      let value = clean(data[key], longKeys.includes(key) ? 1000 : 250);
      if (['manual_payment_enabled', 'auto_payment_enabled', 'maintenance_mode', 'rainbow_enabled', 'blood_style_enabled'].includes(key)) {
        value = value === '1' || data[key] === true ? '1' : '0';
      }
      if (key === 'store_currency') value = clean(value || 'USD', 3).toUpperCase();
      return env.DB.prepare(`
        INSERT INTO settings(key,value) VALUES(?,?)
        ON CONFLICT(key) DO UPDATE SET value=excluded.value
      `).bind(key, value);
    });
    await env.DB.batch(statements);
    await audit(env.DB, 'SETTINGS_UPDATED', 'settings', 'store');
    return json({ ok: true });
  }

  return fail('Admin endpoint not found.', 404, 'NOT_FOUND');
}

async function userApi(request, env, path, userId) {
  if (!['GET', 'HEAD'].includes(request.method) && !assertSameOrigin(request)) {
    return fail('Cross-site request blocked.', 403, 'ORIGIN_BLOCKED');
  }

  if (path === '/api/state' && request.method === 'GET') return json(await publicState(env, userId));

  if (path === '/api/orders' && request.method === 'POST') {
    const settings = await settingsMap(env.DB);
    if (settings.maintenance_mode === '1') return fail('Store is temporarily under maintenance.', 503, 'MAINTENANCE');
    const data = await requestData(request);
    const productId = integer(data.product_id, 1);
    const quantity = integer(data.quantity ?? 1, 1, 20);
    const note = clean(data.note, 500);
    const customerTelegram = clean(data.telegram, 120).replace(/\s+/g, '');
    const customerWhatsapp = clean(data.whatsapp, 30).replace(/[^+\d]/g, '');
    if (!Number.isInteger(productId) || !Number.isInteger(quantity)) return fail('Invalid product or quantity.', 400, 'INVALID_ORDER');
    if (!customerTelegram && !customerWhatsapp) return fail('Enter your Telegram ID or WhatsApp number for delivery.', 400, 'CONTACT_REQUIRED');
    if (customerWhatsapp && customerWhatsapp.replace(/\D/g, '').length < 7) return fail('Enter a valid WhatsApp number.', 400, 'INVALID_WHATSAPP');
    const product = await env.DB.prepare('SELECT * FROM products WHERE id=? AND active=1').bind(productId).first();
    if (!product) return fail('Product not found.', 404, 'PRODUCT_NOT_FOUND');
    const total = money(Number(product.price) * quantity);
    try {
      const result = await env.DB.prepare(`
        INSERT INTO orders(user_id,product_id,product_name,product_icon,amount,status,quantity,customer_note,customer_telegram,customer_whatsapp,updated_at)
        VALUES(?,?,?,?,?,'Completed',?,?,?,?,CURRENT_TIMESTAMP)
      `).bind(userId, productId, product.name, product.icon, total, quantity, note, customerTelegram, customerWhatsapp).run();
      return json({
        ok: true,
        order_id: result.meta.last_row_id,
        product_name: product.name,
        quantity,
        whatsapp: settings.whatsapp || '',
        telegram: settings.telegram || '',
        telegram_id: settings.telegram_id || '',
        whatsapp_group_link: settings.whatsapp_group_link || '',
        support_admin_link: settings.support_admin_link || '',
        support_group_link: settings.support_group_link || '',
        support_notice: settings.support_notice || 'অর্ডার করার পর কিছু সময় অপেক্ষা করুন। প্রোডাক্ট না পেলে Order ID সহ Support Admin অথবা Support Group-এ যোগাযোগ করুন।',
        post_purchase_message: settings.post_purchase_message || 'দয়া করে প্রোডাক্ট পেতে Telegram অথবা WhatsApp-এ মেসেজ দিন।'
      }, 201);
    } catch (error) {
      const translated = translateDatabaseError(error);
      if (translated) return fail(translated[0], translated[2], translated[1]);
      throw error;
    }
  }

  if (path === '/api/deposits/manual' && request.method === 'POST') {
    const settings = await settingsMap(env.DB);
    if (settings.manual_payment_enabled !== '1') return fail('Manual payment is disabled.', 403, 'MANUAL_PAYMENT_DISABLED');
    const data = await requestData(request);
    const amount = money(data.amount);
    const method = clean(data.method, 100);
    const txid = clean(data.txid, 150).replace(/\s+/g, ' ');
    const currency = clean(settings.store_currency || 'USD', 3).toUpperCase();
    if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000 || !method || txid.length < 5) {
      return fail('Enter valid payment details.', 400, 'INVALID_DEPOSIT');
    }
    try {
      const result = await env.DB.prepare(`
        INSERT INTO deposits(user_id,amount,currency,method,txid,status,provider)
        VALUES(?,?,?,?,?,'Pending','Manual')
      `).bind(userId, amount, currency, method, txid).run();
      return json({ ok: true, id: result.meta.last_row_id }, 201);
    } catch (error) {
      const translated = translateDatabaseError(error);
      if (translated) return fail('This transaction ID was already submitted.', 409, 'DUPLICATE_TRANSACTION');
      throw error;
    }
  }

  if (path === '/api/payments/sslcommerz/initiate' && request.method === 'POST') {
    return initiateSslCommerz(request, env, userId);
  }

  if (path === '/api/messages' && request.method === 'POST') {
    const data = await requestData(request);
    const topic = clean(data.topic, 120);
    const messageBody = clean(data.body, 2000);
    if (topic.length < 2 || messageBody.length < 2) return fail('Write a valid message.', 400, 'INVALID_MESSAGE');
    const result = await env.DB.prepare(`
      INSERT INTO messages(user_id,topic,body,status,updated_at)
      VALUES(?,?,?,'Unread',CURRENT_TIMESTAMP)
    `).bind(userId, topic, messageBody).run();
    return json({ ok: true, id: result.meta.last_row_id }, 201);
  }

  return fail('Endpoint not found.', 404, 'NOT_FOUND');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    try {
      if (path === '/health') {
        if (env.DB) await ensureRuntimeSchema(env.DB);
        let database = Boolean(env.DB);
        let databaseReady = false;
        if (database) {
          try {
            const check = await env.DB.prepare('SELECT COUNT(*) AS count FROM settings').first();
            databaseReady = Number(check?.count || 0) > 0;
          } catch {
            databaseReady = false;
          }
        }
        return finalize(json({
          ok: Boolean(env.ASSETS && database && databaseReady),
          service: 'sarour-store',
          version: '4.3.0',
          bindings: {
            assets: Boolean(env.ASSETS),
            database,
            database_ready: databaseReady,
            session_secret: Boolean(runtimeSecret(env, 'session')),
            admin_secret: Boolean(runtimeSecret(env, 'admin')),
            admin_password: true,
            custom_admin_password: Boolean(env.ADMIN_PASSWORD),
            sslcommerz: gatewayConfigured(env)
          }
        }), request);
      }

      if (path.startsWith('/api/') && !env.DB) {
        return finalize(fail('Cloudflare D1 binding DB is not configured.', 500, 'DB_BINDING_MISSING'), request);
      }

      if (path === '/api/admin/login' && request.method === 'POST') {
        await ensureAdminAuthSchema(env.DB);
        return finalize(await loginAdmin(request, env), request);
      }
      if (path === '/api/admin/logout' && request.method === 'POST') {
        return finalize(await logoutAdmin(request), request);
      }

      if (path.startsWith('/api/') && env.DB) {
        await ensureRuntimeSchema(env.DB);
      }

      const callbackMatch = path.match(/^\/api\/payments\/sslcommerz\/(success|fail|cancel|ipn)$/);
      if (callbackMatch && ['GET', 'POST'].includes(request.method)) {
        return finalize(await handleSslCommerzCallback(request, env, callbackMatch[1]), request);
      }

      if (path.startsWith('/api/admin/')) {
        return finalize(await adminApi(request, env, path, url), request);
      }

      if (path.startsWith('/api/')) {
        const session = await getUserSession(request, env);
        const response = await userApi(request, env, path, session.userId);
        return finalize(response, request, session.setCookie ? [session.setCookie] : []);
      }

      if (!env.ASSETS) return finalize(fail('Static asset binding ASSETS is not configured.', 500, 'ASSETS_BINDING_MISSING'), request);
      const assetResponse = await env.ASSETS.fetch(request);
      return finalize(assetResponse, request);
    } catch (error) {
      console.error('UNHANDLED_ERROR', error);
      return finalize(fail('Server error. Please try again.', 500, 'SERVER_ERROR'), request);
    }
  }
};
