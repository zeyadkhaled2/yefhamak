# Yefhamak | يفهمك

> **مفيش سؤال هيبات** — No customer question goes unanswered.

Yefhamak is a WhatsApp-first sales assistant for Egyptian businesses. It helps shop owners respond to customer questions in Egyptian Arabic, collect complete orders, and keep sales moving around the clock.

## Product direction

Yefhamak is intentionally focused on **WhatsApp only**. The public website is a lightweight bilingual landing page that explains the product and directs interested customers to the official WhatsApp number.

- Arabic-first experience with English language support
- Egyptian Arabic and Franco-friendly customer conversations
- Product, price, size, and stock answers
- Guided order collection for name, address, and phone number
- Human handoff whenever the assistant is uncertain
- Mobile-first responsive design
- Shared bilingual copy in `lib/dictionary.ts` for easier maintenance

## Brand

The official Yefhamak logo is stored at `public/yefhamak-logo.png` and is reused in the browser tab icon, landing page navigation, footer, and phone preview. The current Arabic phrase is:

**مفيش سؤال هيبات**

Official WhatsApp: [+20 103 044 7979](https://wa.me/201030447979)

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide React icons
- Cairo and Inter typography

## Project structure

```text
app/
  globals.css       Global styles and design tokens
  layout.tsx        Metadata, favicon, and root document
  page.tsx          Landing page composition and small UI components
lib/
  dictionary.ts     All Arabic and English product copy
public/
  yefhamak-logo.png Official brand logo
```

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Maintenance notes

Keep customer-facing Arabic and English text in `lib/dictionary.ts` rather than adding copy directly to page components. Keep the WhatsApp-only positioning consistent across navigation, feature descriptions, metadata, and calls to action. Update the phone number in the dictionary or WhatsApp links if the business contact changes.

## License

Private product repository. All rights reserved.
