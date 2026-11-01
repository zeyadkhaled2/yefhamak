## Local MVP demo (2026-11-01)

Run `npm ci`, then `npm run dev`. Open [Demo chat](http://localhost:3000/demo) or [Seller orders](http://localhost:3000/seller/orders).

Choose **Mock · no API** for the scripted browser-local demo, or **Live · your backend** to connect to your local Python backend. Live supports persistent chat history and real read-only seller orders. Connection/history/orders do not call the model; sending requires the backend's explicit live flag. Keys stay in tab memory, not public build variables or browser storage. Use sample customer information only.

See [local connection, key handling, retries, and verification](docs/backend-integration.md). Verify with `npm run build` and `node --experimental-strip-types --test tests/demo-store.test.mjs tests/demo-api.test.mjs` (verified on Node 24).

---

# Yefhamak | يفهمك

> **مفيش سؤال هيبات** — No customer question goes unanswered.

Yefhamak is a WhatsApp-first AI sales assistant for Egyptian businesses. It helps shop owners answer customer questions in Egyptian Arabic, collect complete order details, and keep conversations moving without forcing sellers to manage another dashboard.

This repository contains the public bilingual marketing website and the secure contact-lead flow used to collect seller interest. The product itself is intentionally positioned around WhatsApp rather than a multi-channel inbox.

## Product scope

Yefhamak is built for sellers who want a practical, local-language sales assistant:

- WhatsApp-only customer conversations
- Egyptian Arabic and Franco-friendly replies
- Product, price, size, availability, and delivery answers
- Guided collection of customer name, address, phone number, and order details
- Human handoff when the assistant is uncertain
- Bilingual marketing experience in Arabic and English
- Direct seller acquisition through WhatsApp and the contact form

The current website is a marketing and lead-generation surface. It does not expose a customer chatbot or seller dashboard in the browser.

## Technology stack

- **Next.js App Router** — routing, metadata, server components, and the contact API route
- **React 19** — component-based UI
- **TypeScript** — type-safe application code
- **Tailwind CSS v4** — responsive styling and design tokens in `app/globals.css`
- **GSAP** — lightweight scroll-based reveal and motion effects
- **Formik + Yup** — contact form state, submission handling, and client-side validation
- **Lucide React** — consistent accessible interface icons
- **Google Apps Script + Google Sheets** — webhook destination for contact submissions
- **Vercel** — deployment and production hosting

## How the application works

### Marketing website

`app/page.tsx` renders the landing page through `components/landing/HomePage.tsx`. The home page composes the main sections from `components/landing/home-sections.tsx`, while reusable site-level values live in `lib/site-config.ts` and customer-facing copy lives in `lib/dictionary.ts`.

The website includes:

1. Bilingual navigation and language switching
2. Hero section with the WhatsApp-first value proposition
3. Problem, features, and workflow sections
4. Pricing and FAQ sections
5. WhatsApp call-to-action and floating contact button
6. Seller-focused final conversion section
7. Shared footer and brand details

### Contact flow

1. A seller opens `/contact` from the navigation or a call-to-action.
2. `components/ContactForm.tsx` manages the form with Formik and Yup.
3. The browser submits JSON to `POST /api/contact`.
4. `app/api/contact/route.ts` trims and validates the payload on the server, normalizes Arabic and Persian digits, and applies length limits.
5. The server adds `SHEETS_WEBHOOK_SECRET` and forwards the request to `SHEETS_WEBHOOK_URL`.
6. The Google Apps Script validates the shared secret and writes the lead into Google Sheets.
7. The API returns a small success or error response to the form; secrets never reach the browser.

The server performs validation even when the client form is valid. This protects the webhook from malformed requests and prevents trusting browser-side validation alone.

## Repository structure

```text
app/
  api/contact/route.ts       Server-side contact validation and Sheets webhook proxy
  contact/page.tsx           Bilingual contact page route
  globals.css               Global CSS, Tailwind theme, responsive styles, motion helpers
  layout.tsx                 Root metadata, fonts, favicon, and language provider
  page.tsx                   Home route entry point

components/
  ContactForm.tsx            Contact form UI and Formik/Yup integration
  forms/ContactForm.tsx      Form-specific implementation retained for compatibility
  landing/
    HomePage.tsx             Main landing page composition
    home-sections.tsx        Homepage section components and content presentation
  layout/
    LanguageProvider.tsx     Arabic/English state and document direction handling

a hooks/
  use-gsap-scroll.ts         Shared GSAP scroll animation hook

lib/
  copy.ts                    Shared copy helpers and contact-facing text
  dictionary.ts              Central Arabic/English product copy dictionary
  site-config.ts             Brand, navigation, contact, and WhatsApp configuration

types/
  index.ts                   Shared TypeScript types

public/
  yefhamak-logo.png          Official logo used across the website and favicon

.env.example                 Required environment variable names
next.config.mjs              Next.js configuration and response headers
postcss.config.mjs           Tailwind/PostCSS configuration
```

> The `a hooks/` line above represents the `hooks/` directory; the space is intentional in this documentation block only to keep the directory label visually distinct from the root-level files. The actual path is `hooks/use-gsap-scroll.ts`.

## Brand and contact details

The official logo is `public/yefhamak-logo.png`. It is reused in the navigation, footer, phone preview, and browser icon. The official Arabic phrase is:

**مفيش سؤال هيبات**

- WhatsApp: [+20 103 044 7979](https://wa.me/201030447979)
- Email: [yefhamak.@gmail.com](mailto:yefhamak.@gmail.com)

Update these values through the shared configuration and dictionary files rather than scattering them across page markup.

## Environment variables

Copy `.env.example` to `.env.local` for local development:

```bash
SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
SHEETS_WEBHOOK_SECRET=replace-with-the-same-shared-key-used-by-Apps-Script
```

### Google Apps Script requirements

The webhook must be deployed as a Google Apps Script Web App with:

- **Execute as:** the account that owns the script
- **Who has access:** anyone
- A `doPost` handler that accepts JSON
- The same shared key configured in both Apps Script and Vercel as `SHEETS_WEBHOOK_SECRET`
- A deployment URL ending in `/exec`, not the Google Sheet editor URL

Never commit `.env.local`, webhook URLs, shared keys, or other credentials. Environment variables should be configured in Vercel for Development, Preview, and Production as appropriate.

## Local development

This project uses npm because the repository includes `package-lock.json`:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Useful routes:

- `/` — marketing homepage
- `/contact` — seller contact form
- `/api/contact` — POST-only contact endpoint

## Available scripts

```bash
npm run dev       # Start the Next.js development server
npm run build     # Run the production build and TypeScript checks
npm run start     # Serve the production build locally
```

Run `npm run build` before publishing. A successful local build confirms that the routes and TypeScript contracts compile, but the production contact flow also requires valid Vercel environment variables and a reachable Apps Script deployment.

## Content and maintenance rules

- Keep Arabic and English customer-facing copy in `lib/dictionary.ts` or `lib/copy.ts`.
- Keep URLs, phone numbers, brand values, and navigation configuration in `lib/site-config.ts`.
- Do not hardcode the WhatsApp number in multiple components.
- Keep the homepage section order and composition in `components/landing/HomePage.tsx` and `components/landing/home-sections.tsx`.
- Put server-side validation and webhook behavior only in `app/api/contact/route.ts`.
- Never expose `SHEETS_WEBHOOK_SECRET` through `NEXT_PUBLIC_*` variables or client components.
- Preserve right-to-left behavior for Arabic and verify both languages after copy changes.
- Use semantic HTML, keyboard-accessible controls, descriptive image alt text, and reduced-motion-friendly animation behavior.
- Prefer small, focused edits to the central dictionary and section components instead of duplicating text or adding one-off page markup.

## Deployment checklist

1. Confirm the production Vercel project uses the correct Git branch.
2. Add `SHEETS_WEBHOOK_URL` and `SHEETS_WEBHOOK_SECRET` to the required Vercel environments.
3. Confirm the webhook URL ends with `/exec` and the Apps Script access setting is **Anyone**.
4. Run `npm run build`.
5. Test the homepage, language switcher, WhatsApp links, and `/contact` on desktop and mobile.
6. Submit a test contact lead and confirm it appears in the intended Google Sheet.
7. Check Vercel deployment and runtime logs if the contact submission returns an error.

## Security and privacy notes

Contact submissions contain seller-provided business and contact information. The API validates and limits fields before forwarding them. Keep the Google Sheet access restricted to the team that needs it, avoid logging request bodies, and rotate the shared webhook key if it is ever exposed.

## License

Private product repository. All rights reserved.

© Yefhamak. Built for Egyptian sellers, starting with WhatsApp.
