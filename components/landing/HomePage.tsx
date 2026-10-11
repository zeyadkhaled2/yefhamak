'use client'

import { useRef } from 'react'
import { useGsapScroll } from '@/hooks/use-gsap-scroll'
import { LanguageProviderWithDocument } from '@/components/layout/LanguageProvider'
import { Navbar, Hero, Problem, Features, HowItWorks, Pricing, Faq, WaitlistCta, Dashboard, WhatsappButton, Footer } from '@/components/sections/section-entrypoints'

function HomeContent() {
  const pageRef = useRef<HTMLElement>(null)
  useGsapScroll(pageRef)
  return <main ref={pageRef} className="marketing-page min-h-screen overflow-hidden bg-[#F7F5EF] text-[#142B3B]">
    <Navbar />
    <Hero />
    <Problem />
    <Features />
    <HowItWorks />
    <Pricing />
    <WaitlistCta />
    <Faq />
    <Dashboard />
    <WhatsappButton />
    <Footer />
  </main>
}

export default function HomePage() {
  return <LanguageProviderWithDocument><HomeContent /></LanguageProviderWithDocument>
}
