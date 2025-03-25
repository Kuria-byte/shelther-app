"use client"

import { Search, BookOpen, Video, FileText, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function LearnPage() {
  const featuredContent = [
    {
      id: 1,
      title: "Personal Safety Basics",
      type: "guide",
      icon: FileText,
      color: "#8A4FFF",
    },
    {
      id: 2,
      title: "Self-Defense Techniques",
      type: "video",
      icon: Video,
      color: "#40E0D0",
    },
    {
      id: 3,
      title: "Safety While Traveling",
      type: "guide",
      icon: FileText,
      color: "#FF9D4D",
    },
  ]

  const safetyTips = [
    {
      id: 1,
      title: "Trust your instincts",
      description: "If something feels wrong, it probably is. Don't ignore your gut feelings.",
    },
    {
      id: 2,
      title: "Stay aware of surroundings",
      description: "Avoid using headphones or looking at your phone in unfamiliar areas.",
    },
    {
      id: 3,
      title: "Share your location",
      description: "Let trusted contacts know your plans and when to expect you.",
    },
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold flex-1 text-center mr-8">Education Hub</h1>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-20">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search safety resources..." className="pl-10 bg-white" />
        </div>

        <Tabs defaultValue="resources">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="resources" className="flex-1">
              Resources
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="flex-1">
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="mt-0">
            <h2 className="text-lg font-medium mb-3">Featured Content</h2>
            <div className="grid grid-cols-1 gap-3 mb-6">
              {featuredContent.map((content) => (
                <Card key={content.id} className="border-none shadow-sm">
                  <CardContent className="p-4 flex items-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                      style={{ backgroundColor: `${content.color}20` }}
                    >
                      <content.icon className="h-6 w-6" style={{ color: content.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{content.title}</h3>
                      <p className="text-sm text-gray-500 capitalize">{content.type}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="text-lg font-medium mb-3">Safety Tips</h2>
            <div className="space-y-3">
              {safetyTips.map((tip) => (
                <Card key={tip.id} className="border-none shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">{tip.title}</h3>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="mt-0">
            <Card className="border-none shadow-sm mb-4">
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Personalized Safety Insights</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Based on your activity patterns, here are some safety recommendations:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8A4FFF] mt-1.5 mr-2"></div>
                    <span>Consider using the buddy system when walking at night in your neighborhood.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8A4FFF] mt-1.5 mr-2"></div>
                    <span>Your most frequent route has had 3 reported incidents this month.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8A4FFF] mt-1.5 mr-2"></div>
                    <span>Set up scheduled check-ins for your evening commute.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Button className="w-full bg-[#8A4FFF] hover:bg-[#8A4FFF]/90">
              <BookOpen className="h-4 w-4 mr-2" />
              Get More Personalized Insights
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation activeTab="Learn" />
    </div>
  )
}

