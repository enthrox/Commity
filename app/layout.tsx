import type React from "react"
import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Providers } from "./providers"

const outfit = Outfit({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Commity - GitHub-Powered Blog CMS",
  description: "Publish blogs to your website in seconds with GitHub integration",
  generator: 'v0.dev',
  icons: {
    icon: [
      {
        url: '/logo.png',
        type: 'image/png',
      }
    ],
    apple: [
      {
        url: '/logo.png',
        type: 'image/png',
      }
    ],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Providers>
          <Navigation />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
