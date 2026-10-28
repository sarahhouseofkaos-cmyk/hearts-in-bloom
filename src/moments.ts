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
  'classic-ivory': ['ceremony', 'portraits'],
  'soft-blush-garden': ['ceremony', 'portraits', 'sweetheart'],
  'lush-ivory-greenery': ['ceremony', 'portraits'],
  'full-blush': ['ceremony', 'sweetheart'],
  'asymmetrical-cascade': ['ceremony', 'portraits'],
  'coastal-pampas': ['ceremony', 'portraits'],
  'dusty-blue-heart': ['ceremony', 'portraits'],
  'teal-noir': ['portraits', 'sweetheart'],
  'midnight-plum': ['ceremony', 'portraits', 'sweetheart'],
  'midnight-blue': ['ceremony', 'portraits', 'sweetheart'],
  'gothic-throne': ['portraits', 'sweetheart'],
  'candlelit-gothic': ['portraits', 'sweetheart'],
}

export const lookPalettes: Record<string, { name: string; value: string }[]> = {
  'classic-ivory': [{ name: 'Ivory', value: '#eee9db' }, { name: 'Rose white', value: '#f7f4ec' }, { name: 'Foliage', value: '#4d5b43' }],
  'soft-blush-garden': [{ name: 'Blush', value: '#d8aeb0' }, { name: 'Ivory', value: '#eee9db' }, { name: 'Garden green', value: '#53634b' }],
  'lush-ivory-greenery': [{ name: 'Soft ivory', value: '#e9e6d8' }, { name: 'Eucalyptus', value: '#7d8c73' }, { name: 'Deep foliage', value: '#354738' }],
  'full-blush': [{ name: 'Rose blush', value: '#d49ca6' }, { name: 'Petal pink', value: '#e8c5c7' }, { name: 'Leaf green', value: '#56634a' }],
  'asymmetrical-cascade': [{ name: 'Cream', value: '#eee7d8' }, { name: 'Muted rose', value: '#b98587' }, { name: 'Trailing green', value: '#415541' }],
  'coastal-pampas': [{ name: 'Pampas', value: '#c8b99d' }, { name: 'Sand', value: '#dfd4bd' }, { name: 'Ivory', value: '#f0eadc' }],
  'dusty-blue-heart': [{ name: 'Dusty blue', value: '#8096a6' }, { name: 'Mist', value: '#b8c3c5' }, { name: 'Muted foliage', value: '#53645d' }],
  'teal-noir': [{ name: 'Teal', value: '#245f62' }, { name: 'Deep green', value: '#243e37' }, { name: 'Noir', value: '#2e292d' }],
  'midnight-plum': [{ name: 'Plum', value: '#5a354e' }, { name: 'Mauve', value: '#967584' }, { name: 'Dark foliage', value: '#303b35' }],
  'midnight-blue': [{ name: 'Midnight', value: '#293c58' }, { name: 'Navy rose', value: '#3e506b' }, { name: 'Cascade green', value: '#35483e' }],
  'gothic-throne': [{ name: 'Ebony', value: '#29272a' }, { name: 'Velvet', value: '#51434d' }, { name: 'Candlelight', value: '#c5a476' }],
  'candlelit-gothic': [{ name: 'Gothic black', value: '#272629' }, { name: 'Oxblood', value: '#683b3b' }, { name: 'Warm candlelight', value: '#d0ad79' }],
}

export const defaultPalette = [{ name: 'Ivory', value: '#eee9db' }, { name: 'Clay', value: '#a76b54' }, { name: 'Foliage', value: '#4d5b43' }]
