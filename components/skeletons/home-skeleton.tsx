import { PageContainer } from "@/components/layout/page-container"
import { Skeleton } from "@/components/ui/skeleton"

export function HomeSkeleton() {
  return (
    <PageContainer>
      {/* Greeting Skeleton */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Status Card Skeleton */}
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 mx-4">
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>

      {/* Safety Insights Skeleton */}
      <div className="mt-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center"
            >
              <Skeleton className="w-10 h-10 rounded-full mb-2" />
              <Skeleton className="h-8 w-8 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Feeling Status Skeleton */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex justify-between">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-24 rounded-full" />
          ))}
        </div>
      </div>

      {/* Safety Features Skeleton */}
      <div className="mt-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center"
            >
              <Skeleton className="w-10 h-10 rounded-full mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Communication Tools Skeleton */}
      <div className="mt-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center"
            >
              <Skeleton className="w-10 h-10 rounded-full mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="mt-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center">
                <Skeleton className="w-10 h-10 rounded-full mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}

