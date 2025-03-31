import type React from "react"
import { Header } from "./header"
import { Navbar } from "./navbar"

interface PageContainerProps {
  children: React.ReactNode
  title?: string
}

export function PageContainer({ children, title }: PageContainerProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title={title} />
      <main className="flex-1 px-4 py-6 space-y-6 overflow-y-auto pb-20">{children}</main>
      <Navbar />
    </div>
  )
}

