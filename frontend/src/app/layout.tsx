import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FinancialProvider } from '../context/FinancialContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'onTrack',
  description: 'Your personal financial assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FinancialProvider>
          {children}
        </FinancialProvider>
      </body>
    </html>
  )
} 