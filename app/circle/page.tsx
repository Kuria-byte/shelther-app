"use client"

import { useState } from "react"
import { Plus, Search, User, Phone, MessageSquare, MapPin, MoreVertical, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { BottomNavigation } from "@/components/bottom-navigation"
import { AddContactModal } from "@/components/add-contact-modal"

export default function CirclePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const contacts = [
    {
      id: 1,
      name: "Mom",
      phone: "+254 (722) 123-670",
      photo: null,
      permissions: {
        location: true,
        calls: true,
        messages: true,
      },
    },
    {
      id: 2,
      name: "Sister",
      phone: "+254 (740) 987-437",
      photo: null,
      permissions: {
        location: true,
        calls: true,
        messages: true,
      },
    },
    {
      id: 3,
      name: "Best Friend",
      phone: "+254 (701) 456-890",
      photo: null,
      permissions: {
        location: false,
        calls: true,
        messages: true,
      },
    },
  ]

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold flex-1 text-center mr-8">Circle of 3</h1>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search contacts..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Your Trusted Contacts</h2>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-[#8A4FFF] hover:bg-[#8A4FFF]/90 rounded-full h-8 w-8 p-0"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-3 mb-20">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#8A4FFF]/10 flex items-center justify-center mr-3">
                    <User className="h-6 w-6 text-[#8A4FFF]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{contact.name}</h3>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>

                <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-2">
                  <div className="flex items-center">
                    <Switch id={`location-${contact.id}`} checked={contact.permissions.location} className="mr-2" />
                    <Label htmlFor={`location-${contact.id}`} className="text-xs flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      Location
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Switch id={`calls-${contact.id}`} checked={contact.permissions.calls} className="mr-2" />
                    <Label htmlFor={`calls-${contact.id}`} className="text-xs flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      Calls
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Switch id={`messages-${contact.id}`} checked={contact.permissions.messages} className="mr-2" />
                    <Label htmlFor={`messages-${contact.id}`} className="text-xs flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Messages
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <BottomNavigation activeTab="Circle" />

      {showAddModal && <AddContactModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}

