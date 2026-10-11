'use client'

import { createContext, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import type { Language } from '@/lib/dictionary'
import { copy } from '@/lib/dictionary'

type LanguageContextValue = { language: Language; setLanguage: Dispatch<SetStateAction<Language>>; toggleLanguage: () => void; isArabic: boolean; copy: (typeof copy)[Language] }

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar')
  const value = useMemo(() => ({ language, setLanguage, toggleLanguage: () => setLanguage((current) => current === 'ar' ? 'en' : 'ar'), isArabic: language === 'ar', copy: copy[language] }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}

export type { LanguageContextValue }

export function LanguageDocument({ children }: { children: ReactNode }) {
  const { language } = useLanguage()
  return <div lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'}>{children}</div>
}

export const LanguageProviderWithDocument = ({ children }: { children: ReactNode }) => <LanguageProvider><LanguageDocument>{children}</LanguageDocument></LanguageProvider>
