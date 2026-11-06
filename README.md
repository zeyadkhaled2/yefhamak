# Yefhamak | يفهمك — Frontend

[![Frontend CI](https://github.com/zeyadkhaled2/yefhamak/actions/workflows/ci.yml/badge.svg)](https://github.com/zeyadkhaled2/yefhamak/actions/workflows/ci.yml)

A bilingual website and demo workspace for an Egyptian Arabic AI shopping assistant. Customers can chat about products and place orders; sellers can review those orders in a separate screen.

**[Watch the full live-chat demo](https://www.youtube.com/watch?v=gR0TXw6iMhM)** · **[Try the public mock demo](https://yefhamak.vercel.app/demo)** · **[Visit the website](https://yefhamak.vercel.app/)** · **[Backend repository](https://github.com/zeyadkhaled2/yefhamak-backend)**

[![Watch the Yefhamak demo on YouTube](https://img.youtube.com/vi/gR0TXw6iMhM/hqdefault.jpg)](https://www.youtube.com/watch?v=gR0TXw6iMhM)

The recording shows the live chat experience. The backend subsequently gained store-document RAG; its [separate test evidence](https://github.com/zeyadkhaled2/yefhamak-backend/blob/main/docs/testing/2026-11-06-rag.md) documents that addition.

## Two ways to try it

**Mock — no API:** the hosted demo uses scripted Arabic shopping replies and browser-local orders. No backend, API key or model quota is required. This demonstrates the interface; it is not a live AI conversation and does not change real stock.

**Live — your backend:** run the FastAPI/PostgreSQL backend and this frontend locally. Messages use the real model, history/orders persist in PostgreSQL, and seller actions update inventory through backend transactions. Live mode never falls back to mock replies.

Browsers may restrict the public HTTPS website from connecting to a local HTTP backend. Use the local frontend for dependable Live testing. The backend on one visitor's machine is not accessible to other visitors.

## Features

- Arabic/English landing page with right-to-left support and contact form.
- Shared Mock/Live chat and seller-order layouts, with light/dark mode.
- Arabic-friendly chat composer: Enter sends, Shift+Enter adds a line, and focus returns after replies.
- Live connection status, conversation history and explicit recovery for interrupted requests.
- Seller order search, filters, details and confirm/cancel actions.
- Backend-generated document-source references shown in Live replies.

Live answers are progressively revealed after the backend returns a checked response. This is a presentation effect, not token-by-token server streaming.

## Run locally

Use **Node.js 24** (the version used by CI) and npm:

```bash
git clone https://github.com/zeyadkhaled2/yefhamak.git
cd yefhamak
npm ci
npm run dev
```

Open http://localhost:3000:

- `/` — bilingual landing page.
- `/demo` — Mock/Live customer chat.
- `/seller/orders` — Mock/Live seller workspace.
- `/contact` — seller contact form.

The mock demo does not require contact-webhook credentials or a model key.

### Connect Live mode

1. Follow the [backend Docker setup](https://github.com/zeyadkhaled2/yefhamak-backend#run-locally). Seed the store only on first setup.
2. Open `/demo`, select **Live**, and enter `http://127.0.0.1:8000` with the backend's `DEMO_API_KEY`.
3. To send messages, configure `OPENROUTER_API_KEY` and `COMPOSE_LIVE_CHAT_ENABLED=true` in the backend `.env`, then recreate its service with `docker compose up -d --build --wait`. For a backend running directly in Python, use `LIVE_CHAT_ENABLED=true` instead.
4. Use synthetic customer details for demo orders. Inspect and confirm/cancel them in `/seller/orders`.

**Never enter your OpenRouter key in this UI.** The demo access key stays in tab memory and must be re-entered after reload. Conversation/request identifiers and pending text may use session storage; mock orders use local storage. Connecting, reading history and reviewing orders do not consume model quota; sending chat messages does.

## Backend responsibilities

The [Python backend](https://github.com/zeyadkhaled2/yefhamak-backend) owns model tool calling, catalog lookup, reservations, order preview/creation, inventory transactions, request deduplication and RAG. RAG currently uses seller-scoped Arabic/English **lexical retrieval**, not embeddings. The frontend displays the resulting reply and sources.

The hosted mock works independently of those services. The landing page describes the broader product direction; WhatsApp transport, payments and shipping are not implemented in the browser MVP.

## Contact-form configuration

Contact submissions go through `POST /api/contact`, which validates the payload server-side and forwards it to Google Apps Script/Sheets. To enable this optional flow, copy `.env.example` to `.env.local` and configure:

```dotenv
SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
SHEETS_WEBHOOK_SECRET=your-shared-webhook-secret
```

The Apps Script Web App must accept JSON in `doPost`, validate the same secret, and write the lead to your Sheet. Deploy it to execute as the script owner with access allowing the server to call it. Keep these values server-only; never use `NEXT_PUBLIC_*` for secrets. Configure them separately in Vercel when deploying the contact flow. A build does not verify delivery to Sheets.

## Stack and repository guide

**Next.js App Router, React, TypeScript, Tailwind CSS, GSAP, Lucide, Formik/Yup, Vercel.**

- `app/` — landing/contact/demo/order routes, layout and contact API.
- `components/demo/` — workspace switcher, Mock/Live implementations and shared styling.
- `lib/demo-store.ts` — scripted mock conversation and browser-local order logic.
- `lib/demo-api.ts` — authenticated backend client and request-recovery handling.
- `components/landing/` — landing-page composition and sections.
- `lib/dictionary.ts`, `lib/copy.ts`, `lib/site-config.ts` — bilingual copy and site configuration.
- `tests/` — offline Node tests for mock behavior and the API client.
- `docs/`, [FRONTEND_UPDATES.md](FRONTEND_UPDATES.md) — integration notes, saved evidence and handoff history.

## Verification and deployment

```bash
npm test          # Offline tests; no real LLM calls
npm run build     # Production build and TypeScript checks
npm run start     # Serve the completed build locally
```

[GitHub Actions](.github/workflows/ci.yml) runs tests and a production build on pushes and pull requests using Node 24. See [CI documentation](docs/ci.md) for saved logs. Client tests use mocked network responses and do not establish model-answer quality; [backend evidence](https://github.com/zeyadkhaled2/yefhamak-backend/blob/main/docs/testing/2026-11-06-rag.md) covers separate database and live-model checks.

The frontend is deployed on Vercel from `main`. Public visitors can try the mock demo or watch the live recording without setting up the backend. This is a portfolio MVP; production account authentication, public live-backend hosting and real commerce integrations remain future work.

## License

All rights reserved. Public repository visibility does not grant an open-source license.
