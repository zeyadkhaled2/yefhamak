'use client'

import { useRef, useState } from 'react'
import { useGsapScroll } from '@/hooks/use-gsap-scroll'
import { LanguageProviderWithDocument, useLanguage } from '@/components/layout/LanguageProvider'
import { DashboardSection, FeaturesSection, FaqSection, HeroSection, HowItWorksSection, PricingSection, ProblemSection, SiteFooter, SiteNav, WaitlistSection, WhatsAppFloat } from '@/components/landing/home-sections'

function HomeContent() {
  const { language, setLanguage, isArabic, copy } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const pageRef = useRef<HTMLElement>(null)
  useGsapScroll(pageRef)
  return <main ref={pageRef} className="marketing-page min-h-screen overflow-hidden bg-[#F7F5EF] text-[#142B3B]">
    <SiteNav lang={language} setLang={setLanguage} isAr={isArabic} t={copy} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    <HeroSection isAr={isArabic} t={copy} />
    <ProblemSection t={copy} />
    <FeaturesSection t={copy} />
    <HowItWorksSection t={copy} />
    <PricingSection isAr={isArabic} t={copy} />
    <WaitlistSection t={copy} submitted={submitted} setSubmitted={setSubmitted} />
    <FaqSection t={copy} />
    <DashboardSection isAr={isArabic} />
    <WhatsAppFloat label={copy.whatsapp} />
    <SiteFooter isAr={isArabic} t={copy} />
  </main>
}

export default function HomePage() {
  return <LanguageProviderWithDocument><HomeContent /></LanguageProviderWithDocument>
}
