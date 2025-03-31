"use client"
import { Menu, Bell, User, Settings, HelpCircle, LogOut } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  title?: string
}

export function Header({ title = "Shelther" }: HeaderProps) {
  return (
    <header className="px-4 py-3 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Menu className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-teal-400 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/alerts"
            className="rounded-full p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Bell className="h-5 w-5" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-teal-400 flex items-center justify-center text-white font-medium outline-none">
                S
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile" className="w-full">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings" className="w-full">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/help" className="w-full">
                <DropdownMenuItem className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href="/auth/logout" className="w-full">
                <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

