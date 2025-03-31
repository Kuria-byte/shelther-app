"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  Shield,
  AlertTriangle,
  MapPin,
  Users,
  Clock,
  Video,
  FileText,
  ExternalLink,
  Play,
  Globe,
  PhoneCall,
} from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqCategories = [
    {
      id: "general",
      title: "General",
      icon: HelpCircle,
      questions: [
        {
          question: "What is Shelther?",
          answer:
            "Shelther is a comprehensive personal safety application designed to provide intuitive safety tools that live comfortably on your phone, ready when you need them but not constantly reminding you of potential threats.",
        },
        {
          question: "How do I create an account?",
          answer:
            "To create an account, download the Shelther app from the App Store or Google Play Store, open it, and tap 'Sign Up'. You'll need to provide your email address, create a password, and verify your phone number for security purposes.",
        },
        {
          question: "Is Shelther free to use?",
          answer:
            "Shelther offers both free and premium features. The basic safety features are free, while advanced features like 24/7 monitoring and expanded emergency contacts are available with a premium subscription.",
        },
        {
          question: "How do I contact support?",
          answer:
            "You can contact our support team through the app by going to Help > Contact Support, or by emailing support@shelther.com. For urgent matters, you can also call our support line at +1 (555) 123-4567.",
        },
      ],
    },
    {
      id: "safety",
      title: "Safety Features",
      icon: Shield,
      questions: [
        {
          question: "How does the emergency button work?",
          answer:
            "The emergency button activates when you press and hold it for 3 seconds. This prevents accidental activation. Once triggered, it will alert your emergency contacts with your location and begin recording audio. You can customize these settings in the Safety Settings menu.",
        },
        {
          question: "What is 'Feeling Cautious' mode?",
          answer:
            "The 'Feeling Cautious' mode is a middle ground between normal and emergency states. When activated, Shelther will check in with you periodically and notify your trusted contacts if you don't respond. It also enables enhanced location tracking without triggering a full emergency response.",
        },
        {
          question: "How do I set up a safety timer?",
          answer:
            "To set up a safety timer, go to the home screen and tap the 'Timer' option. Set your estimated arrival time and select which contacts should be notified if you don't check in. The timer will count down, and you'll receive reminders to check in before it expires.",
        },
        {
          question: "Can I use Shelther without sharing my location?",
          answer:
            "While location sharing enhances many safety features, you can use Shelther with limited functionality without sharing your location. Go to Settings > Privacy to customize your location sharing preferences.",
        },
      ],
    },
    {
      id: "contacts",
      title: "Trusted Contacts",
      icon: Users,
      questions: [
        {
          question: "How do I add trusted contacts?",
          answer:
            "To add trusted contacts, go to the Circle tab and tap the '+' button. You can add contacts from your phone's address book or by entering their email address or phone number manually. They'll receive an invitation to connect with you on Shelther.",
        },
        {
          question: "What information can my trusted contacts see?",
          answer:
            "By default, trusted contacts can only see your information when you explicitly share it or during emergencies. You can customize what each contact can see in Settings > Privacy > Contact Permissions.",
        },
        {
          question: "How many trusted contacts can I add?",
          answer:
            "Free accounts can add up to 3 trusted contacts. Premium subscribers can add up to 10 trusted contacts. All contacts receive the same emergency alerts, but you can customize notification settings for each contact individually.",
        },
        {
          question: "Can I remove a trusted contact?",
          answer:
            "Yes, you can remove a trusted contact at any time. Go to the Circle tab, select the contact you want to remove, and tap the 'Remove Contact' button. The contact will no longer receive notifications about your safety status.",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical Support",
      icon: HelpCircle,
      questions: [
        {
          question: "How do I update the app?",
          answer:
            "Shelther updates automatically through your device's app store. To check for updates manually, visit the App Store or Google Play Store and search for Shelther. If an update is available, you'll see an 'Update' button.",
        },
        {
          question: "Why is the app using battery?",
          answer:
            "Shelther uses location services which can impact battery life. To optimize battery usage, go to Settings > Advanced > Battery Saver. You can adjust location accuracy and background activity to balance safety features with battery consumption.",
        },
        {
          question: "How do I reset my password?",
          answer:
            "To reset your password, tap 'Forgot Password' on the login screen. Enter the email address associated with your account, and we'll send you a password reset link. For security reasons, the link expires after 24 hours.",
        },
        {
          question: "Can I use Shelther on multiple devices?",
          answer:
            "Yes, you can use Shelther on multiple devices with the same account. Your safety settings, trusted contacts, and preferences will sync across all your devices. Note that location tracking will be based on the device you're actively using.",
        },
      ],
    },
  ]

  const guides = [
    {
      id: 1,
      title: "Getting Started with Shelther",
      description: "Learn the basics of setting up and using Shelther",
      icon: BookOpen,
      category: "Beginner",
      duration: "5 min read",
    },
    {
      id: 2,
      title: "Setting Up Your Circle of Trust",
      description: "How to add and manage trusted contacts",
      icon: Users,
      category: "Essential",
      duration: "3 min read",
    },
    {
      id: 3,
      title: "Using the Emergency Features",
      description: "A comprehensive guide to emergency tools",
      icon: AlertTriangle,
      category: "Safety",
      duration: "7 min read",
    },
    {
      id: 4,
      title: "Journey Tracking Tutorial",
      description: "How to use journey tracking for safer travel",
      icon: MapPin,
      category: "Feature",
      duration: "4 min video",
    },
    {
      id: 5,
      title: "Safety Timer Walkthrough",
      description: "Set up and use the safety timer effectively",
      icon: Clock,
      category: "Feature",
      duration: "3 min read",
    },
    {
      id: 6,
      title: "Privacy Settings Guide",
      description: "Customize your privacy and sharing preferences",
      icon: Shield,
      category: "Privacy",
      duration: "6 min read",
    },
  ]

  const resources = [
    {
      title: "Video Tutorials",
      description: "Step-by-step visual guides for all features",
      icon: Video,
      url: "#video-tutorials",
    },
    {
      title: "Safety Documentation",
      description: "Comprehensive safety guides and best practices",
      icon: FileText,
      url: "#safety-docs",
    },
    {
      title: "Community Forum",
      description: "Connect with other users and share experiences",
      icon: MessageCircle,
      url: "#community",
    },
    {
      title: "Support Knowledge Base",
      description: "Searchable database of support articles",
      icon: BookOpen,
      url: "#knowledge-base",
    },
  ]

  return (
    <PageContainer title="Help & Support">
      {/* Help Header */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-teal-400 text-white shadow-lg p-6"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-8 border-white opacity-20"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-full mr-4">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Help Center</h2>
              <p className="text-white text-opacity-90">Find answers and support</p>
            </div>
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 bg-white bg-opacity-20 border-white border-opacity-20 text-white placeholder-white placeholder-opacity-70 focus:bg-white focus:bg-opacity-30"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white text-opacity-70" />
          </div>
        </div>
      </motion.div>

      {/* Help Content */}
      <Tabs defaultValue="faq" className="mt-6">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="corporate">Corporate</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4">
          {faqCategories.map((category) => (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                  <category.icon className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{category.title}</h3>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium text-gray-800 dark:text-white">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Quick Start Guides" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {guides.map((guide) => (
                <motion.div
                  key={guide.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-700 cursor-pointer"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3 flex-shrink-0">
                      <guide.icon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-medium text-gray-800 dark:text-white">{guide.title}</h4>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {guide.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{guide.description}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{guide.duration}</span>
                        <ChevronRight className="h-4 w-4 text-purple-500 dark:text-purple-400 ml-auto" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Video Tutorials" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="relative h-48 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-3 bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 rounded-full">
                    <Play className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black to-transparent">
                  <h4 className="text-white font-medium">Getting Started with Shelther</h4>
                  <p className="text-white text-opacity-80 text-sm">3:45 • Beginner</p>
                </div>
              </div>

              <div className="relative h-48 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-3 bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 rounded-full">
                    <Play className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black to-transparent">
                  <h4 className="text-white font-medium">Using Emergency Features</h4>
                  <p className="text-white text-opacity-80 text-sm">5:12 • Safety</p>
                </div>
              </div>

              <div className="relative h-48 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-3 bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 rounded-full">
                    <Play className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black to-transparent">
                  <h4 className="text-white font-medium">Setting Up Your Circle</h4>
                  <p className="text-white text-opacity-80 text-sm">4:30 • Essential</p>
                </div>
              </div>

              <div className="relative h-48 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-3 bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 rounded-full">
                    <Play className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black to-transparent">
                  <h4 className="text-white font-medium">Privacy Settings Guide</h4>
                  <p className="text-white text-opacity-80 text-sm">3:18 • Privacy</p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Button variant="outline" className="mt-2">
                View All Tutorials
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Contact Support" />
            <div className="space-y-4 mt-4">
              <p className="text-gray-600 dark:text-gray-300">
                Our support team is available to help you with any questions or issues you may have. Choose your
                preferred method of contact below.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                  </div>
                  <h4 className="text-base font-medium text-gray-800 dark:text-white mb-2">Chat Support</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Chat with our support team in real-time
                  </p>
                  <Button>Start Chat</Button>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                  </div>
                  <h4 className="text-base font-medium text-gray-800 dark:text-white mb-2">Email Support</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Send us an email and we'll respond within 24 hours
                  </p>
                  <Button variant="outline">support@shelther.com</Button>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-3">
                    <Phone className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                  </div>
                  <h4 className="text-base font-medium text-gray-800 dark:text-white mb-2">Phone Support</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Call us directly for urgent matters</p>
                  <Button variant="outline">+1 (555) 123-4567</Button>
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg mt-6">
                <h4 className="text-base font-medium text-gray-800 dark:text-white mb-2">Support Hours</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Our support team is available Monday through Friday, 9:00 AM to 8:00 PM EST. For emergency assistance
                  outside of these hours, please use the emergency button in the app.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Feedback" />
            <div className="space-y-4 mt-4">
              <p className="text-gray-600 dark:text-gray-300">
                We're constantly working to improve Shelther. Your feedback helps us make the app better for everyone.
              </p>

              <div className="flex flex-col space-y-4">
                <Button>Submit Feedback</Button>
                <Button variant="outline">Report a Bug</Button>
                <Button variant="outline">Suggest a Feature</Button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm mt-4">
            <SectionHeader title="Legal & Policies" />
            <div className="space-y-4 mt-4">
              <p className="text-gray-600 dark:text-gray-300">
                Our commitment to your safety includes transparent policies and ethical practices. Review our policy
                statements to understand how we protect your data and privacy.
              </p>

              <div className="space-y-3 mt-4">
                <a
                  href="/policies/privacy"
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2" />
                  <span className="text-gray-800 dark:text-gray-200">Privacy Policy</span>
                </a>

                <a
                  href="/policies/terms"
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2" />
                  <span className="text-gray-800 dark:text-gray-200">Terms of Service</span>
                </a>

                <a
                  href="/policies/data"
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2" />
                  <span className="text-gray-800 dark:text-gray-200">Data Processing Agreement</span>
                </a>

                <a
                  href="/policies/compliance"
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2" />
                  <span className="text-gray-800 dark:text-gray-200">Compliance Certifications</span>
                </a>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Additional Resources" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {resources.map((resource, index) => (
                <motion.a
                  key={index}
                  href={resource.url}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-700"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3 flex-shrink-0">
                      <resource.icon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-medium text-gray-800 dark:text-white">{resource.title}</h4>
                        <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{resource.description}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Safety Resources" />
            <div className="space-y-4 mt-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="text-base font-medium text-gray-800 dark:text-white mb-2">National Resources</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2" />
                    <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                      National Domestic Violence Hotline
                    </a>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2" />
                    <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                      RAINN (Rape, Abuse & Incest National Network)
                    </a>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2" />
                    <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                      Crisis Text Line
                    </a>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2" />
                    <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                      National Center for Missing & Exploited Children
                    </a>
                  </li>
                </ul>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="text-base font-medium text-gray-800 dark:text-white mb-2">Safety Guides</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2" />
                    <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                      Personal Safety Planning Guide
                    </a>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2" />
                    <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                      Digital Privacy & Security Handbook
                    </a>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2" />
                    <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                      Travel Safety Essentials
                    </a>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2" />
                    <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                      Urban Safety Navigation Guide
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="corporate" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Corporate Safety Solutions" />
            <div className="space-y-4 mt-4">
              <p className="text-gray-600 dark:text-gray-300">
                Shelther offers comprehensive safety solutions for businesses of all sizes. Our enterprise-grade
                platform helps organizations protect their employees, whether they're in the office, working remotely,
                or traveling.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  </div>
                  <h4 className="text-base font-medium text-gray-800 dark:text-white mb-2">Employee Safety Program</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Comprehensive safety training and tools for your entire workforce, with centralized management and
                    reporting.
                  </p>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-3">
                    <MapPin className="h-5 w-5 text-teal-500 dark:text-teal-400" />
                  </div>
                  <h4 className="text-base font-medium text-gray-800 dark:text-white mb-2">Remote Worker Protection</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Specialized tools for distributed teams, ensuring safety regardless of where your employees work.
                  </p>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                    <Globe className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                  </div>
                  <h4 className="text-base font-medium text-gray-800 dark:text-white mb-2">Travel Risk Management</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Protect employees during business travel with real-time monitoring and emergency response protocols.
                  </p>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-3">
                    <Shield className="h-5 w-5 text-red-500 dark:text-red-400" />
                  </div>
                  <h4 className="text-base font-medium text-gray-800 dark:text-white mb-2">Crisis Management</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Comprehensive tools for preparing for, responding to, and recovering from safety incidents and
                    emergencies.
                  </p>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Implementation & Integration" />
            <div className="space-y-4 mt-4">
              <p className="text-gray-600 dark:text-gray-300">
                Shelther seamlessly integrates with your existing systems and workflows, making implementation
                straightforward and minimizing disruption.
              </p>

              <div className="space-y-3 mt-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-base font-medium text-gray-800 dark:text-white mb-1">Single Sign-On (SSO)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Integrate with your existing identity provider for seamless authentication.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-base font-medium text-gray-800 dark:text-white mb-1">HR System Integration</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Connect with HRIS platforms for automated user provisioning and deprovisioning.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-base font-medium text-gray-800 dark:text-white mb-1">Custom API Access</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Build custom integrations with our comprehensive API documentation.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-base font-medium text-gray-800 dark:text-white mb-1">White Labeling</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Customize the app with your company branding for a seamless employee experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Success Stories" />
            <div className="space-y-4 mt-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                    <span className="text-xl font-bold text-gray-500 dark:text-gray-400">G</span>
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-gray-800 dark:text-white">Global Tech Corporation</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">10,000+ employees worldwide</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  "Implementing Shelther across our global workforce has significantly improved our duty of care
                  capabilities. The platform's flexibility accommodates our diverse team's needs, from office workers to
                  frequent travelers."
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">— Sarah Chen, Global Security Director</p>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                    <span className="text-xl font-bold text-gray-500 dark:text-gray-400">R</span>
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-gray-800 dark:text-white">Remote First Startup</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">250 employees across 15 countries</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  "As a fully distributed company, ensuring our team's safety regardless of location was a challenge.
                  Shelther's remote worker protection tools have given us peace of mind and our employees feel more
                  supported."
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">— Miguel Ortiz, People Operations Lead</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Contact Enterprise Sales" />
            <div className="space-y-4 mt-4">
              <p className="text-gray-600 dark:text-gray-300">
                Ready to enhance safety across your organization? Our enterprise team is here to help you find the right
                solution for your specific needs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                  </div>
                  <h4 className="text-base font-medium text-gray-800 dark:text-white mb-2">Email Us</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Send us your requirements and we'll get back to you within 24 hours
                  </p>
                  <Button variant="outline">enterprise@shelther.com</Button>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-3">
                    <PhoneCall className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                  </div>
                  <h4 className="text-base font-medium text-gray-800 dark:text-white mb-2">Schedule a Call</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Book a consultation with our enterprise safety specialists
                  </p>
                  <Button>Book Consultation</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}

