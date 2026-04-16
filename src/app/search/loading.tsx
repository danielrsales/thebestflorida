export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">

      {/* Header bar skeleton */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <div className="h-4 w-4 bg-gray-200 rounded flex-shrink-0" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
          <div className="ml-auto h-4 w-20 bg-gray-200 rounded flex-shrink-0" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar skeleton */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border p-5 space-y-5">
              {/* Filter section */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-100 rounded-lg" />
                </div>
              ))}
              <div className="h-10 bg-gray-200 rounded-lg" />
            </div>
          </aside>

          {/* Cards skeleton */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border p-5 space-y-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="flex gap-1.5 mt-1">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-5 w-16 bg-gray-100 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-50">
                  <div className="h-8 bg-gray-100 rounded-lg flex-1" />
                  <div className="h-8 bg-gray-200 rounded-lg flex-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
