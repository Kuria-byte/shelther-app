"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface UserContextType {
  user: UserProfile | null
  isLoading: boolean
  updateUser: (data: Partial<UserProfile>) => void
  setMoodStatus: (status: MoodStatus) => void
}

export type MoodStatus = "safe" | "cautious" | "unsafe"

export interface UserProfile {
  name: string
  email: string
  phone: string
  address?: string
  safeDays: number
  nearbyFriends: number
  recentCheckIns: RecentActivity[]
  moodStatus: MoodStatus
  joinedDate: string
}

export interface RecentActivity {
  id: string
  type: "check-in" | "journey" | "alert"
  description: string
  timestamp: string
  location?: string
}

const defaultUser: UserProfile = {
  name: "Sandra",
  email: "sandra@gmail.com",
  phone: "+254 (766) 123-457",
  safeDays: 24,
  nearbyFriends: 3,
  moodStatus: "safe",
  joinedDate: "2024-09-15",
  recentCheckIns: [
    {
      id: "1",
      type: "check-in",
      description: "Checked in as safe",
      timestamp: "2023-11-20T18:30:00",
      location: "Home",
    },
    {
      id: "2",
      type: "journey",
      description: "Completed journey safely",
      timestamp: "2023-11-19T22:15:00",
      location: "From Work to Home",
    },
    {
      id: "3",
      type: "alert",
      description: "Received safety alert",
      timestamp: "2023-11-18T14:45:00",
      location: "Downtown",
    },
  ],
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch user data from an API
    // For now, we'll simulate loading the default user
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem("userData")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        } else {
          setUser(defaultUser)
          localStorage.setItem("userData", JSON.stringify(defaultUser))
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        setUser(defaultUser)
      } finally {
        setIsLoading(false)
      }
    }

    // Simulate API delay
    setTimeout(loadUser, 500)
  }, [])

  const updateUser = (data: Partial<UserProfile>) => {
    if (!user) return

    const updatedUser = { ...user, ...data }
    setUser(updatedUser)

    try {
      localStorage.setItem("userData", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Error saving user data:", error)
    }
  }

  const setMoodStatus = (status: MoodStatus) => {
    updateUser({ moodStatus: status })
  }

  return <UserContext.Provider value={{ user, isLoading, updateUser, setMoodStatus }}>{children}</UserContext.Provider>
}

