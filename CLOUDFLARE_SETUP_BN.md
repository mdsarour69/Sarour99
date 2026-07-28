# SAROUR STORE v4.1 — Cloudflare Setup

এই সংস্করণে admin login ও missing-secret deploy error ঠিক করা হয়েছে।

## বর্তমানে দরকার

1. Worker binding `ASSETS`
2. D1 binding `DB`
3. D1 database ID
4. Optional custom admin password

## Admin password

কোনো Secret না দিলেও login করা যাবে:

```text
Jihad@2026#Store
```

নিজের password দিতে Cloudflare Dashboard → Worker → Settings → Variables and Secrets → Add Secret:

```text
Name: ADMIN_PASSWORD
Value: তোমার নিজের password
```

`ADMIN_SECRET` ও `SESSION_SECRET` আর required নয়। না থাকলে Worker password থেকে session signing key তৈরি করবে।

## Deploy

D1 ID configure করা না থাকলে:

```bash
npm install
npm run configure -- --database-id=YOUR_D1_DATABASE_ID --name=sarour-store-final-v10-cloudflar
npx wrangler deploy
```

D1 ID আগে থেকেই বসানো থাকলে:

```bash
npm install
npx wrangler deploy
```

Database migration আলাদা করে না চালালেও প্রথম API request-এ প্রয়োজনীয় table, column, payment method এবং settings নিজে তৈরি/repair হবে। তবুও manual migration চালাতে চাইলে:

```bash
npm run db:migrate:remote
```

## Health check

```text
https://YOUR-WORKER.workers.dev/health
```

`ok: true` দেখালে Worker, Assets ও D1 ঠিক আছে।
