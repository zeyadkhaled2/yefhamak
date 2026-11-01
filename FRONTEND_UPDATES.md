# Brief handoff — 2026-11-01

- Added `/demo` customer chat and `/seller/orders` seller view, styled to match the existing cream/teal site; linked demo from landing hero.
- Mock-only: scripted Arabic hoodie flow, product clarification, explicit reservation/order confirmation, delivery validation, preview, and local order creation. Fixture names/prices match backend seed; only size M hoodie scenarios are supported. No real stock updates or reservation expiry.
- Seller view: search, status filters, detail dialog, mark reviewed/cancel, local metrics, confirmed reset. Orders use localStorage key `yefhamak.demo.orders.v1` and sync between tabs on the same origin. Chat messages are session component state and reset on reload/navigation.
- No backend/LLM calls, real payments, WhatsApp, or shipping. Use sample customer data only. Real API integration is next; live model validation remains quota-dependent.
- Checks: production build + TypeScript; `node --experimental-strip-types --test tests/demo-store.test.mjs`; browser walkthrough of order creation, seller details/review/search, mobile layouts. See backend `UPDATES.md` for prior work.
- Preserved existing untracked `app/seed.py` and environment files. Frontend has its own Git repository; changes are not pushed automatically.
- Dependency maintenance: pinned Next.js to patched 16.4.3 after the existing 16.4.0 triggered a security advisory. Final production build and all 7 mock-flow tests pass; npm install audit reports 0 vulnerabilities.

- Brand alignment: shared Cairo font and landing palette tokens (cream #F7F5EF, teal #19A7A0, navy #142B3B, yellow #FFBE37); replaced demo-only sage colors, reused the existing logo. Mock behavior unchanged.

- Step 2: explicit Mock/Live switch; split MockWorkspace and LiveWorkspace; demo-api.ts talks directly to local backend. In-memory access key; origin-scoped conversation/pending IDs in sessionStorage; safe same-ID request checks, no automatic retries. Live DB history, paginated/searchable/filterable real orders and multi-item read-only details. Build + 13 tests pass; backend migration and API docs are in the backend checkout. Setup/evidence: docs/backend-integration.md. No model calls used for verification.
