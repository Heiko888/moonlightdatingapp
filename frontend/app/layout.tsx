import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'
import { ThemeProvider } from '@/components/ThemeProvider'
import { NotificationProvider } from '@/components/NotificationService'

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
        <ThemeProvider>
          <NotificationProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
