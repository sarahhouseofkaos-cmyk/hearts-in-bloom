/**
 * The supplied flower photographs (public/images/flowers) and how a couple's
 * chosen colours are matched to them for the "Your own colours" arch preview.
 */
import { isHexColour } from './colours'

export type BloomName = 'ivory-rose' | 'blush-rose' | 'burgundy-rose' | 'peach-ranunculus' | 'white-hydrangea' | 'lilac-hydrangea'
export type FoliageName = 'eucalyptus' | 'ruscus'

/** Each supplied bloom with its measured average colour and its relative size on the arch. */
export const BLOOMS: { name: BloomName; colour: string; scale: number; hydrangea: boolean }[] = [
  { name: 'ivory-rose', colour: '#d4cdbb', scale: 1, hydrangea: false },
  { name: 'blush-rose', colour: '#d4969c', scale: 1, hydrangea: false },
  { name: 'burgundy-rose', colour: '#470917', scale: 1, hydrangea: false },
  { name: 'peach-ranunculus', colour: '#ea9168', scale: 0.9, hydrangea: false },
  { name: 'white-hydrangea', colour: '#cfcdba', scale: 1.25, hydrangea: true },
  { name: 'lilac-hydrangea', colour: '#a587a4', scale: 1.25, hydrangea: true },
]

/**
 * Named colours whose real flowers are in the supplied set, so they are shown
 * exactly as photographed. Any other colour recolours the ivory rose and white
 * hydrangea photographs.
 */
const NATURAL: Record<string, BloomName[]> = {
  White: ['ivory-rose', 'white-hydrangea'],
  Ivory: ['ivory-rose', 'white-hydrangea'],
  Champagne: ['ivory-rose', 'peach-ranunculus'],
  Blush: ['blush-rose'],
  'Dusty pink': ['blush-rose'],
  Peach: ['peach-ranunculus'],
  Coral: ['peach-ranunculus'],
  Burgundy: ['burgundy-rose'],
  Red: ['burgundy-rose'],
  Plum: ['burgundy-rose'],
  Lilac: ['lilac-hydrangea'],
  Lavender: ['lilac-hydrangea'],
  Mauve: ['lilac-hydrangea'],
}

/** The blooms used for a colour, and whether they need recolouring to reach it. */
export function bloomsFor(name: string, value: string): { blooms: BloomName[]; tint: string | null } {
  const natural = NATURAL[name]
  if (natural) return { blooms: natural, tint: null }
  return { blooms: ['ivory-rose', 'white-hydrangea'], tint: isHexColour(value) ? value : null }
}

/** Foliage photographs for each foliage choice, and how they are darkened if at all. */
export function foliageFor(name: string): { kinds: FoliageName[]; darken: number } {
  switch (name) {
    case 'Fresh green': return { kinds: ['ruscus', 'ruscus', 'eucalyptus'], darken: 0 }
    case 'Dark green': return { kinds: ['ruscus', 'eucalyptus'], darken: 0.45 }
    case 'Black foliage': return { kinds: ['ruscus', 'eucalyptus'], darken: 0.82 }
    default: return { kinds: ['eucalyptus', 'eucalyptus', 'ruscus'], darken: 0 }
  }
}

/**
 * A colour matrix that recolours a near-white flower photograph to `hex`,
 * keeping its real petal shading. `base` is the photograph's average colour.
 */
export function recolourMatrix(hex: string, base: string): string {
  const read = (colour: string) => [1, 3, 5].map((index) => parseInt(colour.slice(index, index + 2), 16) / 255)
  const [r, g, b] = read(hex)
  const [br, bg, bb] = read(base)
  // Very dark shades get a little light back so petals still read.
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  const lift = Math.max(0, 0.18 - luminance) * 0.7
  const scale = (target: number, source: number) => Math.min(2.2, (target + lift) / Math.max(source, 0.05))
  return [`${scale(r, br)} 0 0 0 0`, `0 ${scale(g, bg)} 0 0 0`, `0 0 ${scale(b, bb)} 0 0`, '0 0 0 1 0'].join(' ')
}
