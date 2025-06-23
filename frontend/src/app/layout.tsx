import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FinancialProvider } from '../context/FinancialContext'
import { AuthProvider } from '../context/AuthContext'
// import Header from '../components/Header' // Remove header
import Sidebar from '../components/sidebar'
import { StagewiseToolbar } from "@stagewise/toolbar-next";
import { ReactPlugin } from "@stagewise-plugins/react";

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
        <AuthProvider>
          <FinancialProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1">{children}</main>
            </div>
          </FinancialProvider>
        </AuthProvider>
        <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
      </body>
    </html>
  )
}

