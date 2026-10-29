import { useId } from 'react'
import { asset } from '../lib/asset'
import { colourWeights, isHexColour, pickWeighted, type NamedColour } from '../lib/colours'

/*
 * Draws flowers along Hearts in Bloom's bare heart arch photo in a couple's own
 * colours. The two halves below trace the arch frame in the photo's own pixels
 * (896 × 1152), from the dip at the top of the heart down to each foot.
 */
const WIDTH = 896
const HEIGHT = 1152
const HALVES: [number, number][][] = [
  [[445, 445], [421, 390], [388, 340], [340, 301], [280, 277], [218, 280], [158, 308], [109, 353], [75, 408], [61, 467], [65, 535], [78, 610], [100, 690], [128, 780], [157, 870], [180, 950], [195, 1030]],
  [[448, 445], [471, 392], [507, 341], [555, 301], [612, 277], [672, 282], [730, 310], [778, 355], [808, 411], [820, 470], [814, 540], [799, 615], [775, 695], [748, 785], [719, 875], [695, 955], [680, 1030]],
]

/** How far down each half the flowers reach for each coverage choice. */
const coverageReach: Record<string, number> = {
  'Top half only': 0.48,
  'Fuller top': 0.67,
  'Full arch': 1,
}

type Flower = { x: number; y: number; r: number; rotate: number; roll: number; t: number; kind: 'rose' | 'hydrangea'; variant: number }
type Leaf = { x: number; y: number; length: number; rotate: number; tone: number; t: number; variant: number }
type Filler = { x: number; y: number; r: number; t: number }

/** Small seeded random generator, so the arrangement is the same every time. */
function random(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function pointAt(path: [number, number][], fraction: number) {
  const lengths = path.slice(1).map((point, index) => Math.hypot(point[0] - path[index][0], point[1] - path[index][1]))
  const total = lengths.reduce((sum, value) => sum + value, 0)
  let distance = fraction * total
  for (let index = 0; index < lengths.length; index += 1) {
    if (distance <= lengths[index] || index === lengths.length - 1) {
      const local = Math.min(1, distance / lengths[index])
      const [x1, y1] = path[index]
      const [x2, y2] = path[index + 1]
      const angle = Math.atan2(y2 - y1, x2 - x1)
      return { x: x1 + (x2 - x1) * local, y: y1 + (y2 - y1) * local, angle, total }
    }
    distance -= lengths[index]
  }
  return { x: path[0][0], y: path[0][1], angle: 0, total }
}

function buildArrangement() {
  const next = random(20261029)
  const spread = () => (next() + next() - 1)
  const flowers: Flower[] = []
  const leaves: Leaf[] = []
  const fillers: Filler[] = []
  for (const half of HALVES) {
    const { total } = pointAt(half, 0)
    const steps = Math.round(total / 10)
    for (let step = 0; step <= steps; step += 1) {
      const t = step / steps
      const { x, y, angle } = pointAt(half, t)
      const normal = angle + Math.PI / 2
      const top = t < 0.5
      const width = top ? 40 : 24 - t * 8
      for (let index = 0; index < 3; index += 1) {
        const offset = spread() * width * 1.75
        leaves.push({ x: x + Math.cos(normal) * offset, y: y + Math.sin(normal) * offset, length: (top ? 34 : 26) + next() * 24, rotate: (angle * 180) / Math.PI + spread() * 80 + (index % 2 ? 180 : 0), tone: next(), t, variant: Math.floor(next() * 4) })
      }
      const count = top ? (next() < 0.7 ? 2 : 1) : next() < 0.62 ? 1 : 0
      for (let index = 0; index < count; index += 1) {
        const offset = spread() * width
        const size = top ? 15 + next() * 20 : Math.max(9, 17 - t * 6 + next() * 9)
        const kind = top && next() < 0.24 ? 'hydrangea' : 'rose'
        flowers.push({ x: x + Math.cos(normal) * offset, y: y + Math.sin(normal) * offset, r: kind === 'hydrangea' ? size * 1.2 : size, rotate: next() * 360, roll: next(), t, kind, variant: Math.floor(next() * 4) })
      }
      if (next() < 0.5) {
        const offset = spread() * width * 1.3
        fillers.push({ x: x + Math.cos(normal) * offset, y: y + Math.sin(normal) * offset, r: 2.6 + next() * 1.8, t })
      }
    }
  }
  flowers.sort((a, b) => b.r - a.r)
  return { flowers, leaves, fillers }
}

const arrangement = buildArrangement()

/* Roses, hydrangeas and foliage rendered in greyscale (see scripts/flowers/) so they can be tinted any colour. */
const texture = (name: string) => asset(`/images/flowers/${name}.webp`)
const ROSES = [1, 2, 3, 4].map((n) => texture(`rose-${n}`))
const HYDRANGEAS = [1, 2, 1, 2].map((n) => texture(`hydrangea-${n}`))
const SPRIGS = [1, 2, 3, 4].map((n) => texture(`sprig-${n}`))

/** A colour filter that tints a greyscale photo to the given colour, keeping its real shading. */
function tintMatrix(hex: string) {
  const [r, g, b] = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
  // Very dark shades (black, navy) get a little extra light so real petal and leaf detail still shows.
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  const boost = Math.max(0, 0.2 - luminance) * 0.75
  const [cr, cg, cb] = [r, g, b].map((channel) => channel * 0.86 + boost)
  const lift = 0.14
  return [`${cr} 0 0 0 ${r * lift}`, `0 ${cg} 0 0 ${g * lift}`, `0 0 ${cb} 0 ${b * lift}`, '0 0 0 1 0'].join(' ')
}

/** Shrinks items towards the end of the chosen coverage so it tapers naturally. */
function taper(t: number, reach: number) {
  if (t > reach) return 0
  return t > reach - 0.06 ? 0.55 + ((reach - t) / 0.06) * 0.45 : 1
}

export default function ColourArch({ colours, foliage, coverage, className = '', label }: { colours: NamedColour[]; foliage: string; coverage: string; className?: string; label?: string }) {
  const reach = coverageReach[coverage] ?? coverageReach['Fuller top']
  const weights = colourWeights(Math.max(1, colours.length))
  const palette = colours.length ? colours.map((colour) => colour.value) : ['#efe6cf']
  const leafColour = isHexColour(foliage) ? foliage : '#4f6b3f'
  const id = `colour-arch-${useId().replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <div className={`colour-arch ${className}`} role="img" aria-label={label ?? 'Preview of the heart arch dressed in your chosen colours'}>
      <img src={asset('/images/arch-bare.webp')} alt="" />
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <filter id={`${id}-leaf`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={tintMatrix(leafColour)} /></filter>
          {palette.map((value, index) => (
            <filter key={index} id={`${id}-c${index}`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={tintMatrix(isHexColour(value) ? value : '#efe6cf')} /></filter>
          ))}
          <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="1" dy="5" stdDeviation="6" floodColor="#1d140f" floodOpacity="0.38" /></filter>
        </defs>
        <g filter={`url(#${id}-shadow)`}>
        <g filter={`url(#${id}-leaf)`}>
          {arrangement.leaves.map((leaf, index) => {
            const scale = taper(leaf.t, reach + 0.03)
            if (!scale) return null
            const size = leaf.length * 2.1 * scale
            return <image key={index} href={SPRIGS[leaf.variant]} x={-size / 2} y={-size / 2} width={size} height={size} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rotate})`} preserveAspectRatio="xMidYMid meet" />
          })}
        </g>
        </g>
        <g filter={`url(#${id}-shadow)`}>
          {arrangement.flowers.map((flower, index) => {
            const scale = taper(flower.t, reach)
            if (!scale) return null
            const size = flower.r * (flower.kind === 'hydrangea' ? 2.3 : 2.7) * scale
            const href = flower.kind === 'hydrangea' ? HYDRANGEAS[flower.variant] : ROSES[flower.variant]
            const colourIndex = pickWeighted(weights, flower.roll) % palette.length
            return <image key={index} href={href} filter={`url(#${id}-c${colourIndex})`} x={-size / 2} y={-size / 2} width={size} height={size} transform={`translate(${flower.x} ${flower.y}) rotate(${flower.rotate})`} />
          })}
        </g>
      </svg>
    </div>
  )
}
