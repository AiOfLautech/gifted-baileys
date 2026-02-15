import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WhatsApp Bot Platform - Create & Manage WhatsApp Bots',
  description:
    'Build, deploy, and manage WhatsApp bots without coding. Connect to WhatsApp instantly with our powerful bot platform.',
  keywords: ['WhatsApp', 'Bot', 'Automation', 'Chatbot', 'WhatsApp API'],
  authors: [{ name: 'WhatsBot Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://whatsbotplatform.com',
    title: 'WhatsApp Bot Platform',
    description: 'Create and manage WhatsApp bots easily',
    siteName: 'WhatsBot',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
  colorScheme: 'dark light',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} ${geistMono.className} bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}
