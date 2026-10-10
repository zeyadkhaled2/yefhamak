'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Mail, MessageCircle } from 'lucide-react'
import { ContactForm } from '@/components/ContactForm'
import { contactCopy, type ContactLanguage } from '@/lib/copy'

export default function ContactPage() {
  const [language, setLanguage] = useState<ContactLanguage>('ar')
  const t = contactCopy[language]
  const isArabic = language === 'ar'
  const Arrow = isArabic ? ArrowRight : ArrowLeft

  return <main dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F5EF] text-[#142B3B]">
    <nav className="border-b border-[#142B3B]/10 bg-[#F7F5EF]/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-bold"><img src="/yefhamak-logo.png" alt="Yefhamak" className="size-11 rounded-xl object-cover" /><span className="text-xl">{isArabic ? 'يفهمك' : 'Yefhamak'}</span></Link>
        <div className="flex items-center gap-3"><Link href="/" className="hidden items-center gap-2 text-sm font-bold text-[#142B3B]/70 transition hover:text-[#19A7A0] sm:flex"><Arrow className="size-4" />{t.navBack}</Link><button type="button" onClick={() => setLanguage(isArabic ? 'en' : 'ar')} className="rounded-full border border-[#142B3B]/15 px-3 py-2 text-xs font-bold transition hover:border-[#19A7A0]">{isArabic ? 'EN' : 'AR'}</button></div>
      </div>
    </nav>
    <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:py-20 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 lg:px-8 lg:py-28">
      <div className="lg:pt-8"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#19A7A0]">{t.eyebrow}</p><h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl">{t.title}</h1><p className="mt-6 max-w-lg text-lg leading-8 text-[#142B3B]/70">{t.intro}</p><div className="mt-10 flex flex-col gap-4 text-sm font-semibold"><a className="flex items-center gap-3 transition hover:text-[#19A7A0]" href={`mailto:${t.email}`}><span className="flex size-10 items-center justify-center rounded-full bg-[#19A7A0]/10 text-[#19A7A0]"><Mail className="size-5" /></span>{t.email}</a><a className="flex items-center gap-3 transition hover:text-[#19A7A0]" href="https://wa.me/201030447979" target="_blank" rel="noreferrer"><span className="flex size-10 items-center justify-center rounded-full bg-[#19A7A0]/10 text-[#19A7A0]"><MessageCircle className="size-5" /></span>{t.whatsapp}</a></div></div>
      <ContactForm language={language} />
    </section>
  </main>
}

export const dynamic = 'force-static'
