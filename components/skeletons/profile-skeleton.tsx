import { PageContainer } from "@/components/layout/page-container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <PageContainer title="My Profile">
      {/* Profile Header Skeleton */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-teal-400 text-white shadow-lg p-6">
        <div className="relative z-10 flex flex-col sm:flex-row items-center">
          <div className="relative mb-4 sm:mb-0 sm:mr-6">
            <Skeleton className="w-24 h-24 rounded-full bg-white bg-opacity-20" />
          </div>

          <div className="text-center sm:text-left">
            <Skeleton className="h-8 w-48 bg-white bg-opacity-20 mb-2" />
            <Skeleton className="h-4 w-32 bg-white bg-opacity-20 mb-2" />
            <div className="flex items-center justify-center sm:justify-start mt-2">
              <Skeleton className="h-4 w-20 bg-white bg-opacity-20 mr-2" />
              <Skeleton className="h-4 w-24 bg-white bg-opacity-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content Skeleton */}
      <Tabs defaultValue="personal" className="mt-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="safety">Safety Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={i > 5 ? "md:col-span-2" : ""}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-5 mr-3" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-5" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-5 mr-2" />
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-24 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-l-2 border-gray-300 pl-4 py-2">
                  <Skeleton className="h-5 w-48 mb-1" />
                  <Skeleton className="h-4 w-64" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                  <Skeleton className="h-8 w-12 mx-auto mb-1" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}

