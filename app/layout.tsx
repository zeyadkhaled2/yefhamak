import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'يفهمك — مساعد مبيعاتك اللي مش بينام',
  description: 'يفهمك بيرد على عملاءك على واتساب وإنستجرام بالمصري، ياخد الطلبات، ويبعتها لك 24/7.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>
}
