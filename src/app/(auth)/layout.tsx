export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Minimal header */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <a href="/" className="text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors">
            TheBestFlorida
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="text-center text-xs text-gray-400 py-6">
        © {new Date().getFullYear()} TheBestFlorida. All rights reserved.
      </footer>
    </div>
  )
}
