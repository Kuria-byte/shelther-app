"use client"

import { useState } from "react"
import { Search, Layers, AlertTriangle, Shield, Navigation, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomNavigation } from "@/components/bottom-navigation"
import { SafetyAlert } from "@/components/safety-alert"

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const safetyAlerts = [
    {
      id: 1,
      type: "caution",
      title: "High Crime Area",
      description: "Recent incidents reported in this area",
      distance: "0.5 miles away",
    },
    {
      id: 2,
      type: "danger",
      title: "Active Incident",
      description: "Police activity reported",
      distance: "1.2 miles away",
    },
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold flex-1 text-center mr-8">Safety Map</h1>
      </div>

      <div className="relative">
        {/* Map placeholder */}
        <div className="h-[calc(100vh-8rem)] bg-gray-200 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Navigation className="h-8 w-8 text-gray-400" />
            <span className="ml-2 text-gray-500">Map View</span>
          </div>

          {/* Map controls */}
          <div className="absolute top-4 left-4 right-4">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for a location..."
                className="pl-10 pr-10 bg-white shadow-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-[#8A4FFF]">
                <Navigation className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="safe-routes">
              <TabsList className="bg-white w-full">
                <TabsTrigger value="safe-routes" className="flex-1">
                  <Shield className="h-4 w-4 mr-1" />
                  Safe Routes
                </TabsTrigger>
                <TabsTrigger value="alerts" className="flex-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Alerts
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Layer control */}
          <Button className="absolute bottom-4 right-4 bg-white text-gray-700 shadow-md">
            <Layers className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Safety alerts panel */}
      <Card className="absolute bottom-16 left-4 right-4 border-none shadow-lg rounded-t-xl">
        <CardContent className="p-4">
          <h2 className="text-lg font-medium mb-3">Nearby Alerts</h2>
          <div className="space-y-3">
            {safetyAlerts.map((alert) => (
              <SafetyAlert
                key={alert.id}
                type={alert.type}
                title={alert.title}
                description={alert.description}
                distance={alert.distance}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <BottomNavigation activeTab="Map" />
    </div>
  )
}

