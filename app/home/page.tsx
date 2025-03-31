"use client"

import { useState, useEffect } from "react"
import { Shield, Bell, MapPin, Calendar, ChevronRight } from "lucide-react"
import { useProfileData } from "@/hooks/use-profile-data"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileHeader } from "@/components/profile/profile-header"
import { SafetyMetric } from "@/components/safety/safety-metric"
import { EmergencyButton } from "@/components/safety/emergency-button"
import { HomeSkeleton } from "@/components/skeletons/home-skeleton"
import { logWithTimestamp } from "@/lib/utils/debug-utils"

export default function HomePage() {
  // Only fetch profile and safety stats, skip courses for home page
  const { profileData, isLoading, error } = useProfileData({
    includeCourses: false,
    includeActivities: true,
  })

  const [mounted, setMounted] = useState(false)

  // Log component lifecycle
  useEffect(() => {
    logWithTimestamp("HOME-PAGE", "Home page mounted")
    setMounted(true)
    return () => logWithTimestamp("HOME-PAGE", "Home page unmounted")
  }, [])

  // Log when data is loaded
  useEffect(() => {
    if (profileData) {
      logWithTimestamp("HOME-PAGE", "Home page loaded", {
        source: null,
        t: null,
        url: window.location.href,
        referrer: document.referrer,
      })
    }
  }, [profileData])

  // Show loading skeleton while data is loading
  if (isLoading && !profileData) {
    return <HomeSkeleton />
  }

  // Show error state if there's an error and no data
  if (error && !profileData) {
    return (
      <PageContainer title="Home">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Failed to Load Data</h2>
          <p className="text-gray-500 mb-4">We couldn't load your profile information. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </PageContainer>
    )
  }

  // Fallback for SSR
  if (!mounted || !profileData) {
    return <HomeSkeleton />
  }

  return (
    <PageContainer title="Home">
      {/* Profile Header */}
      <ProfileHeader profile={profileData.profile} />

      {/* Safety Status */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Safety Status</h2>
          <Button variant="ghost" size="sm" className="text-sm" asChild>
            <a href="/safety">
              View Details
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SafetyMetric
            title="Days Safe"
            value={profileData.safetyStats.daysSafe}
            icon={<Shield className="h-5 w-5" />}
            color="green"
          />
          <SafetyMetric
            title="Safety Level"
            value={profileData.safetyStats.safetyLevel}
            maxValue={10}
            icon={<Shield className="h-5 w-5" />}
            color="blue"
            showProgress
          />
        </div>
      </section>

      {/* Emergency Button */}
      <section className="mb-6">
        <EmergencyButton />
      </section>

      {/* Recent Activity */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Activity</h2>
          <Button variant="ghost" size="sm" className="text-sm" asChild>
            <a href="/activity">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {profileData.recentActivities && profileData.recentActivities.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {profileData.recentActivities.slice(0, 3).map((activity) => (
                  <li key={activity.id} className="p-4">
                    <div className="flex items-start">
                      <div
                        className={`rounded-full p-2 mr-3 bg-${activity.color || "gray"}-100 dark:bg-${activity.color || "gray"}-900/20`}
                      >
                        {activity.activity_type === "check_in" ? (
                          <MapPin
                            className={`h-5 w-5 text-${activity.color || "gray"}-500 dark:text-${activity.color || "gray"}-400`}
                          />
                        ) : activity.activity_type === "alert" ? (
                          <Bell
                            className={`h-5 w-5 text-${activity.color || "gray"}-500 dark:text-${activity.color || "gray"}-400`}
                          />
                        ) : (
                          <Calendar
                            className={`h-5 w-5 text-${activity.color || "gray"}-500 dark:text-${activity.color || "gray"}-400`}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(activity.created_at).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                          {activity.location ? ` • ${activity.location}` : ""}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">No recent activity</div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Button asChild className="h-auto py-6 flex flex-col items-center justify-center">
            <a href="/check-in">
              <MapPin className="h-6 w-6 mb-2" />
              <span>Check In</span>
            </a>
          </Button>
          <Button asChild variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
            <a href="/contacts">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 mb-2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Contacts</span>
            </a>
          </Button>
        </div>
      </section>
    </PageContainer>
  )
}

