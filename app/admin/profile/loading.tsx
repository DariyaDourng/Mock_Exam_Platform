export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Avatar Skeleton */}
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse"></div>
        </div>

        {/* Name Field Skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Email Field Skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Button Skeleton */}
        <div className="flex justify-end">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}