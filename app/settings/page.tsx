"use client"

import { useState } from "react"
import {
  Bell,
  Smartphone,
  Users,
  Lock,
  HelpCircle,
  ChevronRight,
  ArrowLeft,
  Vibrate,
  Volume2,
  Fingerprint,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export default function SettingsPage() {
  const [shakeIntensity, setShakeIntensity] = useState(70)

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold flex-1 text-center mr-8">Settings</h1>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-6">
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <h2 className="text-lg font-medium flex items-center mb-3">
                <Smartphone className="h-5 w-5 mr-2 text-[#8A4FFF]" />
                Emergency Triggers
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="shake-trigger" className="font-medium">
                      Shake to Activate
                    </Label>
                    <p className="text-sm text-gray-500">Shake your phone to trigger emergency mode</p>
                  </div>
                  <Switch id="shake-trigger" defaultChecked />
                </div>

                <div className="pl-0">
                  <div className="flex justify-between mb-1">
                    <Label className="text-sm text-gray-500">Shake Sensitivity</Label>
                    <span className="text-sm text-gray-500">{shakeIntensity}%</span>
                  </div>
                  <Slider
                    defaultValue={[shakeIntensity]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setShakeIntensity(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Less Sensitive</span>
                    <span>More Sensitive</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="button-trigger" className="font-medium">
                      Power Button Trigger
                    </Label>
                    <p className="text-sm text-gray-500">Press power button 5 times rapidly</p>
                  </div>
                  <Switch id="button-trigger" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="widget-trigger" className="font-medium">
                      Widget Trigger
                    </Label>
                    <p className="text-sm text-gray-500">Enable home screen widget</p>
                  </div>
                  <Switch id="widget-trigger" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <h2 className="text-lg font-medium flex items-center mb-3">
                <Bell className="h-5 w-5 mr-2 text-[#8A4FFF]" />
                Notifications
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="safety-alerts" className="font-medium">
                      Safety Alerts
                    </Label>
                    <p className="text-sm text-gray-500">Notifications about dangerous areas</p>
                  </div>
                  <Switch id="safety-alerts" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="contact-updates" className="font-medium">
                      Contact Updates
                    </Label>
                    <p className="text-sm text-gray-500">When contacts change their status</p>
                  </div>
                  <Switch id="contact-updates" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Vibrate className="h-5 w-5 mr-2 text-gray-500" />
                    <Label htmlFor="vibration" className="font-medium">
                      Vibration
                    </Label>
                  </div>
                  <Switch id="vibration" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Volume2 className="h-5 w-5 mr-2 text-gray-500" />
                    <Label htmlFor="sound" className="font-medium">
                      Sound
                    </Label>
                  </div>
                  <Switch id="sound" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-[#8A4FFF]" />
                <span>Manage Circle of 3</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Button>

            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-[#8A4FFF]" />
                <span>Privacy & Security</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Button>

            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <Fingerprint className="h-5 w-5 mr-2 text-[#8A4FFF]" />
                <span>Change PIN & Biometrics</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Button>

            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-[#8A4FFF]" />
                <span>Help & Support</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Button>
          </div>

          <div className="text-center">
            <Button variant="link" className="text-[#FF5A5A]">
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

