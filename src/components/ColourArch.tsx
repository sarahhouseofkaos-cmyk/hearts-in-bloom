import { useId } from 'react'
import { asset } from '../lib/asset'
import { colourWeights, pickWeighted, shade, type NamedColour } from '../lib/colours'

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
export const coverageReach: Record<string, number> = {
  'Top half only': 0.48,
  'Fuller top': 0.67,
  'Full arch': 1,
}

type Flower = { x: number; y: number; r: number; rotate: number; roll: number; t: number }
type Leaf = { x: number; y: number; length: number; rotate: number; tone: number; t: number }
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
    const steps = Math.round(total / 13)
    for (let step = 0; step <= steps; step += 1) {
      const t = step / steps
      const { x, y, angle } = pointAt(half, t)
      const normal = angle + Math.PI / 2
      const top = t < 0.5
      const width = top ? 40 : 24 - t * 8
      for (let index = 0; index < 3; index += 1) {
        const offset = spread() * width * 1.75
        leaves.push({ x: x + Math.cos(normal) * offset, y: y + Math.sin(normal) * offset, length: (top ? 34 : 26) + next() * 24, rotate: (angle * 180) / Math.PI + spread() * 80 + (index % 2 ? 180 : 0), tone: next(), t })
      }
      const count = top ? (next() < 0.55 ? 2 : 1) : next() < 0.55 ? 1 : 0
      for (let index = 0; index < count; index += 1) {
        const offset = spread() * width
        const size = top ? 15 + next() * 20 : Math.max(9, 17 - t * 6 + next() * 9)
        flowers.push({ x: x + Math.cos(normal) * offset, y: y + Math.sin(normal) * offset, r: size, rotate: next() * 360, roll: next(), t })
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
const OUTER_PETALS = [0, 72, 144, 216, 288]
const INNER_PETALS = [36, 156, 276]

/** Shrinks items towards the end of the chosen coverage so it tapers naturally. */
function taper(t: number, reach: number) {
  if (t > reach) return 0
  return t > reach - 0.06 ? 0.55 + ((reach - t) / 0.06) * 0.45 : 1
}

export default function ColourArch({ colours, foliage, coverage, className = '', label }: { colours: NamedColour[]; foliage: string; coverage: string; className?: string; label?: string }) {
  const reach = coverageReach[coverage] ?? coverageReach['Fuller top']
  const weights = colourWeights(Math.max(1, colours.length))
  const palette = colours.length ? colours.map((colour) => colour.value) : ['#efe6cf']
  const leafBase = foliage || '#4f6b3f'
  const shades = palette.map((value) => ({ base: value, light: shade(value, 0.1), mid: shade(value, -0.08), inner: shade(value, -0.2), line: shade(value, -0.3) }))
  const leafTones = [shade(leafBase, -0.12), leafBase, shade(leafBase, 0.14)]
  const leafLine = shade(leafBase, -0.3)
  const sheenId = `colour-arch-sheen-${useId().replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <div className={`colour-arch ${className}`} role="img" aria-label={label ?? 'Preview of the heart arch dressed in your chosen colours'}>
      <img src={asset('/images/arch-bare.webp')} alt="" />
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id={sheenId} cx="35%" cy="30%" r="70%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="0.6" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.16" />
          </radialGradient>
        </defs>
        <g>
          {arrangement.leaves.map((leaf, index) => {
            const scale = taper(leaf.t, reach + 0.03)
            if (!scale) return null
            return (
              <g key={`l${index}`} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rotate}) scale(${leaf.length * scale})`}>
                <path d="M0 0 C0.3 -0.32 0.75 -0.3 1 0 C0.75 0.3 0.3 0.32 0 0 Z" fill={leafTones[Math.floor(leaf.tone * 3)]} />
                <path d="M0.05 0 L0.9 0" stroke={leafLine} strokeWidth="0.04" opacity="0.6" />
              </g>
            )
          })}
        </g>
        <g>
          {arrangement.fillers.map((filler, index) => {
            const scale = taper(filler.t, reach)
            if (!scale) return null
            return <circle key={`f${index}`} cx={filler.x} cy={filler.y} r={filler.r * scale} fill="#fbfaf6" opacity="0.92" />
          })}
        </g>
        <g>
          {arrangement.flowers.map((flower, index) => {
            const scale = taper(flower.t, reach)
            if (!scale) return null
            const colour = shades[pickWeighted(weights, flower.roll) % shades.length]
            return (
              <g key={`r${index}`} transform={`translate(${flower.x} ${flower.y}) rotate(${flower.rotate}) scale(${flower.r * scale})`}>
                <circle cx="0.1" cy="0.16" r="1.02" fill="#000" opacity="0.18" />
                {OUTER_PETALS.map((angle) => <ellipse key={angle} cy="-0.46" rx="0.6" ry="0.56" transform={`rotate(${angle})`} fill={colour.base} stroke={colour.mid} strokeWidth="0.05" />)}
                {INNER_PETALS.map((angle) => <ellipse key={angle} cy="-0.24" rx="0.4" ry="0.36" transform={`rotate(${angle})`} fill={colour.light} stroke={colour.mid} strokeWidth="0.045" />)}
                <circle r="0.2" fill={colour.inner} />
                <path d="M-0.14 0.02 A0.14 0.14 0 0 1 0.12 -0.08 M0.1 0.08 A0.18 0.18 0 0 1 -0.16 0.12" fill="none" stroke={colour.line} strokeWidth="0.05" strokeLinecap="round" opacity="0.7" />
                <circle r="1" fill={`url(#${sheenId})`} />
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
