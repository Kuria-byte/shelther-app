"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Navigation, Search, Shield, Clock, ChevronRight } from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/ui/section-header"

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const safeLocations = [
    {
      id: 1,
      name: "Police Station",
      distance: "0.3 miles",
      address: "123 Safety St, Seattle",
      rating: "Very Safe",
      icon: Shield,
    },
    {
      id: 2,
      name: "Downtown Library",
      distance: "0.5 miles",
      address: "456 Knowledge Ave, Seattle",
      rating: "Safe",
      icon: MapPin,
    },
    {
      id: 3,
      name: "Central Hospital",
      distance: "0.8 miles",
      address: "789 Health Blvd, Seattle",
      rating: "Very Safe",
      icon: Shield,
    },
  ]

  const recentRoutes = [
    {
      id: 1,
      from: "Home",
      to: "Work",
      time: "25 min",
      date: "Today",
    },
    {
      id: 2,
      from: "Work",
      to: "Gym",
      time: "15 min",
      date: "Yesterday",
    },
  ]

  return (
    <PageContainer title="Safe Map">
      {/* Map Placeholder */}
      <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400">Map View</span>
        </div>

        {/* Search Bar */}
        <div className="absolute top-4 left-4 right-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for safe locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Current Location Button */}
        <div className="absolute bottom-4 right-4">
          <button className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-md">
            <Navigation className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </button>
        </div>
      </div>

      {/* Safe Locations Nearby */}
      <div>
        <SectionHeader title="Safe Locations Nearby" />
        <div className="space-y-3">
          {safeLocations.map((location) => (
            <motion.div
              key={location.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex">
                <div className="mr-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                    <location.icon className="h-5 w-5 text-teal-500 dark:text-teal-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-base font-medium text-gray-800 dark:text-white">{location.name}</h4>
                    <span className="text-sm text-teal-600 dark:text-teal-400">{location.distance}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{location.address}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full">
                      {location.rating}
                    </span>
                    <button className="text-xs text-purple-600 dark:text-purple-400 flex items-center">
                      Directions
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Routes */}
      <div>
        <SectionHeader title="Recent Routes" />
        <div className="space-y-3">
          {recentRoutes.map((route) => (
            <motion.div
              key={route.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex">
                <div className="mr-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-base font-medium text-gray-800 dark:text-white">
                      {route.from} to {route.to}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{route.date}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{route.time}</span>
                    <button className="text-xs text-purple-600 dark:text-purple-400 flex items-center">
                      Use Again
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}

