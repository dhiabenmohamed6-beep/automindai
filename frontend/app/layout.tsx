import type { Metadata } from 'next'
import { Inter, Space_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--body', weight: ['400', '500', '600', '700'] })
const space = Space_Grotesk({ subsets: ['latin'], variable: '--display', weight: ['500', '600', '700'] })
const ibm = IBM_Plex_Mono({ subsets: ['latin'], variable: '--mono', weight: ['400', '500', '600'] })

export const metadata: Metadata = {
  title: 'AutoMindAi — Where Automation Meets Intelligence',
  description: 'AutoMindAi builds AI automation, agents, chatbots, websites, software and industrial automation systems for businesses across Tunisia and beyond.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${space.variable} ${ibm.variable}`}>
        {children}
      </body>
    </html>
  )
}
