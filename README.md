# SAROUR STORE Premium v4.1

Cloudflare Workers + Static Assets + D1 ভিত্তিক responsive digital store এবং admin panel।

## Fixed in v4.1

- Cloudflare deploy আর `ADMIN_SECRET`/`SESSION_SECRET` missing বলে বন্ধ হবে না
- শুধু `ADMIN_PASSWORD` দিলেই custom password ব্যবহার হবে
- কোনো password secret না থাকলে built-in fallback login: `Jihad@2026#Store`
- Admin login-এর প্রয়োজনীয় D1 table নিজে তৈরি/repair হয়
- পুরোনো D1 database-এর missing columns ও dynamic tables runtime-এ repair হয়
- Worker name connected project-এর সঙ্গে মিলানো হয়েছে

## Deploy

```bash
npm install
npx wrangler deploy
```

D1 ID এখনও `wrangler.toml`-এ placeholder থাকলে আগে চালাও:

```bash
npm run configure -- --database-id=YOUR_D1_DATABASE_ID --name=sarour-store-final-v10-cloudflar
```

Custom admin password দিতে চাইলে Cloudflare → Settings → Variables and Secrets-এ শুধু `ADMIN_PASSWORD` Secret যোগ করো। `ADMIN_SECRET` ও `SESSION_SECRET` optional।

সম্পূর্ণ deployment নির্দেশনা: `CLOUDFLARE_SETUP_BN.md`

## Admin login fix (v4.1.1)

- Default login: `Jihad@2026#Store`
- `ADMIN_PASSWORD` value quotesসহ paste করলেও normalize হবে।
- Cookie save না হলে browser session token fallback ব্যবহার করবে।
- পুরোনো D1 schema-এর unrelated error password verification বন্ধ করবে না।

## v4.2 performance and catalog fixes

- The admin login screen never displays the password. Configure `ADMIN_PASSWORD` as a Cloudflare secret.
- The storefront uses a lightweight static palette without rainbow or blood animations.
- Product management includes quick stock buttons (`-1`, `+1`, `+5`).
- Permanent product deletion keeps historical order names while removing the catalog item.
- Four starter products are seeded only once, so deleted products do not return.


## Order delivery contacts (v4.3)
Customers must enter at least one Telegram ID/username or WhatsApp number at checkout. The contact is saved with the order and visible in Admin → Orders. Configure the store support contacts and the after-purchase message from Admin → Settings.


## v4.4 Support link setup
Admin Panel → Settings থেকে নিচের link গুলো বসান:
- **WhatsApp group invite link** — `https://chat.whatsapp.com/...`
- **Support admin link** — `https://wa.me/...` অথবা `https://t.me/...`
- **Support group link** — Telegram/WhatsApp support group link
- **Order not received support notice** — customer-কে দেখানো নির্দেশনা

কোনো link খালি থাকলে public website-এ সেই button দেখাবে না।
