import Link from 'next/link'

const services = ['Landscaping', 'House Cleaning', 'HVAC', 'Plumbing', 'Roofing', 'Electrical', 'Pool Cleaning', 'Pest Control']
const cities = ['Orlando', 'Miami', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'Sarasota', 'Naples']

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold">
              <span className="text-orange-500">The</span>
              <span className="text-blue-400">Best</span>
              <span className="text-green-400">Florida</span>
            </span>
            <p className="mt-3 text-sm">
              We handpick the best service companies in Florida.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Top Services</h3>
            <ul className="space-y-2 text-sm">
              {services.map((s) => (
                <li key={s}>
                  <Link href={`/${s.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-white transition">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Top Cities</h3>
            <ul className="space-y-2 text-sm">
              {cities.map((c) => (
                <li key={c}>
                  <Link href={`/landscaping/${c.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-white transition">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/for-pros" className="hover:text-white transition">For Pros</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/quote" className="hover:text-white transition">Get a Quote</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-center">
          © {new Date().getFullYear()} TheBestFlorida. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
