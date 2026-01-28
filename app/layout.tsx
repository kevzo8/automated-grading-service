import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist-sans"
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono"
})

export const metadata: Metadata = {
  title: 'AutoGrade MVP | Short-Answer Grading Service',
  description: 'Automated Short-Answer Grading Service MVP - Interview Presentation for Cambridge University Press & Assessment',
  icons: {
    icon: [
      {
        url: '/cambridge_logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/cambridge_logo.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/cambridge_logo.png',
        type: 'image/png',
      },
    ],
    apple: '/cambridge_logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
