"use client"
import { Bell, AlertTriangle, AlertOctagon, Clock, MapPin, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function AlertsPage() {
  const activeAlerts = [
    {
      id: 1,
      type: "danger",
      title: "Active Incident",
      description: "Police activity reported near your location",
      time: "Just now",
      location: "0.5 miles away",
    },
    {
      id: 2,
      type: "caution",
      title: "High Crime Area",
      description: "You're entering an area with recent incidents",
      time: "5 min ago",
      location: "Approaching your route",
    },
  ]

  const historyAlerts = [
    {
      id: 3,
      type: "caution",
      title: "Suspicious Activity",
      description: "Community reports of suspicious behavior",
      time: "Yesterday, 8:30 PM",
      location: "Near Home",
    },
    {
      id: 4,
      type: "safe",
      title: "Area Now Safe",
      description: "Police have cleared the reported incident",
      time: "Yesterday, 3:15 PM",
      location: "Downtown",
    },
    {
      id: 5,
      type: "danger",
      title: "Emergency Response",
      description: "Fire department activity in the area",
      time: "2 days ago",
      location: "Main Street",
    },
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold flex-1 text-center mr-8">Safety Alerts</h1>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-20">
        <Tabs defaultValue="active">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="active" className="flex-1">
              <AlertOctagon className="h-4 w-4 mr-2" />
              Active Alerts
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              <Clock className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-0">
            {activeAlerts.length > 0 ? (
              <div className="space-y-3">
                {activeAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500">No Active Alerts</h3>
                <p className="text-gray-400">You're in a safe area right now</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <div className="space-y-3">
              {historyAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation activeTab="Alerts" />
    </div>
  )
}

interface Alert {
  id: number
  type: "safe" | "caution" | "danger"
  title: string
  description: string
  time: string
  location: string
}

function AlertCard({ alert }: { alert: Alert }) {
  const getAlertConfig = (type: "safe" | "caution" | "danger") => {
    switch (type) {
      case "safe":
        return {
          icon: Bell,
          color: "bg-[#36D986]",
          textColor: "text-[#36D986]",
        }
      case "caution":
        return {
          icon: AlertTriangle,
          color: "bg-[#FF9D4D]",
          textColor: "text-[#FF9D4D]",
        }
      case "danger":
        return {
          icon: AlertOctagon,
          color: "bg-[#FF5A5A]",
          textColor: "text-[#FF5A5A]",
        }
    }
  }

  const config = getAlertConfig(alert.type)

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className={`${config.color} w-10 h-10 rounded-full flex items-center justify-center mr-3 mt-1 shrink-0`}>
            <config.icon className="text-white w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className={`font-medium ${config.textColor}`}>{alert.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span className="mr-3">{alert.time}</span>
              <MapPin className="h-3 w-3 mr-1" />
              <span>{alert.location}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

