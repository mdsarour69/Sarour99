import assert from 'node:assert/strict';
import worker from '../src/worker.js';

const TABLE_COLUMNS = {
  products: ['id','icon','name','description','category','price','stock','active','featured','delivery_note','sort_order','created_at','updated_at'],
  users: ['id','balance','display_name','email','phone','last_seen_at','created_at','updated_at'],
  orders: ['id','user_id','product_id','product_name','product_icon','amount','status','quantity','customer_note','customer_telegram','customer_whatsapp','created_at','updated_at'],
  deposits: ['id','user_id','amount','currency','method','txid','status','provider','provider_reference','admin_note','metadata_json','created_at','reviewed_at'],
  messages: ['id','user_id','topic','body','status','created_at','updated_at'],
  wallet_ledger: ['id','user_id','entry_type','amount','source_type','source_id','description','created_at'],
  payment_sessions: ['id','user_id','provider','amount','currency','status','customer_name','customer_email','customer_phone','gateway_url','gateway_session_key','validation_id','bank_transaction_id','risk_level','raw_response_json','created_at','paid_at','updated_at'],
  wallet_adjustments: ['id','user_id','amount_signed','reason','created_at'],
  admin_login_attempts: ['ip','attempts','window_started_at','locked_until'],
  audit_logs: ['id','actor','action','target_type','target_id','details','created_at'],
  payment_methods: ['id','method_key','label','account_label','account_value','icon','subtitle','active','sort_order','created_at','updated_at'],
  homepage_cards: ['id','icon','title','description','active','sort_order','created_at','updated_at']
};

class Statement {
  constructor(db, sql) { this.db = db; this.sql = String(sql); this.values = []; }
  bind(...values) { this.values = values; return this; }
  async run() {
    this.db.runs.push({ sql: this.sql, values: this.values });
    const isOrder = /insert\s+into\s+orders/i.test(this.sql);
    return { success: true, meta: { last_row_id: isOrder ? 77 : 1, changes: 1 } };
  }
  async first() {
    const lower = this.sql.toLowerCase();
    if (lower.includes('from products where id=? and active=1')) {
      return { id: 1, icon: '✨', name: 'Gemini AI Pro', price: 8, stock: 15, active: 1 };
    }
    if (lower.includes('count(*) as count from settings')) return { count: 1 };
    return null;
  }
  async all() {
    const lower = this.sql.toLowerCase().trim();
    if (lower.startsWith('pragma table_info')) {
      const match = lower.match(/pragma table_info\(([^)]+)\)/);
      return { results: (TABLE_COLUMNS[match?.[1]] || []).map(name => ({ name })) };
    }
    if (lower.includes('select key, value from settings')) {
      return { results: [
        { key: 'store_currency', value: 'USD' },
        { key: 'whatsapp', value: '8801783866415' },
        { key: 'telegram', value: '@sarour_support' },
        { key: 'telegram_id', value: '123456789' },
        { key: 'post_purchase_message', value: 'দয়া করে প্রোডাক্ট পেতে Telegram অথবা WhatsApp-এ মেসেজ দিন।' },
        { key: 'whatsapp_group_link', value: 'https://chat.whatsapp.com/TestInvite' },
        { key: 'support_admin_link', value: 'https://wa.me/8801783866415' },
        { key: 'support_group_link', value: 'https://t.me/sarour_support_group' },
        { key: 'support_notice', value: 'Order ID সহ support-এ যোগাযোগ করুন।' }
      ] };
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
const env = { DB, ASSETS: { fetch: async () => new Response('asset') }, ADMIN_PASSWORD: 'test-secret' };
const makeRequest = body => new Request('https://store.example/api/orders', {
  method: 'POST',
  headers: { origin: 'https://store.example', 'content-type': 'application/json' },
  body: JSON.stringify(body)
});

const noContact = await worker.fetch(makeRequest({ product_id: 1, quantity: 1, note: '' }), env);
assert.equal(noContact.status, 400);
assert.equal((await noContact.json()).code, 'CONTACT_REQUIRED');

const valid = await worker.fetch(makeRequest({
  product_id: 1,
  quantity: 2,
  telegram: ' @buyer_name ',
  whatsapp: '+880 1712-345678',
  note: 'Fast delivery please'
}), env);
assert.equal(valid.status, 201);
const body = await valid.json();
assert.equal(body.order_id, 77);
assert.equal(body.product_name, 'Gemini AI Pro');
assert.equal(body.quantity, 2);
assert.equal(body.telegram, '@sarour_support');
assert.equal(body.whatsapp, '8801783866415');
assert.match(body.post_purchase_message, /Telegram.*WhatsApp/);
assert.equal(body.whatsapp_group_link, 'https://chat.whatsapp.com/TestInvite');
assert.equal(body.support_admin_link, 'https://wa.me/8801783866415');
assert.equal(body.support_group_link, 'https://t.me/sarour_support_group');
assert.match(body.support_notice, /Order ID/);

const orderInsert = DB.runs.find(item => /insert\s+into\s+orders/i.test(item.sql));
assert.ok(orderInsert, 'Order insert was not executed');
assert.equal(orderInsert.values.at(-2), '@buyer_name');
assert.equal(orderInsert.values.at(-1), '+8801712345678');

console.log('Order contact tests passed: required contact, normalization, storage and post-purchase support response.');
