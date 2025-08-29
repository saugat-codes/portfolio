import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Orbitron } from "next/font/google"
import "./globals.css"
import PingInitializer from "../components/ping-initializer"

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
})

export const metadata: Metadata = {
  title: "Saugat Bhattarai | Professional Software Developer",
  description: "Discover Saugat Bhattarai, a skilled software developer specializing in modern web apps, AI-powered solutions, and full-stack development. Explore his portfolio, projects, and blog for insights into cutting-edge technology and innovative software solutions.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${orbitron.variable}`}>
        <PingInitializer />
        {children}
      </body>
    </html>
  )
}
