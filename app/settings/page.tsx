"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  SettingsIcon,
  Bell,
  Moon,
  Sun,
  Smartphone,
  Shield,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Battery,
  Vibrate,
  Volume2,
  Trash2,
  Download,
  HelpCircle,
} from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    // In a real app, we would apply the theme here
  }

  return (
    <PageContainer title="Settings">
      {/* Settings Header */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-teal-400 text-white shadow-lg p-6"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-8 border-white opacity-20"></div>
        </div>

        <div className="relative z-10 flex items-center">
          <div className="p-3 bg-white bg-opacity-20 rounded-full mr-4">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">App Settings</h2>
            <p className="text-white text-opacity-90">Customize your Shelther experience</p>
          </div>
        </div>
      </motion.div>

      {/* Settings Content */}
      <Tabs defaultValue="general" className="mt-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Appearance" />
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="flex items-center justify-center"
                    onClick={() => handleThemeChange("light")}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="flex items-center justify-center"
                    onClick={() => handleThemeChange("dark")}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="flex items-center justify-center"
                    onClick={() => handleThemeChange("system")}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Reduce Motion</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Minimize animations</p>
                  </div>
                </div>
                <Switch id="reduce-motion" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">High Contrast</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Increase visual distinction</p>
                  </div>
                </div>
                <Switch id="high-contrast" />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="text-size">Text Size</Label>
                <Slider id="text-size" defaultValue={[2]} max={4} step={1} className="w-full" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Small</span>
                  <span>Default</span>
                  <span>Large</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Language & Region" />
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select defaultValue="us">
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="eu">European Union</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="units">Measurement Units</Label>
                <Select defaultValue="metric">
                  <SelectTrigger id="units">
                    <SelectValue placeholder="Select units" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (km, kg)</SelectItem>
                    <SelectItem value="imperial">Imperial (mi, lb)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Alert Preferences" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Emergency Alerts</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Critical safety notifications</p>
                  </div>
                </div>
                <Switch id="emergency-alerts" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Safety Check-ins</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reminders to check in</p>
                  </div>
                </div>
                <Switch id="safety-checkins" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Location Alerts</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Notifications about your area</p>
                  </div>
                </div>
                <Switch id="location-alerts" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Contact Activity</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Updates from trusted contacts</p>
                  </div>
                </div>
                <Switch id="contact-activity" defaultChecked />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Notification Settings" />
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="alert-sound">Alert Sound</Label>
                <Select defaultValue="urgent">
                  <SelectTrigger id="alert-sound">
                    <SelectValue placeholder="Select sound" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="calm">Calm</SelectItem>
                    <SelectItem value="subtle">Subtle</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="volume">Volume</Label>
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-gray-500" />
                  <Slider id="volume" defaultValue={[75]} max={100} step={1} className="w-full" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Vibrate className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Vibration</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Haptic feedback for alerts</p>
                  </div>
                </div>
                <Switch id="vibration" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Do Not Disturb Override</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow emergency alerts during DND</p>
                  </div>
                </div>
                <Switch id="dnd-override" defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Privacy Controls" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Location Sharing</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Share location with trusted contacts</p>
                  </div>
                </div>
                <Switch id="location-sharing" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Activity Visibility</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Show your activity to contacts</p>
                  </div>
                </div>
                <Switch id="activity-visibility" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Incognito Mode</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Temporarily pause all sharing</p>
                  </div>
                </div>
                <Switch id="incognito-mode" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <EyeOff className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Anonymous Usage Data</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Help improve the app</p>
                  </div>
                </div>
                <Switch id="usage-data" defaultChecked />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Data Management" />
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Download className="h-5 w-5 text-gray-700 dark:text-gray-300 mr-2" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Download Your Data</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get a copy of all your data</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Trash2 className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Delete Account</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Permanently remove your account</p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all your
                          data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete Account</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Performance" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Battery className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Battery Saver</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reduce background activity</p>
                  </div>
                </div>
                <Switch id="battery-saver" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Background Location</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Track location when app is closed</p>
                  </div>
                </div>
                <Switch id="background-location" defaultChecked />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="location-accuracy">Location Accuracy</Label>
                <Select defaultValue="high">
                  <SelectTrigger id="location-accuracy">
                    <SelectValue placeholder="Select accuracy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High (Battery Intensive)</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="low">Low (Battery Saving)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="data-sync">Data Sync Frequency</Label>
                <Select defaultValue="auto">
                  <SelectTrigger id="data-sync">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="auto">Automatic</SelectItem>
                    <SelectItem value="wifi">Wi-Fi Only</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Troubleshooting" />
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HelpCircle className="h-5 w-5 text-gray-700 dark:text-gray-300 mr-2" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Diagnostic Report</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Generate technical report</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Generate
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Clear Cache</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Free up storage space</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Clear
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Reset App</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Restore default settings</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}

