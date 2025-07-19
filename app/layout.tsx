import type { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"
import { AethonFloatingAssistant } from "@/components/aethon-floating-assistant"
import './globals.css'

export const metadata: Metadata = {
  title: 'The Research Hub - AI-Powered Research Platform',
  description: 'Advanced research collaboration platform with AI assistance, project management, and academic tools.',
  keywords: 'research, AI, collaboration, academic, papers, citations, methodology',
  authors: [{ name: 'The Research Hub Team' }],
  creator: 'The Research Hub',
  publisher: 'The Research Hub',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://researchhub.ai',
    title: 'The Research Hub - AI-Powered Research Platform',
    description: 'Advanced research collaboration platform with AI assistance',
    siteName: 'The Research Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Research Hub - AI-Powered Research Platform',
    description: 'Advanced research collaboration platform with AI assistance',
    creator: '@researchhub',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <script src="https://accounts.google.com/gsi/client" async defer />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <AethonFloatingAssistant />
        <Toaster />
      </body>
    </html>
  )
}
