# Auto Payment API Guide

## Current provider: SSLCOMMERZ

Storefront এই endpoint call করে:

```http
POST /api/payments/sslcommerz/initiate
Content-Type: application/json

{
  "amount": 500,
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "01700000000"
}
```

Successful response:

```json
{
  "ok": true,
  "transaction_id": "SR...",
  "gateway_url": "https://sandbox.sslcommerz.com/..."
}
```

Frontend customer-কে `gateway_url`-এ redirect করে।

## Callback endpoints

```text
POST /api/payments/sslcommerz/ipn
POST /api/payments/sslcommerz/success
POST /api/payments/sslcommerz/fail
POST /api/payments/sslcommerz/cancel
```

Flow:

1. Worker নিজের unique transaction ID তৈরি করে `payment_sessions` table-এ `Initiated` status save করে।
2. Worker server-side থেকে gateway initiation API call করে।
3. Customer gateway page-এ payment করে।
4. Gateway IPN/callback পাঠায়।
5. Worker callback-এর `val_id` নিয়ে SSLCOMMERZ Validation API call করে।
6. Worker database transaction ID, original amount, currency ও validation status মিলিয়ে দেখে।
7. Risk level safe হলে payment `Paid` হয়।
8. Database trigger wallet-এ একবারই credit করে এবং `wallet_ledger` record তৈরি করে।

শুধু browser success redirect দেখে balance credit করা হয় না। Server-to-server validation সফল হওয়া বাধ্যতামূলক।

## Required Cloudflare secrets

```bash
npx wrangler secret put SSLCOMMERZ_STORE_ID
npx wrangler secret put SSLCOMMERZ_STORE_PASSWORD
```

## Sandbox and live switch

```toml
[vars]
PAYMENT_MODE = "sandbox"
```

অথবা:

```toml
[vars]
PAYMENT_MODE = "live"
```

## Internal store API

### Public state

```http
GET /api/state
```

Returns products, current secure-session user, wallet balance, orders, payments, deposits, ledger and public settings.

### Buy product

```http
POST /api/orders
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 1,
  "note": "Optional note"
}
```

### Manual deposit

```http
POST /api/deposits/manual
Content-Type: application/json

{
  "amount": 500,
  "method": "bKash — 01XXXXXXXXX",
  "txid": "TRANSACTION-ID"
}
```

### Support message

```http
POST /api/messages
Content-Type: application/json

{
  "topic": "Order help",
  "body": "Message text"
}
```

User identity client-supplied header দিয়ে নেওয়া হয় না। Signed HttpOnly cookie থেকে নির্ধারিত হয়।

## Adding a direct bKash adapter

Direct bKash integration-এর high-level pattern:

1. Approved merchant sandbox/live credentials সংগ্রহ করুন।
2. Credentials Cloudflare secrets-এ রাখুন, source code-এ নয়।
3. `/api/payments/bkash/initiate` endpoint বানান।
4. Server-side grant token নিন এবং token cache/expiry handle করুন।
5. Create Payment API call করে provider payment ID `payment_sessions`-এ save করুন।
6. Customer callback-এর পরে Execute Payment/Query Payment server-side call করুন।
7. Provider response-এর amount, currency, merchant invoice এবং final status database-এর সাথে মিলান।
8. Verification সফল হলে কেবল `status='Paid'` update করুন; existing database trigger wallet credit করবে।
9. Retry ও duplicate callback idempotent রাখুন।

Credentials পাওয়ার আগে endpoint নাম বা request fields অনুমান করে live integration করবেন না; provider merchant documentation-এর exact version অনুসরণ করতে হবে।
