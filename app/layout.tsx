import type { Metadata } from 'next'
import './globals.css'
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#F7F5EF',
}

export const metadata: Metadata = {
  title: 'يفهمك — مساعد مبيعاتك اللي مش بينام',
  description: 'يفهمك مساعد مبيعاتك على واتساب بالمصري، بيرد على العملاء، وياخد الطلبات 24/7.',
  icons: {
    icon: '/yefhamak-logo.png',
    apple: '/yefhamak-logo.png',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>
}
