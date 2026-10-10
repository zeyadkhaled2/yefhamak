'use client'

import { FormEvent, useState } from 'react'
import { ArrowLeft, Check, Mail, MessageCircle } from 'lucide-react'
import { copy, type Language } from '@/lib/dictionary'

export default function ContactPage() {
  const [lang, setLang] = useState<Language>('ar')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const isAr = lang === 'ar'
  const t = copy[lang]

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(false)
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (!response.ok) { setError(true); return }
    setSent(true)
    form.reset()
  }

  return <main dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F5EF] text-[#142B3B]">
    <nav className="sticky top-0 z-20 border-b border-[#142B3B]/10 bg-[#F7F5EF]/90 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"><a href="/" className="flex items-center gap-2 font-bold tracking-tight"><img src="/yefhamak-logo.png" alt="Yefhamak" className="size-10 rounded-xl object-cover" /><span className="text-xl">{isAr ? 'يفهمك' : 'Yefhamak'}</span></a><button onClick={() => setLang(isAr ? 'en' : 'ar')} className="rounded-full border border-[#142B3B]/15 px-3 py-2 text-xs font-bold hover:border-[#19A7A0]">{isAr ? 'EN' : 'AR'}</button></div></nav>
    <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[.8fr_1.2fr] lg:items-start lg:px-8 lg:py-24"><div className="lg:sticky lg:top-32"><p className="text-sm font-bold text-[#19A7A0]">{t.contactEyebrow}</p><h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">{t.contactTitle}</h1><p className="mt-6 max-w-lg text-lg leading-8 text-[#142B3B]/70">{t.contactText}</p><div className="mt-10 flex flex-col gap-4 text-sm font-semibold"><a className="flex items-center gap-3 hover:text-[#19A7A0]" href="mailto:yefhamak.@gmail.com"><span className="flex size-10 items-center justify-center rounded-full bg-[#19A7A0]/10 text-[#19A7A0]"><Mail className="size-5" /></span>yefhamak.@gmail.com</a><a className="flex items-center gap-3 hover:text-[#19A7A0]" href="https://wa.me/201030447979" target="_blank" rel="noreferrer"><span className="flex size-10 items-center justify-center rounded-full bg-[#25D366]/15 text-[#159447]"><MessageCircle className="size-5" /></span>+20 103 044 7979</a></div></div><form onSubmit={submit} className="rounded-3xl border border-[#142B3B]/10 bg-white p-6 shadow-sm sm:p-9"><div className="grid gap-5 sm:grid-cols-2"><label className="flex flex-col gap-2 text-sm font-bold"><span>{t.firstName}</span><input required name="firstName" className="rounded-xl border border-[#142B3B]/15 bg-[#F7F5EF]/50 px-4 py-3 outline-none transition focus:border-[#19A7A0] focus:ring-4 focus:ring-[#19A7A0]/10" /></label><label className="flex flex-col gap-2 text-sm font-bold"><span>{t.lastName}</span><input required name="lastName" className="rounded-xl border border-[#142B3B]/15 bg-[#F7F5EF]/50 px-4 py-3 outline-none transition focus:border-[#19A7A0] focus:ring-4 focus:ring-[#19A7A0]/10" /></label><label className="flex flex-col gap-2 text-sm font-bold"><span>{t.email}</span><input required type="email" name="email" className="rounded-xl border border-[#142B3B]/15 bg-[#F7F5EF]/50 px-4 py-3 outline-none transition focus:border-[#19A7A0] focus:ring-4 focus:ring-[#19A7A0]/10" /></label><label className="flex flex-col gap-2 text-sm font-bold"><span>{t.phone}</span><input name="phone" type="tel" className="rounded-xl border border-[#142B3B]/15 bg-[#F7F5EF]/50 px-4 py-3 outline-none transition focus:border-[#19A7A0] focus:ring-4 focus:ring-[#19A7A0]/10" /></label></div><label className="mt-5 flex flex-col gap-2 text-sm font-bold"><span>{t.company}</span><input name="company" className="rounded-xl border border-[#142B3B]/15 bg-[#F7F5EF]/50 px-4 py-3 outline-none transition focus:border-[#19A7A0] focus:ring-4 focus:ring-[#19A7A0]/10" /></label><label className="mt-5 flex flex-col gap-2 text-sm font-bold"><span>{t.message}</span><textarea required name="message" rows={6} className="resize-y rounded-xl border border-[#142B3B]/15 bg-[#F7F5EF]/50 px-4 py-3 outline-none transition focus:border-[#19A7A0] focus:ring-4 focus:ring-[#19A7A0]/10" /></label><div className="mt-6 flex flex-wrap items-center gap-4"><button type="submit" className="inline-flex items-center gap-2 rounded-full bg-[#19A7A0] px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#148c86]">{sent ? <><Check className="size-4" />{t.sent}</> : <>{t.send}<ArrowLeft className="size-4" /></>}</button>{error && <p role="alert" className="text-sm text-red-700">{isAr ? 'لم نتمكن من إرسال الرسالة الآن. تواصل معنا على واتساب.' : 'We could not send your message right now. Please use WhatsApp.'}</p>}</div></form></section>
  </main>
}

export const dynamic = 'force-static'
