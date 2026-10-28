import { createContext } from 'react'

/**
 * Collects each page's title, description and structured data while the site is
 * pre-rendered at build time, so the static HTML files carry the right details
 * for search engines and link previews. In the browser there is no provider and
 * pages set these in the document head instead (see PageMeta in Layout.tsx).
 */
export class HeadCollector {
  title?: string
  description?: string
  jsonLd: { id: string; data: object }[] = []

  setPage(title: string, description: string) {
    this.title = title
    this.description = description
  }

  addJsonLd(id: string, data: object) {
    if (!this.jsonLd.some((item) => item.id === id)) this.jsonLd.push({ id, data })
  }
}

export const HeadContext = createContext<HeadCollector | null>(null)
