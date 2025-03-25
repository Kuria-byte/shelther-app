"use client"

import { X, User, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface AddContactModalProps {
  onClose: () => void
}

export function AddContactModal({ onClose }: AddContactModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Add Trusted Contact</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[#8A4FFF]/10 flex items-center justify-center relative">
              <User className="h-10 w-10 text-[#8A4FFF]" />
              <Button className="absolute bottom-0 right-0 h-6 w-6 p-0 bg-[#8A4FFF] rounded-full">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Contact name" />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+1 (555) 123-4567" type="tel" />
            </div>

            <div>
              <Label htmlFor="relationship">Relationship</Label>
              <Input id="relationship" placeholder="e.g. Family, Friend" />
            </div>

            <div className="pt-2">
              <h3 className="font-medium mb-3">Permissions</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="location-permission" className="cursor-pointer">
                    Share my location
                  </Label>
                  <Switch id="location-permission" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="calls-permission" className="cursor-pointer">
                    Allow emergency calls
                  </Label>
                  <Switch id="calls-permission" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="messages-permission" className="cursor-pointer">
                    Send emergency messages
                  </Label>
                  <Switch id="messages-permission" defaultChecked />
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-[#8A4FFF] hover:bg-[#8A4FFF]/90">
                Add Contact
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

