export type WeddingMoment = 'ceremony' | 'portraits' | 'sweetheart'

export const weddingMoments: {
  slug: WeddingMoment
  label: string
  designLabel: string
  title: string
  copy: string
}[] = [
  {
    slug: 'ceremony',
    label: 'The ceremony',
    designLabel: 'Ceremony',
    title: 'Frame the promises.',
    copy: 'Begin with the backdrop around your vows, your walk back down the aisle and the first photographs together.',
  },
  {
    slug: 'portraits',
    label: 'The portraits',
    designLabel: 'Portraits',
    title: 'Give your photographs a place to begin.',
    copy: 'Choose a focal setting for the two of you, from soft daylight romance to atmospheric after-dark portraits.',
  },
  {
    slug: 'sweetheart',
    label: 'The sweetheart table',
    designLabel: 'Sweetheart table',
    title: 'Make your place at the table feel special.',
    copy: 'Pair your chosen look with statement seating and thoughtful details around the table you share.',
  },
]

export const lookMoments: Record<string, WeddingMoment[]> = {
  'country-house-ivory': ['ceremony', 'portraits'],
  'garden-blush': ['ceremony', 'portraits'],
  'pink-hydrangea': ['ceremony', 'portraits', 'sweetheart'],
  'white-hydrangea': ['ceremony', 'portraits'],
  'candlelit-blush': ['ceremony', 'portraits', 'sweetheart'],
  'rose-romance': ['ceremony', 'portraits'],
  'dusty-blue-heart': ['ceremony', 'portraits'],
  'teal-noir': ['portraits', 'sweetheart'],
  'midnight-plum': ['ceremony', 'portraits', 'sweetheart'],
  'midnight-blue': ['ceremony', 'portraits', 'sweetheart'],
  'gothic-throne': ['portraits', 'sweetheart'],
  'candlelit-gothic': ['portraits', 'sweetheart'],
}

export const lookPalettes: Record<string, { name: string; value: string }[]> = {
  'country-house-ivory': [{ name: 'Ivory', value: '#eee9db' }, { name: 'Eucalyptus', value: '#7d8c73' }, { name: 'White blossom', value: '#f6f3ec' }],
  'garden-blush': [{ name: 'Blush', value: '#e3b3b5' }, { name: 'Ivory', value: '#eee9db' }, { name: 'Eucalyptus', value: '#7d8c73' }],
  'pink-hydrangea': [{ name: 'Hydrangea pink', value: '#e7a9bc' }, { name: 'Rose pink', value: '#d98c9f' }, { name: 'Leaf green', value: '#3f5a3a' }],
  'white-hydrangea': [{ name: 'White', value: '#f5f3ee' }, { name: 'Ivory', value: '#eee9db' }, { name: 'Leaf green', value: '#3f5a3a' }],
  'candlelit-blush': [{ name: 'White', value: '#f5f3ee' }, { name: 'Blush', value: '#e3b3b5' }, { name: 'Candlelight', value: '#d0ad79' }],
  'rose-romance': [{ name: 'Rose red', value: '#8e2a33' }, { name: 'Blush', value: '#e2b4b4' }, { name: 'Ivory', value: '#eee9db' }],
  'dusty-blue-heart': [{ name: 'Dusty blue', value: '#8096a6' }, { name: 'Mist', value: '#b8c3c5' }, { name: 'Muted foliage', value: '#53645d' }],
  'teal-noir': [{ name: 'Teal', value: '#245f62' }, { name: 'Deep green', value: '#243e37' }, { name: 'Noir', value: '#2e292d' }],
  'midnight-plum': [{ name: 'Plum', value: '#5a354e' }, { name: 'Mauve', value: '#967584' }, { name: 'Dark foliage', value: '#303b35' }],
  'midnight-blue': [{ name: 'Midnight', value: '#293c58' }, { name: 'Navy rose', value: '#3e506b' }, { name: 'Cascade green', value: '#35483e' }],
  'gothic-throne': [{ name: 'Ebony', value: '#29272a' }, { name: 'Velvet', value: '#51434d' }, { name: 'Candlelight', value: '#c5a476' }],
  'candlelit-gothic': [{ name: 'Gothic black', value: '#272629' }, { name: 'Oxblood', value: '#683b3b' }, { name: 'Warm candlelight', value: '#d0ad79' }],
}

export const defaultPalette = [{ name: 'Ivory', value: '#eee9db' }, { name: 'Clay', value: '#a76b54' }, { name: 'Foliage', value: '#4d5b43' }]
