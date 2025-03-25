"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { motion } from "framer-motion"

interface HeaderProps {
  title?: string
}

export function Header({ title = "Shelther" }: HeaderProps) {
  return (
    <motion.div
      className="flex items-center p-4 border-b dark:border-gray-800"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1 flex justify-center items-center relative">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#8A4FFF] to-[#40E0D0] text-transparent bg-clip-text">
          {title}
        </h1>
        <div className="absolute right-0 flex items-center space-x-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative rounded-full w-9 h-9">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#FF5A5A]"></span>
          </Button>
          <ProfileDropdown />
        </div>
      </div>
    </motion.div>
  )
}

