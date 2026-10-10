'use client'

import { useRef, useState } from 'react'
import type { Language } from '@/lib/dictionary'
import { copy } from '@/lib/dictionary'
import { useGsapScroll } from '@/hooks/use-gsap-scroll'
import { DashboardSection, FeaturesSection, FaqSection, HeroSection, HowItWorksSection, PricingSection, ProblemSection, SiteFooter, SiteNav, WaitlistSection, WhatsAppFloat } from './home-sections'

export default function Home() {
  const pageRef = useRef<HTMLElement>(null)
  const [lang, setLang] = useState<Language>('ar')
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const t = copy[lang]
  const isAr = lang === 'ar'
  useGsapScroll(pageRef)

  return <main ref={pageRef} dir={isAr ? 'rtl' : 'ltr'} className="marketing-page min-h-screen overflow-hidden bg-[#F7F5EF] text-[#142B3B]">
    <SiteNav lang={lang} setLang={setLang} isAr={isAr} t={t} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    <HeroSection isAr={isAr} t={t} />
    <ProblemSection t={t} />
    <FeaturesSection t={t} />
    <HowItWorksSection t={t} />
    <PricingSection isAr={isAr} t={t} />
    <WaitlistSection t={t} submitted={submitted} setSubmitted={setSubmitted} />
    <FaqSection t={t} />
    <DashboardSection isAr={isAr} />
    <WhatsAppFloat label={t.whatsapp} />
    <SiteFooter isAr={isAr} t={t} />
  </main>
}

export const dynamic = 'force-static'
