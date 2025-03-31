"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { UserDataProvider } from "@/contexts/user-data-context"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <UserDataProvider>
        {children}
        <Toaster position="top-right" />
      </UserDataProvider>
    </ThemeProvider>
  )
}

