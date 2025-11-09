import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/lib/hooks/useAuth'
import { CanvasSettingsProvider } from '@/lib/hooks/useCanvasSettings'
import DeployBanner from '../components/deploy-banner'
import './globals.css'

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Wynter.AI',
  description: 'The simplest way to use v0 - just prompt and see your app',
  openGraph: {
    title: 'Wynter.AI',
    description: 'The simplest way to use v0 - just prompt and see your app',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wynter.AI',
    description: 'The simplest way to use v0 - just prompt and see your app',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${openSans.variable} antialiased font-sans`}
        style={{ fontFamily: 'var(--font-open-sans)' }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
          <AuthProvider>
            <CanvasSettingsProvider>{children}</CanvasSettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
