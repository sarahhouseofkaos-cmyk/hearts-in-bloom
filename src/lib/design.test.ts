import { describe, expect, it } from 'vitest'
import {
  atmosphereFromParam,
  createDesignSummary,
  designEnquiryPath,
  emptyDesign,
  getDesignRecommendation,
  type DesignSelection,
} from './design'

const base: DesignSelection = {
  ...emptyDesign,
  atmosphere: 'romantic',
  styleSlug: 'classic-ivory',
  styling: 'signature',
  coverage: 'Top half only',
  seating: 'none',
  coordinating: 'no',
  moment: 'Ceremony',
}

describe('Design your heart recommendations', () => {
  it('recommends The Classic for a signature arch without chairs', () => {
    expect(getDesignRecommendation(base)).toMatchObject({ name: 'The Classic', price: 'From £400', packageSlug: 'the-classic' })
  })

  it('recommends The Ceremony when a pair of chairs is selected', () => {
    expect(getDesignRecommendation({ ...base, seating: 'pair' })).toMatchObject({ name: 'The Ceremony', packageSlug: 'the-ceremony' })
  })

  it('recommends The Statement for higher-end styling and a pair of chairs', () => {
    expect(getDesignRecommendation({ ...base, styling: 'higher', seating: 'pair' })).toMatchObject({ name: 'The Statement', packageSlug: 'the-statement' })
  })

  it('recommends The Full Look when higher-end styling, chairs and coordinating styling are selected', () => {
    expect(getDesignRecommendation({ ...base, styling: 'higher', seating: 'pair', coordinating: 'yes' })).toMatchObject({ name: 'The Full Look', packageSlug: 'the-full-look' })
  })

  it('keeps fresh flowers and optional extras separately and transparently priced', () => {
    const result = getDesignRecommendation({ ...base, styling: 'fresh', seating: 'pair', coordinating: 'yes' })
    expect(result.price).toBe('£750–£2,000+')
    expect(result.description).toContain('£300 extra')
    expect(result.description).toContain('from £75')
    expect(result.packageSlug).toBeUndefined()
  })

  it('does not force a package onto an individual higher-end arch', () => {
    expect(getDesignRecommendation({ ...base, styling: 'higher' })).toMatchObject({ name: 'Higher-end styled heart arch', price: '£350–£550+' })
  })
})

describe('Design enquiry handoff', () => {
  it('creates a readable summary and preserves choices in the enquiry URL', () => {
    const selection = { ...base, atmosphere: 'dark' as const, styleSlug: 'midnight-plum', styling: 'higher' as const, seating: 'pair' as const, coordinating: 'yes' as const }
    const recommendation = getDesignRecommendation(selection)
    const summary = createDesignSummary(selection, 'Midnight Plum', recommendation)
    expect(summary).toContain('Midnight Plum (Dark Romance)')
    expect(summary).toContain('Higher-end bespoke styling')
    expect(summary).toContain('The Full Look')

    const [path, query] = designEnquiryPath(selection, 'Midnight Plum', recommendation).split('?')
    const params = new URLSearchParams(query)
    expect(path).toBe('/enquire')
    expect(params.get('style')).toBe('midnight-plum')
    expect(params.get('package')).toBe('the-full-look')
    expect(params.get('coverage')).toBe('Top half only')
    expect(params.get('design')).toBe(summary)
    expect(summary.length).toBeLessThan(1000)
  })

  it('accepts only known atmosphere parameters', () => {
    expect(atmosphereFromParam('dark')).toBe('dark')
    expect(atmosphereFromParam('romantic')).toBe('romantic')
    expect(atmosphereFromParam('other')).toBe('')
    expect(atmosphereFromParam(null)).toBe('')
  })
})
