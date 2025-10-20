import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientProviders from '@/app/components/ClientProviders'
import ThemeToggleButton from '@/app/components/ThemeToggleButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Human Design App',
  description: 'Entdecke dein Human Design und lebe authentisch',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <ClientProviders>
          <div style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 1000 }}>
            <ThemeToggleButton />
          </div>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
