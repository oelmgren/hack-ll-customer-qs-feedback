import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Listen Labs - Customer Interview Feedback',
  description: 'Get instant feedback on your discussion guides. Ensure every customer conversation delivers valuable insights.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/assets/icons/favicon.png', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/assets/icons/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
} 