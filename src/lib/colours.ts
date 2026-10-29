/** Colours a couple can choose for their own flower design in Design your heart. */

export type NamedColour = { name: string; value: string }

export const CUSTOM_LOOK_SLUG = 'your-own-colours'
export const MAX_FLOWER_COLOURS = 4

export const flowerColours: NamedColour[] = [
  { name: 'White', value: '#f7f5ef' },
  { name: 'Ivory', value: '#efe6cf' },
  { name: 'Champagne', value: '#e8d3b0' },
  { name: 'Blush', value: '#efc4c4' },
  { name: 'Dusty pink', value: '#d79aa6' },
  { name: 'Hot pink', value: '#d9487a' },
  { name: 'Peach', value: '#f3b78f' },
  { name: 'Coral', value: '#e8735f' },
  { name: 'Burnt orange', value: '#c2602b' },
  { name: 'Mustard', value: '#d4a13a' },
  { name: 'Lemon', value: '#efe08a' },
  { name: 'Sage', value: '#a9b99a' },
  { name: 'Lilac', value: '#c7b2d6' },
  { name: 'Lavender', value: '#9f8cc4' },
  { name: 'Mauve', value: '#a57a92' },
  { name: 'Plum', value: '#6b2f57' },
  { name: 'Burgundy', value: '#7a1f2e' },
  { name: 'Red', value: '#b5172b' },
  { name: 'Dusty blue', value: '#8fa6bd' },
  { name: 'Navy', value: '#27355a' },
  { name: 'Teal', value: '#1f6366' },
  { name: 'Black', value: '#1d1b1f' },
]

export const foliageOptions: NamedColour[] = [
  { name: 'Fresh green', value: '#4f6b3f' },
  { name: 'Eucalyptus', value: '#8ea596' },
  { name: 'Dark green', value: '#2c3f2f' },
  { name: 'Black foliage', value: '#231f26' },
]

export const defaultCustomColours = {
  romantic: ['Blush', 'Ivory', 'Dusty pink'],
  dark: ['Burgundy', 'Plum', 'Black'],
}

export function coloursByName(names: string[]): NamedColour[] {
  return names.map((name) => flowerColours.find((colour) => colour.name === name)).filter((colour): colour is NamedColour => Boolean(colour))
}

/** Joins names as "A", "A & B" or "A, B & C". */
export function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? ''
  return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`
}

/** A short description of a couple's own colours, used as the look name in their enquiry. */
export function describeCustomColours(colours: NamedColour[], foliage: string): string {
  const flowers = joinNames(colours.map((colour) => colour.name))
  const leaves = foliage ? ` with ${foliage.toLowerCase()} foliage` : ''
  return flowers ? `Your own colours: ${flowers}${leaves}` : 'Your own colours'
}

/** True for a value like "#a1b2c3". */
export function isHexColour(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value)
}

/** Lightens (amount > 0) or darkens (amount < 0) a #rrggbb colour. */
export function shade(hex: string, amount: number): string {
  if (!isHexColour(hex)) return hex
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16))
  const mixed = channels.map((channel) => Math.round(amount < 0 ? channel * (1 + amount) : channel + (255 - channel) * amount))
  return `#${mixed.map((channel) => Math.max(0, Math.min(255, channel)).toString(16).padStart(2, '0')).join('')}`
}

/** How often each chosen colour appears, leading colour first. */
export function colourWeights(count: number): number[] {
  return ({ 1: [1], 2: [0.6, 0.4], 3: [0.45, 0.33, 0.22], 4: [0.38, 0.27, 0.2, 0.15] } as Record<number, number[]>)[count] ?? [1]
}

export function pickWeighted(weights: number[], roll: number): number {
  let total = 0
  for (let index = 0; index < weights.length; index += 1) {
    total += weights[index]
    if (roll < total) return index
  }
  return weights.length - 1
}
