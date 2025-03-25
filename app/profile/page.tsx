"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, User, Mail, Phone, MapPin, Save } from "lucide-react"

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSave = () => {
    setProfile(formData)
    setIsEditing(false)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Profile" />

      <div className="flex-1 overflow-auto p-4 pb-20">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
              <AvatarFallback className="bg-[#8A4FFF]/10 text-[#8A4FFF] text-2xl">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#8A4FFF]">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <h1 className="text-2xl font-bold dark:text-white">{profile.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">Member since June 2023</p>
        </div>

        <Card className="mb-6 border-none shadow-sm dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold dark:text-white">Personal Information</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium dark:text-gray-300">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium dark:text-gray-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium dark:text-gray-300">
                    Phone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium dark:text-gray-300">
                    Address
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full bg-[#8A4FFF] hover:bg-[#8A4FFF]/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                    <p className="font-medium dark:text-white">{profile.name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium dark:text-white">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium dark:text-white">{profile.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="font-medium dark:text-white">{profile.address}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm dark:bg-gray-800">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Safety Statistics</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Emergency Activations</p>
                <p className="text-2xl font-bold text-[#8A4FFF]">0</p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Check-ins</p>
                <p className="text-2xl font-bold text-[#40E0D0]">12</p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Safe Routes</p>
                <p className="text-2xl font-bold text-[#36D986]">8</p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Alerts Received</p>
                <p className="text-2xl font-bold text-[#FF9D4D]">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  )
}

