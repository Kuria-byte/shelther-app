"use client"

import { Home, Users, Map, BookOpen, Bell } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

interface BottomNavigationProps {
  activeTab?: "Home" | "Circle" | "Map" | "Learn" | "Alerts"
}

export function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const pathname = usePathname()

  // Determine active tab based on pathname if not explicitly provided
  const currentTab =
    activeTab ||
    (pathname === "/"
      ? "Home"
      : pathname.includes("/circle")
        ? "Circle"
        : pathname.includes("/map")
          ? "Map"
          : pathname.includes("/learn")
            ? "Learn"
            : pathname.includes("/alerts")
              ? "Alerts"
              : "Home")

  const navItems = [
    { icon: Home, label: "Home", active: currentTab === "Home", href: "/" },
    { icon: Users, label: "Circle", active: currentTab === "Circle", href: "/circle" },
    { icon: Map, label: "Map", active: currentTab === "Map", href: "/map" },
    { icon: BookOpen, label: "Learn", active: currentTab === "Learn", href: "/learn" },
    { icon: Bell, label: "Alerts", active: currentTab === "Alerts", href: "/alerts" },
  ]

  return (
    <div className="fixed bottom-4 left-4 right-4 z-10">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="flex justify-around items-center h-16">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full relative"
            >
              <div className="relative">
                {item.active && (
                  <motion.div
                    className="absolute -inset-1 rounded-full bg-[#8A4FFF]/10"
                    layoutId="navHighlight"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon
                  className={`w-6 h-6 ${item.active ? "text-[#8A4FFF]" : "text-gray-500 dark:text-gray-400"}`}
                />
              </div>
              <span
                className={`text-xs mt-1 ${
                  item.active ? "text-[#8A4FFF] font-medium" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

