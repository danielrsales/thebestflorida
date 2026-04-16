// Required for @next/mdx with App Router.
// Provides a global component map for all .mdx files rendered as pages.
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components }
}
