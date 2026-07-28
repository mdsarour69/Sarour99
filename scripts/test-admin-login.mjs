import assert from 'node:assert/strict';
import worker from '../src/worker.js';

class Statement {
  constructor(db, sql) {
    this.db = db;
    this.sql = String(sql);
    this.values = [];
  }
  bind(...values) {
    this.values = values;
    return this;
  }
  async run() {
    this.db.runs.push({ sql: this.sql, values: this.values });
    return { success: true, meta: { last_row_id: 1, changes: 1 } };
  }
  async first() {
    const sql = this.sql.toLowerCase();
    if (sql.includes('from admin_login_attempts')) return null;
    if (sql.includes('count(*) as count from settings')) return { count: 1 };
    if (sql.includes('select') && sql.includes('as products') && sql.includes('wallet_liability')) {
      return {
        products: 0, users: 0, orders: 0, pending_deposits: 0,
        pending_payments: 0, unread_messages: 0, order_revenue: 0,
        total_funded: 0, wallet_liability: 0
      };
    }
    return null;
  }
  async all() {
    const sql = this.sql.toLowerCase();
    if (sql.startsWith('pragma table_info')) return { results: [] };
    if (sql.includes('select key, value from settings')) {
      return { results: [{ key: 'store_name', value: 'SAROUR STORE' }, { key: 'store_currency', value: 'USD' }] };
    }
    return { results: [] };
  }
}

class MockDB {
  constructor() { this.runs = []; }
  prepare(sql) { return new Statement(this, sql); }
  async batch(statements) {
    for (const statement of statements) await statement.run();
    return statements.map(() => ({ success: true }));
  }
}

const DB = new MockDB();
const ASSETS = { fetch: async () => new Response('asset') };
const env = {
  DB,
  ASSETS,
  // Verify that pasted surrounding quotes no longer break the password.
  ADMIN_PASSWORD: '"Jihad@2026#Store"',
  PAYMENT_MODE: 'sandbox'
};

function request(path, options = {}) {
  return new Request(`https://store.example${path}`, {
    ...options,
    headers: {
      origin: 'https://store.example',
      ...(options.headers || {})
    }
  });
}

const loginResponse = await worker.fetch(request('/api/admin/login', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ password: 'Jihad@2026#Store' })
}), env);
assert.equal(loginResponse.status, 200);
assert.match(loginResponse.headers.get('set-cookie') || '', /sarour_admin=/);
const loginBody = await loginResponse.json();
assert.equal(loginBody.ok, true);
assert.ok(loginBody.admin_token);

const adminResponse = await worker.fetch(request('/api/admin/state', {
  headers: { authorization: `Bearer ${loginBody.admin_token}` }
}), env);
assert.equal(adminResponse.status, 200);
const adminBody = await adminResponse.json();
assert.equal(adminBody.ok, true);

const badLoginResponse = await worker.fetch(request('/api/admin/login', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ password: 'wrong-password' })
}), env);
assert.equal(badLoginResponse.status, 401);

const blockedOriginResponse = await worker.fetch(new Request('https://store.example/api/admin/login', {
  method: 'POST',
  headers: { origin: 'https://evil.example', 'content-type': 'application/json' },
  body: JSON.stringify({ password: 'Jihad@2026#Store' })
}), env);
assert.equal(blockedOriginResponse.status, 403);

console.log('Admin login tests passed: password normalization, cookie, bearer fallback, rejection and origin protection.');
