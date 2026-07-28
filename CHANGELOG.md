# Changelog

## v4.4.0 — Store Support Links
- Added configurable WhatsApp Group, Support Admin and Support Group links.
- Added order-not-received help panel in Wallet and Support pages.
- Added per-order Get Support button with Order ID message.
- Added support links to purchase success modal and footer.
- Links are hidden automatically until configured in Admin Settings.
- Added safe HTTPS link handling and retained direct Telegram/WhatsApp delivery contacts.


## 4.3.0
- Added buyer Telegram ID/username and WhatsApp number fields during checkout.
- Saves delivery contacts with every order and shows them in the admin order table and CSV export.
- Added configurable Telegram username/link, Telegram numeric ID, WhatsApp support number, and post-purchase message.
- Added a post-purchase screen with Order ID, Telegram/WhatsApp contact buttons, and copyable order message.
- Added runtime D1 auto-upgrade plus migration `0005_order_delivery_contacts.sql`.


## 4.2.0
- Removed the visible default admin password from the login screen.
- Replaced heavy rainbow/blood effects with a lightweight five-color static theme.
- Reduced blur, animated gradients, hover transforms, and admin auto-refresh frequency.
- Added quick stock controls (+1, +5, -1) in product management.
- Permanent product deletion now preserves old order snapshots and succeeds even with order history.
- Added four starter products once; deleted products no longer return automatically.

## 4.1.1 - Admin Login Fix

- Admin login now initializes only the small auth schema before password verification.
- Fixed login failure when Cloudflare secrets were pasted with surrounding quotes.
- Added a session-token fallback when browsers or proxies do not retain the HttpOnly cookie.
- Made rate-limit and audit writes non-blocking for valid admin login.
- Added extra runtime repair for older D1 table layouts.

## 4.1.0
- Removed deploy-blocking required secret declaration
- Added built-in admin password fallback
- Made ADMIN_SECRET and SESSION_SECRET optional
- Added stable derived signing keys
- Added automatic D1 schema/table/column repair
- Fixed admin login 500 errors caused by missing auth tables
- Matched Worker name to sarour-store-final-v10-cloudflar

## 4.0.0
- Dynamic payment methods and homepage cards
- Yellow, rainbow and blood-style theme controls
- Cloudflare health and configuration tools
