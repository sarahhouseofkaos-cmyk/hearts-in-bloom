import { asset } from './lib/asset'

export type CollectionItem = {
  slug: string
  name: string
  description: string
  image: string
  category: 'romantic' | 'dark'
  source: 'Hearts in Bloom' | 'Styling inspiration'
  /** Settings (thrones, tables) rather than heart arches. */
  kind?: 'setting'
}

export const collection: CollectionItem[] = [
  {
    slug: 'country-house-ivory',
    name: 'Country House Ivory',
    description: 'Ivory roses, eucalyptus and trailing white blossom for an elegant lawn ceremony.',
    image: asset('/images/arch-country-house-ivory.webp'),
    category: 'romantic',
    source: 'Hearts in Bloom',
  },
  {
    slug: 'garden-blush',
    name: 'Garden Blush',
    description: 'Blush and ivory roses woven with soft eucalyptus, made for garden ceremonies.',
    image: asset('/images/arch-garden-blush.webp'),
    category: 'romantic',
    source: 'Hearts in Bloom',
  },
  {
    slug: 'pink-hydrangea',
    name: 'Pink Hydrangea',
    description: 'Full pink hydrangeas and roses for a lavish, romantic statement.',
    image: asset('/images/arch-pink-hydrangea.webp'),
    category: 'romantic',
    source: 'Hearts in Bloom',
  },
  {
    slug: 'white-hydrangea',
    name: 'White Hydrangea',
    description: 'Crisp white hydrangeas and roses: bright, classic and timeless.',
    image: asset('/images/arch-white-hydrangea.webp'),
    category: 'romantic',
    source: 'Hearts in Bloom',
  },
  {
    slug: 'candlelit-blush',
    name: 'Candlelit Blush',
    description: 'White hydrangeas with soft blush roses, beautiful by candlelight.',
    image: asset('/images/arch-candlelit-blush.webp'),
    category: 'romantic',
    source: 'Hearts in Bloom',
  },
  {
    slug: 'rose-romance',
    name: 'Rose Romance',
    description: 'Deep red, blush and ivory roses with soft greenery for a rich, classically romantic ceremony.',
    image: asset('/images/romantic-heart-arch.webp'),
    category: 'romantic',
    source: 'Hearts in Bloom',
  },
  {
    slug: 'dusty-blue-heart',
    name: 'Dusty Blue Heart',
    description: 'Soft dusty blue roses and muted foliage for a cool, atmospheric look.',
    image: asset('/images/dusty-blue-heart.webp'),
    category: 'dark',
    source: 'Hearts in Bloom',
  },
  {
    slug: 'teal-noir',
    name: 'Teal Noir',
    description: 'Rich teal roses with deep green foliage for a jewel-toned, dramatic statement.',
    image: asset('/images/teal-noir.webp'),
    category: 'dark',
    source: 'Hearts in Bloom',
  },
  {
    slug: 'midnight-plum',
    name: 'Midnight Plum',
    description: 'Deep plum, mauve and dark foliage for a classically romantic, moody palette.',
    image: asset('/images/midnight-plum.webp'),
    category: 'dark',
    source: 'Hearts in Bloom',
  },
  {
    slug: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Deep navy roses and cascading foliage for a rich, atmospheric celebration.',
    image: asset('/images/midnight-blue.webp'),
    category: 'dark',
    source: 'Hearts in Bloom',
  },
  {
    slug: 'dusky-rose',
    name: 'Dusky Rose',
    description: 'Mauve-pink roses and dahlias on black foliage: romantic, moody and soft.',
    image: asset('/images/arch-dusky-rose.webp'),
    category: 'dark',
    source: 'Hearts in Bloom',
  },
  {
    slug: 'crimson-noir',
    name: 'Crimson Noir',
    description: 'Deep red and black roses with trailing purple foliage for real gothic drama.',
    image: asset('/images/arch-crimson-noir.webp'),
    category: 'dark',
    source: 'Hearts in Bloom',
  },
  {
    slug: 'gothic-throne',
    name: 'Gothic Throne',
    description: 'Ornate black throne seating with carved detail for a dramatic, regal setting.',
    image: asset('/images/gothic-throne-detail.webp'),
    category: 'dark',
    source: 'Hearts in Bloom',
    kind: 'setting',
  },
  {
    slug: 'candlelit-gothic',
    name: 'Candlelit Gothic',
    description: 'Gothic throne chairs, soft candlelight and dark florals for an intimate statement.',
    image: asset('/images/gothic-fireplace.webp'),
    category: 'dark',
    source: 'Hearts in Bloom',
    kind: 'setting',
  },
]

export const packages = [
  { name: 'The Classic', slug: 'the-classic', price: 'From £400', description: 'Pre-dressed heart arch with local delivery and set-up.', detail: 'A beautiful focal point, simply done.', arch: 'Pre-dressed silk', chairs: 'Add a pair for £300', coordinating: 'Add from £75', bestFor: 'A single, beautiful focal point' },
  { name: 'The Ceremony', slug: 'the-ceremony', price: 'From £550', description: 'Pre-dressed heart arch with a pair of throne chairs.', detail: 'For vows, portraits and your sweetheart table.', arch: 'Pre-dressed silk', chairs: 'Pair included', coordinating: 'Add from £75', bestFor: 'Vows, portraits and sweetheart tables' },
  { name: 'The Statement', slug: 'the-statement', price: 'From £650', description: 'Higher-end styled heart arch with a pair of throne chairs.', detail: 'A fuller, more bespoke floral arrangement.', arch: 'Higher-end bespoke', chairs: 'Pair included', coordinating: 'Add from £75', bestFor: 'A fuller floral statement' },
  { name: 'The Full Look', slug: 'the-full-look', price: 'From £750', description: 'Higher-end styled arch, throne chairs and coordinating styling.', detail: 'A cohesive setting with the finishing details included.', arch: 'Higher-end bespoke', chairs: 'Pair included', coordinating: 'Included', bestFor: 'A cohesive, fully finished setting' },
]

export const individualPrices = [
  { group: 'Signature Heart Arch', name: 'Basic arch frame (undressed)', price: '£150' },
  { group: 'Signature Heart Arch', name: 'Pre-dressed floral (silk style)', price: '£250' },
  { group: 'Signature Heart Arch', name: 'Higher-end styled + set-up', price: '£350–£550+' },
  { group: 'Signature Heart Arch', name: 'Bespoke fresh-flower arch', price: '£750–£2,000+' },
  { group: 'Throne Chairs & Styling', name: 'Throne chair (single)', price: '£150' },
  { group: 'Throne Chairs & Styling', name: 'Pair of throne chairs', price: '£300' },
  { group: 'Throne Chairs & Styling', name: 'Coordinating styling', price: 'From £75' },
]

export const faqs = [
  { question: 'Is delivery included?', answer: 'Delivery, set-up and collection are included within approximately 40 miles of Newcastle upon Tyne. Further travel is quoted separately.' },
  { question: 'Can you match our wedding colours?', answer: 'Yes. Every look can be tailored to your palette, venue and vision. Share your ideas or inspiration when you enquire and Sarah will recommend a suitable styling direction.' },
  { question: 'How do we secure our date?', answer: 'After your personal quotation, a 30% deposit secures your booking. The remaining balance is due no later than 14 days before your event.' },
  { question: 'Do you offer fresh flowers?', answer: 'Yes. Bespoke fresh-flower arches are available alongside the signature silk styling. Fresh-flower designs are quoted individually according to your chosen flowers, coverage and season.' },
  { question: 'Can we hire the arch without flowers?', answer: 'Yes. The undressed heart arch frame is available on its own, or you can choose pre-dressed, higher-end or fresh-flower styling.' },
  { question: 'What access does the venue need to provide?', answer: 'Your venue must allow our team access for the agreed setup and collection. Please share parking, stairs, lift, level-access and ground-condition details in advance so we can plan safely.' },
  { question: 'Can the arch be used outdoors?', answer: 'Yes, but it is not designed for extreme weather. Consider high winds, heavy rain and ground conditions, and arrange an indoor alternative with your venue. You are responsible for deciding whether conditions are suitable on the day.' },
  { question: 'When is the final balance due?', answer: 'The remaining balance is due no later than 14 days before your event. Your booking is confirmed once the 30% deposit and written acceptance of the Terms have been received.' },
  { question: 'What if we need to cancel?', answer: 'More than 60 days before, the deposit is non-refundable and any balance paid is refunded. At 30–60 days, 50% of the total hire fee is payable. Less than 30 days before, the full fee is payable. See the Terms for full details.' },
]

export const socialLinks = {
  instagram: 'https://www.instagram.com/heartsinbloom.uk/',
  pinterest: 'https://uk.pinterest.com/sarahheartsinbloom/',
  facebook: 'https://www.facebook.com/HeartsInBloomUK',
}

export const email = 'hello@heartsinbloom.co.uk'

/** Throne chair styles available to hire. Image paths are public-folder paths (wrap with asset()). */
export const thrones = [
  { name: 'Gold', copy: 'Carved gold with black velvet, warm and regal.', image: '/images/throne-gold-garden.webp', alt: 'A pair of carved gold throne chairs with black velvet and lion-carved arms on a garden lawn' },
  { name: 'Gothic black', copy: 'Ornate black thrones for Dark Romance settings.', image: '/images/throne-black-garden.webp', alt: 'A pair of ornate gothic black throne chairs with lion-carved arms on a garden lawn' },
  { name: 'White', copy: 'Carved ivory-white thrones, light and elegant.', image: '/images/throne-white-garden.webp', alt: 'A pair of carved white throne chairs with lion-carved arms in front of a country house' },
  { name: 'The crown pair', copy: 'Our one-of-a-kind gilded pair with crown tops.', image: '/images/throne-crown-garden.webp', alt: 'A unique pair of gilded crown-topped throne chairs with damask upholstery in a garden' },
]
