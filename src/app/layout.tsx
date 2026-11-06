import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'LORN.LOL — Your Digital Identity',
    template: '%s | LORN.LOL',
  },
  description: 'Create your unique digital identity with LORN.LOL. Customizable profiles, animated backgrounds, music, widgets, and more.',
  keywords: ['profile', 'social', 'identity', 'links', 'bio', 'customization', 'animated'],
  authors: [{ name: 'LORN.LOL' }],
  creator: 'LORN.LOL',
  publisher: 'LORN.LOL',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lorn.lol',
    siteName: 'LORN.LOL',
    title: 'LORN.LOL — Your Digital Identity',
    description: 'Create your unique digital identity with LORN.LOL',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LORN.LOL',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LORN.LOL — Your Digital Identity',
    description: 'Create your unique digital identity with LORN.LOL',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.discordapp.com" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}