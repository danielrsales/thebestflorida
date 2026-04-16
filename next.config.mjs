import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkFrontmatter],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
})

// ─── 301 redirects: legacy root blog posts → /blog/[slug] ────────────────────
// Add all 37 slugs to this array. Pattern: /slug/ → /blog/slug/
const LEGACY_BLOG_SLUGS = [
  'best-accounting-firms-in-orlando-florida-5-trusted-offices-worth-your-time',
  'best-guitar-lessons-in-orlando-florida-top-rated-instructors-schools-you-should-know',
  'best-acupuncture-clinics-in-orlando-florida',
  'top-10-attorneys-in-orlando-florida',
  'top-10-architecture-firms-in-orlando-florida-with-verified-client-feedback',
  'best-english-language-schools-in-orlando-florida',
  'best-residential-bee-removal-services-in-orlando-fl',
  'best-places-to-play-tennis-in-orlando-florida-top-10-courts-tennis-centers',
  'best-ac-installation-hvac-companies-in-orlando-florida',
  'best-gyms-in-orlando-florida-2026-complete-guide',
  'top-10-hair-salons-in-orlando-florida-2026-guide',
  'top-dental-clinics-in-orlando-fl',
  'top-10-martial-arts-schools-in-orlando-fl',
  'top-10-nail-salons-manicure-artists-in-orlando-florida-2026-guide',
  'top-10-shopping-destinations-in-orlando-fl',
  'the-10-best-restaurants-to-experience-in-orlando-florida',
  'top-10-pool-beach-style-clubs-in-orlando-florida',
  'the-10-best-brazilian-churrascarias-premium-steakhouses-in-orlando',
  'the-10-best-soccer-academies-schools-in-orlando-fl-all-ages',
  'the-4-best-main-theme-parks-at-walt-disney-world-orlando-2026-guide',
  'the-10-best-nightclubs-in-orlando-florida',
  'the-10-best-universities-in-florida',
  'the-10-best-tourist-activities-in-orlando',
  'top-10-best-places-to-rent-a-car-in-orlando',
  'best-pool-cleaning-services-in-orlando',
  '10-best-moving-companies-in-orlando-florida',
  '10-best-house-cleaning-services-in-orlando-florida',
  'best-neighborhoods-to-live-in-orlando-florida',
  'best-laundromats-in-orlando-florida',
  '10-best-handyman-services-in-orlando-florida',
  'best-college-admissions-consultants-in-orlando-florida',
  '15-best-wedding-photographers-in-orlando-florida',
  'top-10-best-carpet-cleaning-services-in-orlando-florida',
  'top-10-best-event-venues-in-orlando-florida',
  'top-10-best-daycares-in-orlando-florida',
  'best-car-detailing-services-in-orlando-florida',
  '10-best-auto-repair-shops-mechanics-in-orlando-florida',
]

/** @type {import('next').NextConfig} */
const nextConfig = withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  async redirects() {
    const blogRedirects = LEGACY_BLOG_SLUGS.flatMap((slug) => [
      // handles both /slug/ and /slug (with and without trailing slash)
      {
        source: `/${slug}/`,
        destination: `/blog/${slug}/`,
        permanent: true,
      },
      {
        source: `/${slug}`,
        destination: `/blog/${slug}/`,
        permanent: true,
      },
    ])

    return blogRedirects
  },
})

export default nextConfig
