import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jain Shree Motors - Quality Used Cars',
  description: 'Browse our collection of quality used cars at Jain Shree Motors',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}