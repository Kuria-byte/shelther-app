"use client"

import { motion } from "framer-motion"
import { Bell, AlertTriangle, MapPin, Users, Info, Settings } from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/ui/section-header"

export default function AlertsPage() {
  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "Increased Activity Reported",
      description: "There have been reports of suspicious activity in your area",
      location: "Downtown, Seattle",
      time: "2 hours ago",
      icon: AlertTriangle,
      color: "yellow",
    },
    {
      id: 2,
      type: "info",
      title: "Safety Event Nearby",
      description: "Community safety workshop happening this weekend",
      location: "Central Park, Seattle",
      time: "1 day ago",
      icon: Info,
      color: "blue",
    },
    {
      id: 3,
      type: "contact",
      title: "Emma Johnson Checked In",
      description: "Your contact has marked themselves safe",
      location: "Home",
      time: "3 days ago",
      icon: Users,
      color: "green",
    },
  ]

  const alertSettings = [
    {
      id: "location",
      title: "Location Alerts",
      description: "Receive alerts about safety in your area",
      enabled: true,
    },
    {
      id: "contacts",
      title: "Contact Alerts",
      description: "Get notified when contacts check in or need help",
      enabled: true,
    },
    {
      id: "news",
      title: "Safety News",
      description: "Updates about safety events and workshops",
      enabled: false,
    },
  ]

  return (
    <PageContainer title="Alerts & Notifications">
      {/* Alert Status */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-teal-400 text-white shadow-lg"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-8 border-white opacity-20"></div>
        </div>

        <div className="relative p-5 z-10">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-full mr-3">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Alerts Active</h3>
              <p className="text-sm text-white text-opacity-90">You'll be notified of safety concerns</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">Current Location: Seattle</span>
            </div>
            <button className="py-1.5 px-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors text-sm">
              Update
            </button>
          </div>
        </div>
      </motion.div>

      {/* Recent Alerts */}
      <div>
        <SectionHeader title="Recent Alerts" />
        <div className="space-y-3">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex">
                <div className="mr-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-${alert.color}-100 dark:bg-${alert.color}-900 flex items-center justify-center`}
                  >
                    <alert.icon className={`h-5 w-5 text-${alert.color}-500 dark:text-${alert.color}-400`} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-base font-medium text-gray-800 dark:text-white">{alert.title}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{alert.description}</p>
                  <div className="flex items-center mt-2">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{alert.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Alert Settings */}
      <div>
        <SectionHeader
          title="Alert Settings"
          action={
            <button className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Settings className="h-4 w-4" />
            </button>
          }
        />
        <div className="space-y-3">
          {alertSettings.map((setting) => (
            <motion.div
              key={setting.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-800 dark:text-white">{setting.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{setting.description}</p>
                </div>
                <div className="relative inline-block w-12 h-6 align-middle select-none">
                  <input
                    type="checkbox"
                    id={`toggle-${setting.id}`}
                    className="sr-only"
                    defaultChecked={setting.enabled}
                  />
                  <label
                    htmlFor={`toggle-${setting.id}`}
                    className={`block w-full h-full rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
                      setting.enabled ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 shadow transform transition-transform duration-300 ${
                        setting.enabled ? "translate-x-6" : ""
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}

