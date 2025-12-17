import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google'

// ใช้ Font Inter (มาตรฐาน Modern UI)
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'bl1nk console',
  description: 'Enterprise Webhook Management',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}}