# Local backend integration

The `/demo` and `/seller/orders` screens now have **Mock · no API** and **Live · your backend** modes. Mock replies still come from `lib/demo-store.ts`; Live uses `lib/demo-api.ts` and the Python backend. Live never falls back to mock replies.

## Run

1. In the backend checkout, activate its venv, run `alembic upgrade head`, and start `uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload`.
2. Keep `LIVE_CHAT_ENABLED=false` for quota-free connection/history/order checks. Set a separate `DEMO_API_KEY` in the backend `.env`; the current local checkout already has a generated key. Do not use your OpenRouter API key in the UI.
3. In this frontend checkout, run `npm run dev`, open `/demo`, select Live mode, enter `http://127.0.0.1:8000` and that demo key, then connect.
4. Enable `LIVE_CHAT_ENABLED=true` and restart the backend only when intending to send real model requests. Connecting and browsing orders do not call the model.

The frontend also remains hosted at https://yefhamak.vercel.app. Browsers may restrict an HTTPS page's access to a local HTTP/private-network backend; the local frontend is the dependable development path. Other visitors cannot connect to the backend on your computer.

## Storage and retries

- Access keys stay in JavaScript tab memory and the password input while mounted. They survive client navigation but not reload/Disconnect. No key is stored in localStorage/sessionStorage or NEXT_PUBLIC environment variables.
- Mock order data stays in its existing localStorage namespace; Live orders come from the database and show actual `PENDING`, `CONFIRMED`, `CANCELLED` statuses. The Live seller view is read-only and supports real multi-item order details.
- The selected mode is remembered in localStorage. Conversation IDs and pending request IDs/text are sessionStorage data scoped by backend origin, so use sample customer data only.
- Each send persists one UUID before posting. A transport failure offers **Check same request safely**, which reuses the UUID/text. The backend caches completed results and refuses to re-run unfinished requests. No automatic sends/retries occur.
- An interrupted backend operation may already have committed stock/order changes. Inspect history/orders. Leaving an uncertain conversation requires an explicit warning and does not cancel backend actions. Recovering a stuck claim is a backend operator task.
- Rate limits and provider errors show explicit notices; sending stays disabled when the backend's live flag is off. A completed provider error is cached; a new model attempt is a new deliberate message.

## Verification

```text
npm run build
node --experimental-strip-types --test tests/demo-store.test.mjs tests/demo-api.test.mjs
```

Build and all 13 frontend tests passed on Node 24. Saved test output is in `docs/testing/2026-11-01-step2-frontend.txt`. Client tests mock fetch; a separate network check of this exact client against the real local backend is in `docs/testing/2026-11-01-step2-client-network.txt`. Backend docs record the real-database guarded-message/deduplication smoke check and 37 backend tests. No OpenRouter requests were used. The genuine model reply path still needs live quota for validation.

Keep docs, results, and screenshots for later screen recordings and portfolio work. Video/portfolio creation is deferred.
