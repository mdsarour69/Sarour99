# Test Report — v4.4.0

Passed checks:

- JavaScript syntax: `src/worker.js`
- JavaScript syntax: `public/app.js`
- Admin login: password normalization, HttpOnly cookie, bearer fallback, wrong-password rejection, same-origin protection
- Product order: Telegram/WhatsApp contact requirement and normalization
- Order response: WhatsApp Group, Support Admin, Support Group and support notice values
- UI structure: unique element IDs and all support settings fields present
- Customer flow: order-success support links, Order History “Get support”, Support page panel and footer links
- Empty optional links: hidden automatically

Note: replace the placeholder D1 `database_id` in `wrangler.toml` before Cloudflare deployment.
