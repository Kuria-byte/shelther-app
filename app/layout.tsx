import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { headers } from "next/headers"
import { AuthProvider } from "@/src/lib/auth-provider"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/contexts/user-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Shelther - Your Personal Safety Companion",
  description: "A personal safety app designed to keep you protected",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light">
          <UserProvider>
            <AuthProvider>{children}</AuthProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'