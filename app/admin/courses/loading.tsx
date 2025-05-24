export default function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 h-8 w-1/3 animate-pulse rounded-md bg-gray-200"></div>

      <div className="mb-6 grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 shadow-sm">
            <div className="mb-4 h-40 animate-pulse rounded-md bg-gray-200"></div>
            <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
            <div className="mb-4 h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
            <div className="h-8 w-1/3 animate-pulse rounded-md bg-gray-200"></div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-4 h-6 w-1/4 animate-pulse rounded bg-gray-200"></div>
        <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200"></div>
        <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200"></div>
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  )
}
