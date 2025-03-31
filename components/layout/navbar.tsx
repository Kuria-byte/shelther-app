"use client"

import { Shield, Users, MapPin, Bell, BookOpen } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Shield,
    },
    {
      name: "Circle",
      href: "/circle",
      icon: Users,
    },
    {
      name: "Map",
      href: "/map",
      icon: MapPin,
    },
    {
      name: "Learn",
      href: "/learn",
      icon: BookOpen,
    },
    {
      name: "Alerts",
      href: "/alerts",
      icon: Bell,
    },
  ]

  return (
    <div className="fixed bottom-0 inset-x-0 z-10 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-2">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center py-2 px-3">
              <div
                className={cn(
                  "p-1 rounded-full",
                  isActive
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
                    : "text-gray-500 dark:text-gray-400",
                )}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <span className={cn("text-xs mt-1", isActive ? "font-medium text-purple-600 dark:text-purple-400" : "")}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

