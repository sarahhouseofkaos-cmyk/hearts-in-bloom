export type Atmosphere = 'romantic' | 'dark'
export type StylingLevel = 'signature' | 'higher' | 'fresh'
export type Seating = 'none' | 'single' | 'pair'
export type YesNo = 'yes' | 'no'

export type DesignSelection = {
  atmosphere: Atmosphere | ''
  styleSlug: string
  styling: StylingLevel | ''
  coverage: string
  seating: Seating | ''
  coordinating: YesNo | ''
  moment: string
}

export type DesignRecommendation = {
  name: string
  price: string
  description: string
  packageSlug?: string
  service: string
}

export const emptyDesign: DesignSelection = {
  atmosphere: '',
  styleSlug: '',
  styling: '',
  coverage: '',
  seating: '',
  coordinating: '',
  moment: '',
}

export function atmosphereFromParam(value: string | null): Atmosphere | '' {
  return value === 'dark' || value === 'romantic' ? value : ''
}

export function getDesignRecommendation(selection: DesignSelection): DesignRecommendation {
  const withChairs = selection.seating !== 'none'
  const service = selection.styling === 'fresh'
    ? withChairs ? 'Heart arch + throne chairs package' : 'Heart arch with fresh flowers'
    : withChairs ? 'Heart arch + throne chairs package' : 'Heart arch with artificial flowers'

  if (selection.styling === 'fresh') {
    const extras = [
      selection.seating === 'single' ? 'A single throne chair is £150 extra.' : '',
      selection.seating === 'pair' ? 'A pair of throne chairs is £300 extra.' : '',
      selection.coordinating === 'yes' ? 'Coordinating styling is available from £75.' : '',
    ].filter(Boolean).join(' ')
    return {
      name: 'Bespoke fresh-flower arch',
      price: '£750–£2,000+',
      description: `Seasonal fresh flowers are quoted individually.${extras ? ` ${extras}` : ''}`,
      service,
    }
  }

  const higher = selection.styling === 'higher'
  const pair = selection.seating === 'pair'
  const coordinating = selection.coordinating === 'yes'

  if (pair && !coordinating) {
    return higher
      ? { name: 'The Statement', price: 'From £650', description: 'A higher-end styled heart arch with a pair of throne chairs.', packageSlug: 'the-statement', service }
      : { name: 'The Ceremony', price: 'From £550', description: 'A pre-dressed heart arch with a pair of throne chairs.', packageSlug: 'the-ceremony', service }
  }

  if (pair && coordinating && higher) {
    return { name: 'The Full Look', price: 'From £750', description: 'A higher-end styled arch, throne chairs and coordinating styling.', packageSlug: 'the-full-look', service }
  }

  if (selection.seating === 'none' && !coordinating && !higher) {
    return { name: 'The Classic', price: 'From £400', description: 'A pre-dressed heart arch with local delivery and set-up.', packageSlug: 'the-classic', service }
  }

  if (selection.seating === 'none' && !coordinating && higher) {
    return { name: 'Higher-end styled heart arch', price: '£350–£550+', description: 'A fuller, more bespoke floral arrangement with set-up.', service }
  }

  const arch = higher ? 'Higher-end styled arch: £350–£550+' : 'The Classic: from £400'
  const chair = selection.seating === 'single' ? 'Single throne chair: £150' : pair ? 'Pair of throne chairs: £300' : ''
  const styling = coordinating ? 'Coordinating styling: from £75' : ''
  return {
    name: higher ? 'A tailored higher-end setting' : 'A tailored signature setting',
    price: [arch, chair, styling].filter(Boolean).join(' · '),
    description: 'Sarah will bring these individually priced elements together in one personal quotation.',
    service,
  }
}

export function createDesignSummary(selection: DesignSelection, lookName: string, recommendation: DesignRecommendation) {
  const styling = {
    signature: 'Signature silk styling',
    higher: 'Higher-end bespoke styling',
    fresh: 'Bespoke fresh flowers',
    '': 'Styling to be discussed',
  }[selection.styling]
  const seating = {
    none: 'No throne chairs',
    single: 'One throne chair',
    pair: 'A pair of throne chairs',
    '': 'Seating to be discussed',
  }[selection.seating]
  const atmosphere = selection.atmosphere === 'dark' ? 'Dark Romance' : 'Romantic'
  const coordinating = selection.coordinating === 'yes' ? 'Coordinating styling included in my ideas' : 'No coordinating styling selected'
  return `My Design your heart choices: ${lookName} (${atmosphere}); ${styling}; ${selection.coverage}; ${seating}; ${selection.moment}; ${coordinating}. Suggested starting point: ${recommendation.name} — ${recommendation.price}. I’d like Sarah to advise on the final design and quotation.`
}

export function designEnquiryPath(selection: DesignSelection, lookName: string, recommendation: DesignRecommendation) {
  const params = new URLSearchParams()
  params.set('style', selection.styleSlug)
  if (recommendation.packageSlug) params.set('package', recommendation.packageSlug)
  params.set('service', recommendation.service)
  params.set('coverage', selection.coverage)
  params.set('design', createDesignSummary(selection, lookName, recommendation))
  return `/enquire?${params.toString()}`
}
