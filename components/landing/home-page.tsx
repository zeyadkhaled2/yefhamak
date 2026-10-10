"use client";

import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  Menu,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { businessPlan, copy } from "@/lib/dictionary";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

export default function Home() {
  const pageRef = useRef<HTMLElement>(null);
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const t = copy[lang];
  const isAr = lang === "ar";
  useGsapScroll(pageRef);
  return (
    <main
      ref={pageRef}
      dir={isAr ? "rtl" : "ltr"}
      className="marketing-page min-h-screen overflow-hidden bg-[#F7F5EF] text-[#142B3B]"
    >
      <nav className="sticky top-0 z-20 border-b border-[#142B3B]/10 bg-[#F7F5EF]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a
            href="#top"
            className="flex items-center gap-2 font-bold tracking-tight"
          >
            <img
              src="/yefhamak-logo.png"
              alt="Yefhamak"
              className="size-10 rounded-xl object-cover object-center"
            />
            <span className="text-xl">{isAr ? "يفهمك" : "Yefhamak"}</span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
            {t.nav.map((item, i) => (
              <a
                key={item}
                href={["#features", "#how", "#pricing", "#faq"][i]}
                className="transition-colors hover:text-[#19A7A0]"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => setLang(isAr ? "en" : "ar")}
              className="rounded-full border border-[#142B3B]/15 px-3 py-2 text-xs font-bold hover:border-[#19A7A0]"
            >
              {isAr ? "EN" : "AR"}
            </button>
            <a
              href="#waitlist"
              className="rounded-full bg-[#19A7A0] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#148c86]"
            >
              {t.waitlist}
            </a>
          </div>
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 md:hidden"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="flex flex-col gap-4 border-t border-[#142B3B]/10 px-5 py-5 md:hidden">
            <button
              onClick={() => setLang(isAr ? "en" : "ar")}
              className="self-start text-sm font-bold"
            >
              {isAr ? "English" : "العربية"}
            </button>
            {t.nav.map((item, i) => (
              <a
                key={item}
                href={["#features", "#how", "#pricing", "#faq"][i]}
                onClick={() => setMenuOpen(false)}
                className="font-semibold"
              >
                {item}
              </a>
            ))}
            <a
              href="#waitlist"
              className="rounded-full bg-[#19A7A0] px-5 py-3 text-center font-bold text-white"
            >
              {t.waitlist}
            </a>
          </div>
        )}
      </nav>

      <section
        id="top"
        className="hero-section mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-32 lg:pt-28"
      >
        <div className="hero-copy">
          <p className="mb-5 flex items-center gap-2 text-sm font-bold text-[#19A7A0]">
            <Sparkles className="size-4" />
            {t.heroEyebrow}
          </p>
          <h1 className="max-w-2xl text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            {t.heroTitle}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#142B3B]/70">
            {t.heroText}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#waitlist"
              className="rounded-full bg-[#19A7A0] px-6 py-3.5 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#148c86]"
            >
              {t.waitlist}
              <ArrowLeft className="mx-1 inline size-4" />
            </a>
            <a
              href="https://wa.me/201030447979"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#142B3B] px-6 py-3.5 font-bold transition hover:bg-[#142B3B] hover:text-white"
            >
              <MessageCircle className="mx-1 inline size-4" />
              {t.whatsapp}
            </a>
          </div>
        </div>
        <div data-float className="hero-device-wrap">
          <div className="hero-orb" aria-hidden="true" />
          <PhoneMockup isAr={isAr} />
        </div>
      </section>

      <section className="border-y border-[#142B3B]/10 bg-white/35 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold text-[#19A7A0]">{t.problemEyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-tight">
            {t.problemTitle}
          </h2>
          <div data-stagger className="mt-10 grid gap-4 md:grid-cols-3">
            {t.problems.map((p, i) => (
              <div
                key={p}
                className="lift-card rounded-2xl border border-[#142B3B]/10 bg-[#F7F5EF] p-6"
              >
                <span className="mb-12 flex size-10 items-center justify-center rounded-xl bg-[#142B3B] text-lg font-bold text-white">
                  0{i + 1}
                </span>
                <p className="text-lg font-bold leading-7">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <p className="text-sm font-bold text-[#19A7A0]">{t.featureEyebrow}</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight">
          {t.featureTitle}
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.features.map(([title, body, Icon]) => (
            <div
              key={title as string}
              className="lift-card rounded-2xl border border-[#142B3B]/10 bg-white p-6 shadow-sm"
            >
              <div className="mb-8 flex size-11 items-center justify-center rounded-xl bg-[#19A7A0]/10 text-[#19A7A0]">
                <Icon className="size-5" />
              </div>
              <h3 className="text-lg font-bold">{title as string}</h3>
              <p className="mt-3 text-sm leading-6 text-[#142B3B]/65">
                {body as string}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="how"
        className="bg-[#142B3B] px-5 py-24 text-[#F7F5EF] lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold text-[#19A7A0]">{t.howEyebrow}</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">
            {t.howTitle}
          </h2>
          <div data-stagger className="mt-12 grid gap-10 md:grid-cols-3">
            {t.steps.map(([title, body], i) => (
              <div key={title} className="relative">
                <span className="text-6xl font-black text-[#19A7A0]/40">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-2 leading-7 text-[#F7F5EF]/65">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <p className="text-sm font-bold text-[#19A7A0]">{t.pricingEyebrow}</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight">
          {t.pricingTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#142B3B]/70">
          {t.pricingText}
        </p>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {businessPlan[lang].plans.map((plan, index) => (
            <article
              key={plan.name}
              className={`lift-card flex flex-col rounded-3xl border p-7 ${index === 1 ? "border-[#19A7A0] bg-[#142B3B] text-[#F7F5EF] shadow-xl shadow-[#142B3B]/15" : "border-[#142B3B]/10 bg-white"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl font-black">{plan.name}</h3>
                {index === 1 && (
                  <span className="rounded-full bg-[#19A7A0] px-3 py-1 text-xs font-bold text-white">
                    {isAr ? "الأكثر طلبًا" : "Most popular"}
                  </span>
                )}
              </div>
              <p
                className={`mt-6 text-4xl font-black ${index === 1 ? "text-[#19A7A0]" : "text-[#142B3B]"}`}
              >
                {plan.price}{" "}
                <span
                  className={`text-sm font-bold ${index === 1 ? "text-[#F7F5EF]/60" : "text-[#142B3B]/50"}`}
                >
                  {businessPlan[lang].unit}
                </span>
              </p>
              <p
                className={`mt-3 text-sm font-bold ${index === 1 ? "text-[#F7F5EF]/70" : "text-[#142B3B]/65"}`}
              >
                {plan.replies}
              </p>
              <div
                className={`my-7 h-px ${index === 1 ? "bg-white/15" : "bg-[#142B3B]/10"}`}
              />
              <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                {businessPlan[lang].included}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm leading-6">
                    <Check className="mt-1 size-4 shrink-0 text-[#19A7A0]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div
                className={`mt-auto pt-8 text-sm ${index === 1 ? "text-[#F7F5EF]/70" : "text-[#142B3B]/60"}`}
              >
                <span className="font-bold">
                  {businessPlan[lang].surplusLabel}
                </span>{" "}
                {plan.surplus} {businessPlan[lang].unit}
              </div>
              <a
                href="#waitlist"
                className={`mt-5 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-bold ${index === 1 ? "bg-[#19A7A0] text-white hover:bg-[#148c86]" : "bg-[#142B3B] text-white hover:bg-[#203d51]"}`}
              >
                {t.talk}
                <ArrowUpRight className="size-4" />
              </a>
            </article>
          ))}
        </div>
        <div className="mt-6 grid gap-4 rounded-2xl border border-[#142B3B]/10 bg-white/60 p-6 text-sm leading-6 text-[#142B3B]/65 md:grid-cols-2">
          <p>{businessPlan[lang].integrity.replace(":", "")}</p>
        </div>
      </section>

      <section id="waitlist" className="px-5 pb-24 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 rounded-3xl bg-[#19A7A0] p-8 text-white sm:p-12 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold text-white/75">{t.waitlist}</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-black leading-tight">
              {t.ctaTitle}
            </h2>
            <p className="mt-4 text-white/75">{t.ctaText}</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              required
              type="text"
              aria-label={t.phonePlaceholder}
              placeholder={t.phonePlaceholder}
              className="min-w-0 flex-1 rounded-full border-0 bg-white px-5 py-3.5 text-[#142B3B] outline-none ring-2 ring-transparent placeholder:text-[#142B3B]/40 focus:ring-[#142B3B]"
            />{" "}
            <button className="rounded-full bg-[#142B3B] px-6 py-3.5 font-bold text-white hover:bg-[#203d51]">
              {submitted ? <Check className="mx-auto size-5" /> : t.waitlist}
            </button>
          </form>
        </div>
      </section>

      <section
        id="faq"
        className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 lg:grid-cols-[.7fr_1.3fr] lg:px-8"
      >
        <div>
          <p className="text-sm font-bold text-[#19A7A0]">{t.faqEyebrow}</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">
            {t.faqTitle}
          </h2>
        </div>
        <div className="flex flex-col">
          {t.faqs.map(([q, a]) => (
            <details
              key={q}
              className="group border-b border-[#142B3B]/15 py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                {q}
                <ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="max-w-2xl pt-4 leading-7 text-[#142B3B]/65">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="dashboard" className="bg-white/50 px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold text-[#19A7A0]">
            {isAr ? "لصاحب البيزنس" : "For the business owner"}
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-tight">
            {isAr
              ? "كل اللي محتاج تعرفه، في مكان واحد"
              : "The useful view, in one place"}
          </h2>
          <div
            data-stagger
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <DashboardCard
              label={isAr ? "حالة واتساب" : "WhatsApp status"}
              value={isAr ? "متصل" : "Connected"}
              tone="teal"
            />
            <DashboardCard
              label={isAr ? "المساعد" : "Assistant"}
              value={isAr ? "شغال" : "Active"}
            />
            <DashboardCard
              label={isAr ? "محادثات تحتاجك" : "Needs handover"}
              value="3"
            />
            <DashboardCard
              label={isAr ? "أسئلة بلا إجابة" : "Unanswered questions"}
              value="5"
            />
          </div>
          <p className="mt-6 text-sm leading-6 text-[#142B3B]/60">
            {isAr
              ? "نبدأ بالأساسيات: حالة الاتصال، إيقاف المساعد وقت ما تحتاج، المحادثات الأخيرة، والتحويل لك عند عدم التأكد. التفاصيل تتوسع مع احتياجك."
              : "Start with the essentials: connection state, pause control, recent conversations, and handover when the assistant is unsure."}
          </p>
        </div>
      </section>
      <a
        href="https://wa.me/201030447979"
        target="_blank"
        rel="noreferrer"
        aria-label={t.whatsapp}
        className="fixed bottom-5 left-5 z-30 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#142B3B]/20 transition hover:-translate-y-1 hover:bg-[#20bd5b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/35 sm:bottom-7 sm:left-7"
      >
        <MessageCircle className="size-7" />
      </a>

      <footer className="border-t border-[#142B3B]/10 px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 font-bold">
              <img
                src="/yefhamak-logo.png"
                alt="Yefhamak"
                className="size-8 rounded-lg object-cover object-center"
              />
              {isAr ? "يفهمك" : "Yefhamak"}
            </div>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#142B3B]/60">
              {t.footer}
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm font-semibold sm:items-end">
            <a
              href="https://wa.me/201030447979"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#19A7A0]"
            >
              WhatsApp
            </a>
            <a
              href="mailto:yefhamak.@gmail.com"
              className="hover:text-[#19A7A0]"
            >
              yefhamak.@gmail.com
            </a>
            <p className="mt-3 text-xs font-normal text-[#142B3B]/50">
              {t.copyright}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function PhoneMockup({ isAr }: { isAr: boolean }) {
  return (
    <div className="mx-auto w-full max-w-[370px] rounded-[2.8rem] border-[10px] border-[#142B3B] bg-[#142B3B] p-2 shadow-2xl shadow-[#142B3B]/20">
      <div className="overflow-hidden rounded-[2rem] bg-white">
        <div className="flex items-center justify-between bg-[#F7F5EF] px-5 py-4 text-xs font-bold">
          <span>9:41</span>
          <div className="flex gap-1">
            <span className="size-1.5 rounded-full bg-[#142B3B]" />
            <span className="size-1.5 rounded-full bg-[#142B3B]" />
            <span className="size-1.5 rounded-full bg-[#142B3B]" />
          </div>
        </div>
        <div className="flex items-center gap-3 border-b border-[#142B3B]/10 px-5 py-4">
          <img
            src="/yefhamak-logo.png"
            alt="Yefhamak"
            className="size-9 rounded-full object-cover object-center"
          />
          <div>
            <p className="text-sm font-bold">Yefhamak</p>
            <p className="text-[10px] text-[#19A7A0]">online</p>
          </div>
        </div>
        <div className="flex min-h-[400px] flex-col gap-4 bg-[#F7F5EF] p-5 text-sm">
          <div className="max-w-[85%] self-start rounded-2xl rounded-tr-sm bg-white p-3 leading-6 shadow-sm">
            {isAr
              ? "عندكم الهودي البني مقاس M؟ وبكام؟"
              : "Do you have the brown hoodie in M? How much?"}
          </div>
          <div className="max-w-[88%] self-end rounded-2xl rounded-tl-sm bg-[#19A7A0] p-3 leading-6 text-white">
            {isAr
              ? "أيوه موجود! الهودي البني مقاس M بـ 850 جنيه. تحب أأكدلك الطلب؟"
              : "Yes, it is in stock! The brown hoodie in M is 850 EGP. Shall I confirm your order?"}
            <p className="mt-2 text-[10px] text-white/60">9:41 ✓✓</p>
          </div>
          <div className="mt-auto flex items-center gap-2 rounded-full bg-white px-4 py-3 text-xs text-[#142B3B]/35">
            <span>{isAr ? "اكتب رسالة..." : "Type a message..."}</span>
            <Send className="ms-auto size-4 text-[#19A7A0]" />
          </div>
        </div>
      </div>
    </div>
  );
}
function DashboardCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "teal";
}) {
  return (
    <div className="rounded-2xl border border-[#142B3B]/10 bg-[#F7F5EF] p-5">
      <p className="text-sm text-[#142B3B]/60">{label}</p>
      <div
        className={`mt-4 text-2xl font-black ${tone === "teal" ? "text-[#19A7A0]" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}

export const dynamic = "force-static";
