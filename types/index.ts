import type { Language } from '@/lib/dictionary'

export type Lang = Language
export type Plan = { name: string; price: string; replies: string; surplus: string; features: readonly string[] }
export type Feature = readonly [title: string, description: string, icon: unknown]
export type FaqEntry = readonly [question: string, answer: string]
export type NavLink = { label: string; href: string }
