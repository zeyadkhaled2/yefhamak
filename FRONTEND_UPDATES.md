## Repository presentation cleanup
- Focused README on implemented features and user workflows; removed tracked environment template and updated local contact configuration instructions.

## Demo documentation refresh
- Replaced outdated marketing-only README with current Mock/Live features, YouTube demo, backend links, setup, contact configuration and honest MVP limitations. No app code changes.

# 2026-11-03 — Seller order actions
- Live details now confirm pending orders and cancel pending/confirmed orders with explicit cancellation review; cancelled orders cannot reopen.
- Authenticated POST actions use backend inventory transactions; busy controls prevent overlapping clicks; failures try to refresh the real status without automatic action retries. Same-action retries are backend-idempotent.
- Order list/filter totals refresh after review. Existing fonts/colors retained. No model calls or customer notifications. Backend must include seller order endpoints.

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

- CI step 1: GitHub Actions on push/PR/manual dispatch; Node 24, npm ci, npm test (13 offline tests), production build. Pinned/read-only actions, timeouts, cancelled superseded runs, log artifacts retained 14 days. No backend/model/webhook calls. Vercel deployment remains independent of test results. See docs/ci.md.

2026-11-03 validation: 14 frontend tests + production build passed; local browser confirmed/cancelled a synthetic PostgreSQL test order and verified the Pending filter. Backend suite: 41 offline + 25 PostgreSQL checks passed; evidence saved in backend docs/testing. No model quota used.
