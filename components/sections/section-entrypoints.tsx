'use client'

import { useState } from 'react'
import { useLanguage } from '@/components/layout/LanguageProvider'
import { DashboardSection, FeaturesSection, FaqSection, HeroSection, HowItWorksSection, PricingSection, ProblemSection, SiteFooter, SiteNav, WaitlistSection, WhatsAppFloat } from '@/components/landing/home-sections'

export function Navbar() {
  const { language, setLanguage, isArabic, copy } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  return <SiteNav lang={language} setLang={setLanguage} isAr={isArabic} t={copy} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
}
export function Hero() { const { isArabic, copy } = useLanguage(); return <HeroSection isAr={isArabic} t={copy} /> }
export function Problem() { const { copy } = useLanguage(); return <ProblemSection t={copy} /> }
export function Features() { const { copy } = useLanguage(); return <FeaturesSection t={copy} /> }
export function HowItWorks() { const { copy } = useLanguage(); return <HowItWorksSection t={copy} /> }
export function Pricing() { const { isArabic, copy } = useLanguage(); return <PricingSection isAr={isArabic} t={copy} /> }
export function Faq() { const { copy } = useLanguage(); return <FaqSection t={copy} /> }
export function Contact() { return null }
export function WaitlistCta() { const { copy } = useLanguage(); const [submitted, setSubmitted] = useState(false); return <WaitlistSection t={copy} submitted={submitted} setSubmitted={setSubmitted} /> }
export function Dashboard() { const { isArabic } = useLanguage(); return <DashboardSection isAr={isArabic} /> }
export function WhatsappButton() { const { copy } = useLanguage(); return <WhatsAppFloat label={copy.whatsapp} /> }
export function Footer() { const { isArabic, copy } = useLanguage(); return <SiteFooter isAr={isArabic} t={copy} /> }
