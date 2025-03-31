"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Video,
  FileText,
  Award,
  ChevronRight,
  Star,
  Globe,
  Database,
  BrainCircuit,
  BookMarked,
  MessageCircle,
  PhoneCall,
  X,
} from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { SafetyTipModal } from "@/components/features/safety-tip-modal"
import { CourseModal } from "@/components/features/course-modal"
import { ResourceCard } from "@/components/features/resource-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function LearnPage() {
  const [showAIInsights, setShowAIInsights] = useState(true)
  const [selectedTip, setSelectedTip] = useState<any>(null)
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"personal" | "corporate">("personal")

  useEffect(() => {
    // Add custom CSS for hiding scrollbar
    const style = document.createElement("style")
    style.textContent = `
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const trainers = [
    {
      id: 1,
      name: "Dr. Maya Johnson",
      specialty: "Self-Defense",
      shortBio: "Former law enforcement officer with 15+ years of experience teaching self-defense techniques.",
      fullBio:
        "Dr. Maya Johnson is a certified self-defense instructor with a background in law enforcement and a PhD in Criminal Psychology. She specializes in teaching practical, accessible self-defense techniques tailored for women and vulnerable populations. Her approach combines physical techniques with psychological preparedness.",
      image: "/placeholder.svg?height=150&width=250",
      rating: 5,
      experience: "15+ years",
      credentials: ["PhD Criminal Psychology", "Certified Self-Defense Instructor", "Former Police Captain"],
      courses: ["Self-Defense Basics", "Psychological Safety", "Emergency Response Training"],
      contact: "maya.johnson@shelther.com",
    },
    {
      id: 2,
      name: "Alex Rivera",
      specialty: "Urban Safety",
      shortBio: "Urban safety specialist focusing on navigation, awareness, and risk assessment in city environments.",
      fullBio:
        "Alex Rivera has dedicated their career to understanding and teaching urban safety protocols. With a background in urban planning and security consulting, Alex helps individuals develop comprehensive strategies for navigating cities safely. Their teaching emphasizes situational awareness, risk assessment, and practical safety habits.",
      image: "/placeholder.svg?height=150&width=250",
      rating: 4,
      experience: "8+ years",
      credentials: ["MS Urban Planning", "Certified Security Consultant", "Safety App Developer"],
      courses: ["Urban Navigation", "Public Transport Safety", "City Safety Mapping"],
      contact: "alex.rivera@shelther.com",
    },
    {
      id: 3,
      name: "Dr. Keisha Williams",
      specialty: "Digital Privacy",
      shortBio: "Cybersecurity expert specializing in personal digital privacy and protection from online threats.",
      fullBio:
        "Dr. Keisha Williams is a renowned cybersecurity expert with extensive experience in digital privacy protection. She has worked with major tech companies and government agencies to develop security protocols. Her teaching focuses on practical steps individuals can take to protect their digital footprint and prevent cyberstalking and harassment.",
      image: "/placeholder.svg?height=150&width=250",
      rating: 5,
      experience: "12+ years",
      credentials: [
        "PhD Computer Science",
        "Certified Information Privacy Professional",
        "Former NSA Security Analyst",
      ],
      courses: ["Digital Privacy Fundamentals", "Anti-Stalking Technologies", "Secure Communication"],
      contact: "keisha.williams@shelther.com",
    },
    {
      id: 4,
      name: "James Chen",
      specialty: "Travel Safety",
      shortBio: "International security consultant specializing in travel safety across diverse global environments.",
      fullBio:
        "James Chen is an international security consultant who has worked in over 40 countries providing safety training and risk assessment. His expertise covers everything from preparation and planning to on-the-ground safety protocols in diverse environments. James's approach emphasizes cultural awareness, preparation, and adaptability.",
      image: "/placeholder.svg?height=150&width=250",
      rating: 4,
      experience: "10+ years",
      credentials: [
        "International Security Certification",
        "Former Travel Security Advisor",
        "Multilingual (5 languages)",
      ],
      courses: ["International Travel Safety", "Hotel & Accommodation Security", "Cross-Cultural Safety"],
      contact: "james.chen@shelther.com",
    },
    {
      id: 5,
      name: "Sarah Patel",
      specialty: "Emergency Response",
      shortBio: "Emergency response trainer with background in crisis management and first aid instruction.",
      fullBio:
        "Sarah Patel brings her extensive experience in emergency medicine and crisis response to her role as a safety trainer. She has worked with emergency services and humanitarian organizations worldwide. Sarah specializes in teaching practical emergency response skills that can be applied in various crisis situations, from medical emergencies to natural disasters.",
      image: "/placeholder.svg?height=150&width=250",
      rating: 5,
      experience: "9+ years",
      credentials: ["Emergency Medical Technician", "Crisis Management Certification", "Disaster Response Specialist"],
      courses: ["First Aid Essentials", "Crisis Response", "Emergency Planning"],
      contact: "sarah.patel@shelther.com",
    },
  ]

  const corporateTrainers = [
    {
      id: 1,
      name: "Enterprise Safety Solutions",
      specialty: "Corporate Security",
      shortBio:
        "Comprehensive security training and consulting for businesses of all sizes with focus on employee safety.",
      fullBio:
        "Enterprise Safety Solutions specializes in developing custom safety protocols and training programs for corporations. With expertise in risk assessment, crisis management, and employee safety, we help organizations create secure work environments whether in-office or remote. Our team has worked with Fortune 500 companies across industries to implement effective safety measures.",
      image: "/placeholder.svg?height=150&width=250",
      rating: 5,
      experience: "12+ years",
      credentials: ["ISO 27001 Certified", "Corporate Security Specialists", "Crisis Management Experts"],
      courses: ["Remote Employee Safety", "Office Security Protocols", "Crisis Management for Teams"],
      contact: "corporate@shelther.com",
      corporate: {
        clients: ["Fortune 500 Companies", "Tech Startups", "Government Agencies"],
        services: ["Custom Training Programs", "Security Audits", "Crisis Response Planning"],
        pricing: "Custom enterprise pricing based on company size and needs",
      },
    },
    {
      id: 2,
      name: "WorkSafe Training Group",
      specialty: "Remote Workforce Safety",
      shortBio:
        "Specialized training for organizations with remote and distributed teams to ensure employee safety anywhere.",
      fullBio:
        "WorkSafe Training Group has pioneered safety programs specifically designed for the modern distributed workforce. We understand the unique challenges remote employees face and provide practical safety solutions that can be implemented regardless of location. Our approach combines digital safety training with physical safety protocols tailored to home offices and remote work scenarios.",
      image: "/placeholder.svg?height=150&width=250",
      rating: 4,
      experience: "8+ years",
      credentials: ["Remote Work Safety Certified", "Digital Security Experts", "Employee Wellness Specialists"],
      courses: ["Distributed Team Safety", "Home Office Security", "Digital Privacy for Employees"],
      contact: "worksafe@shelther.com",
      corporate: {
        clients: ["Tech Companies", "Global Organizations", "Remote-First Startups"],
        services: ["Remote Team Safety Audits", "Digital Security Training", "Emergency Response Systems"],
        pricing: "Starting at $5,000 for teams up to 50 employees",
      },
    },
    {
      id: 3,
      name: "Global Risk Mitigation Partners",
      specialty: "International Business Safety",
      shortBio:
        "Expert security services for multinational corporations with employees in high-risk regions worldwide.",
      fullBio:
        "Global Risk Mitigation Partners specializes in ensuring employee safety across international operations. We provide comprehensive risk assessments, customized training, and emergency response protocols for organizations with global footprints. Our team includes former diplomatic security specialists, international security experts, and regional safety consultants who understand the nuanced challenges of operating in diverse environments.",
      image: "/placeholder.svg?height=150&width=250",
      rating: 5,
      experience: "15+ years",
      credentials: [
        "International Security Association Certified",
        "Risk Management Professionals",
        "Regional Security Experts",
      ],
      courses: ["Travel Risk Management", "International Crisis Response", "Cultural Safety Awareness"],
      contact: "global@shelther.com",
      corporate: {
        clients: ["Multinational Corporations", "NGOs", "International Organizations"],
        services: ["Global Risk Assessment", "Country-Specific Safety Protocols", "Emergency Evacuation Planning"],
        pricing: "Custom international packages available, contact for consultation",
      },
    },
    {
      id: 4,
      name: "Secure Workplace Consultants",
      specialty: "Office & Facility Security",
      shortBio:
        "Specialized security consulting for physical workplace environments, from small offices to large campuses.",
      fullBio:
        "Secure Workplace Consultants provides expert guidance on creating and maintaining safe physical work environments. We conduct thorough assessments of office spaces, recommend security infrastructure improvements, and develop comprehensive safety protocols. Our team of consultants includes former law enforcement, security specialists, and workplace safety experts who understand the balance between security and workplace culture.",
      image: "/placeholder.svg?height=150&width=250",
      rating: 4,
      experience: "10+ years",
      credentials: ["Physical Security Certified", "Workplace Safety Specialists", "Security System Experts"],
      courses: ["Facility Security Assessment", "Employee Safety Training", "Emergency Response Procedures"],
      contact: "workplace@shelther.com",
      corporate: {
        clients: ["Corporate Offices", "Manufacturing Facilities", "Educational Institutions"],
        services: ["Security Infrastructure Design", "Employee Safety Programs", "Crisis Management Planning"],
        pricing: "Starting at $3,500 for initial assessment and recommendations",
      },
    },
    {
      id: 5,
      name: "Digital Workforce Protectors",
      specialty: "Cybersecurity & Digital Safety",
      shortBio: "Comprehensive digital safety and security training for organizations and their employees.",
      fullBio:
        "Digital Workforce Protectors focuses on the intersection of personal and corporate digital safety. We provide training and systems to protect organizations and their employees from digital threats, from phishing attempts to cyberstalking. Our approach emphasizes both technical solutions and human awareness, creating a culture of security that extends beyond the workplace to protect employees in all digital interactions.",
      image: "/placeholder.svg?height=150&width=250",
      rating: 5,
      experience: "7+ years",
      credentials: ["CISSP Certified", "Digital Forensics Specialists", "Security Awareness Trainers"],
      courses: ["Corporate Digital Security", "Anti-Phishing Training", "Personal Device Security"],
      contact: "digital@shelther.com",
      corporate: {
        clients: ["Technology Companies", "Financial Institutions", "Healthcare Organizations"],
        services: ["Security Awareness Programs", "Digital Risk Assessment", "Employee Privacy Protection"],
        pricing: "Subscription model available at $2,500/month for up to 100 employees",
      },
    },
  ]

  const getTrainersByViewMode = () => {
    return viewMode === "personal" ? trainers : corporateTrainers
  }

  const safetyTips = [
    {
      id: 1,
      title: "Walking Alone at Night",
      description: "Essential tips for staying safe when walking alone after dark",
      category: "Personal Safety",
      duration: "5 min read",
      icon: BookOpen,
      content:
        "Walking alone at night can be unavoidable sometimes, but there are steps you can take to maximize your safety.\n\nStay alert and aware of your surroundings at all times. Avoid distractions like texting or listening to music with both earbuds in.\n\nStick to well-lit, populated areas whenever possible and avoid shortcuts through deserted areas, alleys, or parks.\n\nWalk confidently and with purpose. Attackers typically target individuals who appear vulnerable or distracted.",
      steps: [
        {
          title: "Plan Your Route",
          description: "Before heading out, plan your route through well-lit and populated areas.",
        },
        {
          title: "Stay Alert",
          description: "Keep your head up, avoid phone distractions, and be aware of your surroundings.",
        },
        {
          title: "Use Safety Tools",
          description: "Carry a personal alarm or use safety apps like Shelther to monitor your journey.",
        },
        {
          title: "Trust Your Instincts",
          description: "If something feels wrong, trust your gut feeling and change your route or seek help.",
        },
      ],
      resources: [
        {
          title: "RAINN Personal Safety Tips",
          url: "https://www.rainn.org/safety-prevention",
        },
        {
          title: "National Crime Prevention Council - Walking Safety",
          url: "https://www.ncpc.org/resources/home-neighborhood-safety/",
        },
      ],
    },
    {
      id: 2,
      title: "Self-Defense Basics",
      description: "Learn fundamental self-defense techniques for emergency situations",
      category: "Self-Defense",
      duration: "10 min video",
      icon: Video,
      content:
        "Self-defense is about being prepared and knowing how to react if you're threatened. These fundamental techniques can help you protect yourself in emergency situations.\n\nRemember that the primary goal of self-defense is to create an opportunity to escape, not to engage in a prolonged confrontation.\n\nEven basic knowledge of self-defense can boost your confidence and awareness, which may deter potential attackers.",
      steps: [
        {
          title: "Maintain Distance",
          description: "Keep at least arm's length distance from potential threats whenever possible.",
        },
        {
          title: "Use Your Voice",
          description: "Yell forcefully with commands like 'STOP!' or 'BACK OFF!' to attract attention.",
        },
        {
          title: "Target Vulnerable Areas",
          description:
            "If physically threatened, target eyes, nose, throat, and groin to temporarily disable an attacker.",
        },
        {
          title: "Create Space to Escape",
          description: "The primary goal is to create an opportunity to escape, not to win a fight.",
        },
      ],
      resources: [
        {
          title: "NWMAF Self-Defense Resources",
          url: "https://www.nwmaf.org/self-defense-resources/",
        },
        {
          title: "Basic Self-Defense Techniques Video",
          url: "https://www.youtube.com/results?search_query=basic+self+defense+techniques+for+beginners",
        },
      ],
    },
    {
      id: 3,
      title: "Creating a Safety Plan",
      description: "How to develop a comprehensive safety plan for various scenarios",
      category: "Planning",
      duration: "8 min read",
      icon: FileText,
      content:
        "A safety plan is a personalized, practical plan that can help you avoid dangerous situations and know the best way to react when you're in danger.\n\nYour safety plan should be tailored to your specific circumstances and updated regularly as your situation changes.\n\nShare relevant parts of your safety plan with trusted friends or family members so they can assist you if needed.",
      steps: [
        {
          title: "Identify Safe Spaces",
          description: "Map out places you can go quickly if you feel unsafe (police stations, busy stores, etc.).",
        },
        {
          title: "Create Emergency Contacts",
          description: "Establish a circle of trusted contacts who can respond to different types of emergencies.",
        },
        {
          title: "Prepare Emergency Resources",
          description: "Keep emergency cash, important documents, and essentials in an accessible place.",
        },
        {
          title: "Practice Your Response",
          description: "Mentally rehearse how you'll respond in different emergency scenarios.",
        },
      ],
      resources: [
        {
          title: "National Domestic Violence Hotline - Safety Planning",
          url: "https://www.thehotline.org/plan-for-safety/create-a-safety-plan/",
        },
        {
          title: "Ready.gov Emergency Planning",
          url: "https://www.ready.gov/plan",
        },
      ],
    },
    {
      id: 4,
      title: "Digital Privacy & Security",
      description: "Protect your personal information online and prevent digital stalking",
      category: "Cybersecurity",
      duration: "7 min read",
      icon: Database,
      content:
        "In today's connected world, digital privacy is a crucial aspect of personal safety. Understanding how to protect your information online can prevent stalking, identity theft, and other forms of digital harassment.\n\nRegularly review your privacy settings on social media platforms and be mindful of the personal information you share publicly.\n\nUse strong, unique passwords for different accounts and enable two-factor authentication whenever possible.",
      steps: [
        {
          title: "Audit Your Digital Footprint",
          description: "Review what personal information is publicly available about you online.",
        },
        {
          title: "Secure Your Accounts",
          description: "Use strong passwords, enable two-factor authentication, and limit location sharing.",
        },
        {
          title: "Check Device Settings",
          description: "Review app permissions, especially for location, camera, and microphone access.",
        },
        {
          title: "Be Cautious on Public Wi-Fi",
          description: "Avoid accessing sensitive information when connected to public networks.",
        },
      ],
      resources: [
        {
          title: "Electronic Frontier Foundation - Surveillance Self-Defense",
          url: "https://ssd.eff.org/",
        },
        {
          title: "National Network to End Domestic Violence - Tech Safety",
          url: "https://www.techsafety.org/resources/",
        },
      ],
    },
  ]

  const courses = [
    {
      id: 1,
      title: "Personal Safety Fundamentals",
      description:
        "A comprehensive introduction to personal safety concepts, situational awareness, and basic risk assessment. Learn how to identify potential threats and develop safety habits for everyday situations.",
      completed: "3/5 modules",
      progress: 60,
      image: "/placeholder.svg?height=200&width=400",
      modules: [
        {
          id: 1,
          title: "Understanding Personal Safety",
          duration: "10 min",
          completed: true,
          locked: false,
        },
        {
          id: 2,
          title: "Situational Awareness",
          duration: "15 min",
          completed: true,
          locked: false,
        },
        {
          id: 3,
          title: "Risk Assessment",
          duration: "12 min",
          completed: true,
          locked: false,
        },
        {
          id: 4,
          title: "De-escalation Techniques",
          duration: "18 min",
          completed: false,
          locked: false,
        },
        {
          id: 5,
          title: "Emergency Response",
          duration: "15 min",
          completed: false,
          locked: true,
        },
      ],
    },
    {
      id: 2,
      title: "Urban Navigation & Awareness",
      description:
        "Master the skills needed to navigate urban environments safely. This course covers route planning, understanding urban safety patterns, and using technology to enhance your safety while moving through cities.",
      completed: "1/4 modules",
      progress: 25,
      image: "/placeholder.svg?height=200&width=400",
      modules: [
        {
          id: 1,
          title: "City Safety Mapping",
          duration: "12 min",
          completed: true,
          locked: false,
        },
        {
          id: 2,
          title: "Public Transportation Safety",
          duration: "14 min",
          completed: false,
          locked: false,
        },
        {
          id: 3,
          title: "Nighttime Urban Navigation",
          duration: "15 min",
          completed: false,
          locked: true,
        },
        {
          id: 4,
          title: "Using Technology for Urban Safety",
          duration: "16 min",
          completed: false,
          locked: true,
        },
      ],
    },
    {
      id: 3,
      title: "Travel Safety Essentials",
      description:
        "Essential safety practices for travelers. Learn how to prepare for trips, stay safe in unfamiliar locations, and handle travel emergencies confidently.",
      completed: "0/4 modules",
      progress: 0,
      image: "/placeholder.svg?height=200&width=400",
      modules: [
        {
          id: 1,
          title: "Pre-Trip Safety Planning",
          duration: "14 min",
          completed: false,
          locked: false,
        },
        {
          id: 2,
          title: "Accommodation Safety",
          duration: "12 min",
          completed: false,
          locked: true,
        },
        {
          id: 3,
          title: "Transportation Safety Abroad",
          duration: "15 min",
          completed: false,
          locked: true,
        },
        {
          id: 4,
          title: "Emergency Response While Traveling",
          duration: "18 min",
          completed: false,
          locked: true,
        },
      ],
    },
  ]

  const resources = [
    {
      title: "National Domestic Violence Hotline",
      description: "24/7 hotline offering support, resources, and safety planning for domestic violence victims",
      icon: PhoneCall,
      url: "https://www.thehotline.org/",
      bgColor: "bg-red-100",
      darkBgColor: "dark:bg-red-900",
      textColor: "text-red-500",
      darkTextColor: "dark:text-red-400",
    },
    {
      title: "RAINN (Rape, Abuse & Incest National Network)",
      description: "Resources for sexual assault prevention, help for survivors, and educational content",
      icon: Globe,
      url: "https://www.rainn.org/",
      bgColor: "bg-purple-100",
      darkBgColor: "dark:bg-purple-900",
      textColor: "text-purple-500",
      darkTextColor: "dark:text-purple-400",
    },
    {
      title: "Crisis Text Line",
      description: "Text HOME to 741741 to connect with a Crisis Counselor for free 24/7 support",
      icon: MessageCircle,
      url: "https://www.crisistextline.org/",
      bgColor: "bg-green-100",
      darkBgColor: "dark:bg-green-900",
      textColor: "text-green-500",
      darkTextColor: "dark:text-green-400",
    },
    {
      title: "National Center for Missing & Exploited Children",
      description: "Resources focused on child safety, prevention, and recovery",
      icon: BookMarked,
      url: "https://www.missingkids.org/",
      bgColor: "bg-blue-100",
      darkBgColor: "dark:bg-blue-900",
      textColor: "text-blue-500",
      darkTextColor: "dark:text-blue-400",
    },
  ]

  const handleTipClick = (tip: any) => {
    setSelectedTip(tip)
  }

  const handleCourseClick = (course: any) => {
    setSelectedCourse(course)
  }

  return (
    <PageContainer title="Safety Learning">
      {/* Featured Course */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-teal-400 text-white shadow-lg"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() =>
          handleCourseClick({
            id: 0,
            title: "Safety Certification",
            description:
              "A comprehensive certification program that covers all aspects of personal safety. Completing this course will give you the knowledge and skills to assess risks, respond to emergencies, and create safety plans for various situations.",
            completed: "2/10 modules",
            progress: 20,
            image: "/placeholder.svg?height=200&width=400",
            modules: [
              {
                id: 1,
                title: "Introduction to Safety Certification",
                duration: "10 min",
                completed: true,
                locked: false,
              },
              {
                id: 2,
                title: "Risk Assessment Fundamentals",
                duration: "15 min",
                completed: true,
                locked: false,
              },
              {
                id: 3,
                title: "Emergency Response Planning",
                duration: "18 min",
                completed: false,
                locked: false,
              },
              {
                id: 4,
                title: "Self-Defense Awareness",
                duration: "20 min",
                completed: false,
                locked: true,
              },
              {
                id: 5,
                title: "Digital Safety & Privacy",
                duration: "15 min",
                completed: false,
                locked: true,
              },
            ],
          })
        }
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-8 border-white opacity-20"></div>
        </div>

        <div className="relative p-5 z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-full">
              <Award className="h-6 w-6" />
            </div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 text-yellow-300 fill-yellow-300" />
              ))}
            </div>
          </div>

          <h3 className="text-xl font-bold mb-1">Safety Certification</h3>
          <p className="text-sm text-white text-opacity-90 mb-4">
            Complete this course to earn your safety certification
          </p>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-white text-opacity-80">Progress</p>
              <p className="font-medium">2/10 modules</p>
            </div>
            <button className="py-2 px-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors font-medium text-sm">
              Continue Learning
            </button>
          </div>
        </div>
      </motion.div>

      {/* Safety Tips */}
      <div>
        <SectionHeader
          title="Safety Tips"
          action={
            <button className="text-sm text-purple-600 dark:text-purple-400 flex items-center">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          }
        />
        <div className="space-y-3">
          {safetyTips.map((tip) => (
            <motion.div
              key={tip.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm cursor-pointer"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => handleTipClick(tip)}
            >
              <div className="flex">
                <div className="mr-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <tip.icon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-base font-medium text-gray-800 dark:text-white">{tip.title}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{tip.duration}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tip.description}</p>
                  <div className="mt-2">
                    <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full">
                      {tip.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* My Courses */}
      <div>
        <SectionHeader title="My Courses" />
        <div className="space-y-3">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm cursor-pointer"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => handleCourseClick(course)}
            >
              <div className="flex">
                <div className="mr-3 w-20 h-14 rounded-lg overflow-hidden">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-800 dark:text-white">{course.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{course.completed}</p>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 dark:bg-purple-500 h-full rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Page Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Safety Trainers</h3>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1 flex items-center">
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              viewMode === "personal"
                ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300"
            }`}
            onClick={() => setViewMode("personal")}
          >
            Personal
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              viewMode === "corporate"
                ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300"
            }`}
            onClick={() => setViewMode("corporate")}
          >
            Corporate
          </button>
        </div>
      </div>

      {/* Trainers Horizontal Scroll */}
      <div className="relative">
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 space-x-4 scrollbar-hide">
          {getTrainersByViewMode().map((trainer) => (
            <motion.div
              key={trainer.id}
              className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm cursor-pointer"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => setSelectedTrainer(trainer)}
            >
              <div className="relative h-32 rounded-t-xl overflow-hidden">
                <img
                  src={trainer.image || "/placeholder.svg"}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black to-transparent">
                  <Badge className="bg-purple-500 text-white hover:bg-purple-600">{trainer.specialty}</Badge>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-base font-medium text-gray-800 dark:text-white">{trainer.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{trainer.shortBio}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex">
                    {Array(trainer.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{trainer.experience}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll indicators for desktop */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-md p-2 hidden md:block">
          <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      {/* AI Insights Toggle */}
      <div className="flex items-center justify-between mb-4 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
            <BrainCircuit className="h-5 w-5 text-purple-500 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-800 dark:text-white">AI Safety Insights</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Personalized safety recommendations based on your activity
            </p>
          </div>
        </div>
        <div className="relative inline-block w-12 h-6 align-middle select-none">
          <input
            type="checkbox"
            id="toggle-ai"
            className="sr-only"
            checked={showAIInsights}
            onChange={() => setShowAIInsights(!showAIInsights)}
          />
          <label
            htmlFor="toggle-ai"
            className={`block w-full h-full rounded-full cursor-pointer transition-colors ${
              showAIInsights ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 shadow transform transition-transform duration-300 ${
                showAIInsights ? "translate-x-6" : ""
              }`}
            ></span>
          </label>
        </div>
      </div>

      {/* Resources Section */}
      <div>
        <SectionHeader title="Helpful Resources" />
        <div className="space-y-3">
          {resources.map((resource, index) => (
            <ResourceCard
              key={index}
              title={resource.title}
              description={resource.description}
              icon={resource.icon}
              url={resource.url}
              bgColor={resource.bgColor}
              darkBgColor={resource.darkBgColor}
              textColor={resource.textColor}
              darkTextColor={resource.darkTextColor}
            />
          ))}
        </div>
      </div>

      {/* AI Insights Section (conditionally displayed) */}
      {showAIInsights && (
        <div>
          <SectionHeader title="Personalized AI Insights" />
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-purple-200 dark:border-purple-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start mb-4">
              <div className="mr-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <BrainCircuit className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-800 dark:text-white mb-1">Based on your activity</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  We've noticed you've been checking in frequently from urban areas. Consider exploring these safety
                  resources:
                </p>
              </div>
            </div>

            <div className="space-y-3 ml-13">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="min-w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2">
                    <BookOpen className="h-3 w-3 text-green-500 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Urban Navigation & Awareness</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Recommended course for your travel patterns
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="min-w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                    <Video className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Walking Alone at Night</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Safety tip relevant to your evening activity
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="min-w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mr-2">
                    <Database className="h-3 w-3 text-orange-500 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Digital Privacy & Security</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Protect your information while on public networks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modals */}
      {selectedTip && <SafetyTipModal isOpen={!!selectedTip} onClose={() => setSelectedTip(null)} tip={selectedTip} />}

      {selectedCourse && (
        <CourseModal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} course={selectedCourse} />
      )}

      {/* Trainer Modal */}
      <AnimatePresence>
        {selectedTrainer && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-xl shadow-lg overflow-hidden"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="relative h-48">
                <img
                  src={selectedTrainer.image || "/placeholder.svg"}
                  alt={selectedTrainer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                  <div className="p-4">
                    <Badge className="mb-2 bg-purple-500 text-white hover:bg-purple-600">
                      {selectedTrainer.specialty}
                    </Badge>
                    <h3 className="text-xl font-bold text-white">{selectedTrainer.name}</h3>
                    <p className="text-white text-opacity-90">{selectedTrainer.experience} Experience</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTrainer(null)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {Array(selectedTrainer.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{selectedTrainer.rating}.0 Rating</span>
                </div>

                <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">About</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedTrainer.fullBio}</p>

                <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Credentials</h4>
                <ul className="list-disc pl-5 mb-4 text-gray-600 dark:text-gray-300">
                  {selectedTrainer.credentials.map((credential, index) => (
                    <li key={index}>{credential}</li>
                  ))}
                </ul>

                <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Courses</h4>
                <div className="space-y-2 mb-4">
                  {selectedTrainer.courses.map((course, index) => (
                    <div
                      key={index}
                      className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex justify-between items-center"
                    >
                      <span className="text-gray-800 dark:text-gray-200">{course}</span>
                      <ChevronRight className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    </div>
                  ))}
                </div>

                {/* Corporate-specific information */}
                {selectedTrainer.corporate && (
                  <>
                    <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Corporate Services</h4>
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clients</h5>
                      <ul className="list-disc pl-5 mb-2 text-gray-600 dark:text-gray-300">
                        {selectedTrainer.corporate.clients.map((client, index) => (
                          <li key={index}>{client}</li>
                        ))}
                      </ul>

                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Services</h5>
                      <ul className="list-disc pl-5 mb-2 text-gray-600 dark:text-gray-300">
                        {selectedTrainer.corporate.services.map((service, index) => (
                          <li key={index}>{service}</li>
                        ))}
                      </ul>

                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg mt-2">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Pricing</h5>
                        <p className="text-gray-600 dark:text-gray-300">{selectedTrainer.corporate.pricing}</p>
                      </div>
                    </div>
                  </>
                )}

                <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Contact</h4>
                <p className="text-purple-600 dark:text-purple-400 mb-4">{selectedTrainer.contact}</p>

                <div className="flex space-x-3">
                  <Button className="flex-1">
                    {viewMode === "personal" ? "Book Session" : "Request Consultation"}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    {viewMode === "personal" ? "View Schedule" : "View Services"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  )
}

