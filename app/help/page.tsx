"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  Search,
  AlertTriangle,
  Shield,
  Users,
} from "lucide-react"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false)

  const faqs = [
    {
      question: "How does the emergency trigger work?",
      answer:
        "The emergency trigger can be activated by holding the button for 2 seconds. Once activated, it will alert your trusted contacts with your location and start emergency mode.",
    },
    {
      question: "How do I add contacts to my Circle of 3?",
      answer:
        "Go to the Circle tab in the bottom navigation, then tap the + button to add a new trusted contact. You can add up to 3 contacts who will be notified in case of emergency.",
    },
    {
      question: "Can I customize the emergency triggers?",
      answer:
        "Yes, you can customize how you trigger emergency mode in the Settings page. Options include shake detection, power button press, and the on-screen emergency button.",
    },
    {
      question: "How accurate is the location sharing?",
      answer:
        "Location sharing uses your device's GPS and is typically accurate to within 5-10 meters in optimal conditions. The accuracy may vary based on your surroundings and device capabilities.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we use end-to-end encryption for all your personal data and location information. Your data is only shared with your trusted contacts when you explicitly allow it or during emergency situations.",
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setContactFormSubmitted(true)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Help & Support" />

      <div className="flex-1 overflow-auto p-4 pb-20">
        <Tabs defaultValue="faq">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="faq" className="flex-1">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Us
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Guides
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search FAQs..."
                className="pl-10 bg-white dark:bg-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500">No results found</h3>
                <p className="text-gray-400">Try a different search term</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            {contactFormSubmitted ? (
              <Card className="border-none shadow-sm dark:bg-gray-800">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-[#36D986]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="h-8 w-8 text-[#36D986]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">Message Sent!</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Thank you for reaching out. Our support team will get back to you within 24 hours.
                  </p>
                  <Button onClick={() => setContactFormSubmitted(false)} className="bg-[#8A4FFF] hover:bg-[#8A4FFF]/90">
                    Send Another Message
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <Card className="border-none shadow-sm dark:bg-gray-800">
                  <CardContent className="p-4 space-y-4">
                    <h3 className="text-lg font-semibold dark:text-white">Contact Support</h3>

                    <div className="space-y-2">
                      <label className="text-sm font-medium dark:text-gray-300">Your Name</label>
                      <Input placeholder="Enter your name" className="dark:bg-gray-700" required />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium dark:text-gray-300">Email Address</label>
                      <Input type="email" placeholder="Enter your email" className="dark:bg-gray-700" required />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium dark:text-gray-300">Issue Type</label>
                      <select className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                        <option value="account">Account Issue</option>
                        <option value="emergency">Emergency Feature</option>
                        <option value="contacts">Circle of 3</option>
                        <option value="technical">Technical Problem</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium dark:text-gray-300">Message</label>
                      <Textarea
                        placeholder="Describe your issue or question..."
                        className="min-h-[120px] dark:bg-gray-700"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-[#8A4FFF] hover:bg-[#8A4FFF]/90">
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              </form>
            )}

            <Card className="border-none shadow-sm dark:bg-gray-800">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-lg font-semibold dark:text-white">Other Ways to Reach Us</h3>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#8A4FFF]/10 flex items-center justify-center mr-3">
                      <Phone className="h-5 w-5 text-[#8A4FFF]" />
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">Support Hotline</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">+1 (800) 555-0123</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#8A4FFF]/10 flex items-center justify-center mr-3">
                      <Mail className="h-5 w-5 text-[#8A4FFF]" />
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">Email Support</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">support@shelther.com</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides" className="space-y-4">
            <Card className="border-none shadow-sm dark:bg-gray-800">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3 dark:text-white">Quick Start Guides</h3>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-between h-auto py-3 text-left">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#8A4FFF]/10 flex items-center justify-center mr-3">
                        <AlertTriangle className="h-4 w-4 text-[#8A4FFF]" />
                      </div>
                      <span className="font-medium">Emergency Features Guide</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Button>

                  <Button variant="outline" className="w-full justify-between h-auto py-3 text-left">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#8A4FFF]/10 flex items-center justify-center mr-3">
                        <Users className="h-4 w-4 text-[#8A4FFF]" />
                      </div>
                      <span className="font-medium">Setting Up Your Circle of 3</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Button>

                  <Button variant="outline" className="w-full justify-between h-auto py-3 text-left">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#8A4FFF]/10 flex items-center justify-center mr-3">
                        <Shield className="h-4 w-4 text-[#8A4FFF]" />
                      </div>
                      <span className="font-medium">Safety Features Overview</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm dark:bg-gray-800">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3 dark:text-white">Video Tutorials</h3>

                <div className="space-y-3">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                    <Play className="h-12 w-12 text-gray-400" />
                  </div>
                  <h4 className="font-medium dark:text-white">How to Use Shelther - Complete Guide</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    A comprehensive walkthrough of all Shelther features and how to use them effectively.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  )
}

function Play(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

