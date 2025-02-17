import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Compliance Helper',
  description: 'interactive compliance helper',
  generator: 'none',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
