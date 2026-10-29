import { useId } from 'react'
import { asset } from '../lib/asset'
import { colourWeights, pickWeighted, type NamedColour } from '../lib/colours'
import { BLOOMS, bloomsFor, foliageFor, recolourMatrix, type BloomName } from '../lib/florals'

/*
 * Dresses Hearts in Bloom's bare heart arch photo with the supplied flower
 * photographs in a couple's own colours. The two halves below trace the arch frame in the photo's own pixels
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

type Bloom = { x: number; y: number; size: number; rotate: number; flip: boolean; roll: number; pick: number; hydrangea: number; t: number }
type Stem = { x: number; y: number; size: number; rotate: number; flip: boolean; pick: number; t: number }

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
      return { x: x1 + (x2 - x1) * local, y: y1 + (y2 - y1) * local, angle: Math.atan2(y2 - y1, x2 - x1), total }
    }
    distance -= lengths[index]
  }
  return { x: path[0][0], y: path[0][1], angle: 0, total }
}

function buildArrangement() {
  const next = random(20261029)
  const spread = () => next() + next() - 1
  const blooms: Bloom[] = []
  const stems: Stem[] = []
  for (const half of HALVES) {
    const { total } = pointAt(half, 0)
    const steps = Math.round(total / 19)
    for (let step = 0; step <= steps; step += 1) {
      const t = step / steps
      const { x, y, angle } = pointAt(half, t)
      const normal = angle + Math.PI / 2
      const top = t < 0.5
      const width = top ? 34 : 22 - t * 6
      // a stem of foliage every other step, tucked behind the blooms
      for (let index = 0; index < (top ? 2 : 1); index += 1) {
        const offset = spread() * width * 0.9
        const side = next() < 0.5 ? 1 : -1
        stems.push({ x: x + Math.cos(normal) * offset, y: y + Math.sin(normal) * offset, size: (top ? 150 : 125) * (0.8 + next() * 0.35), rotate: (angle * 180) / Math.PI + side * (60 + next() * 55), flip: next() < 0.5, pick: next(), t })
      }
      const count = top ? (next() < 0.75 ? 2 : 1) : next() < 0.85 ? 1 : 0
      for (let index = 0; index < count; index += 1) {
        const offset = spread() * width
        blooms.push({ x: x + Math.cos(normal) * offset, y: y + Math.sin(normal) * offset, size: top ? 58 + next() * 34 : Math.max(36, 60 - t * 18 + next() * 16), rotate: spread() * 40, flip: next() < 0.5, roll: next(), pick: next(), hydrangea: next(), t })
      }
    }
  }
  return { blooms: blooms.sort((a, b) => a.size - b.size), stems }
}

const arrangement = buildArrangement()
const photo = (name: string) => asset(`/images/flowers/${name}.webp`)

/** Shrinks items towards the end of the chosen coverage so it tapers naturally. */
function taper(t: number, reach: number) {
  if (t > reach) return 0
  return t > reach - 0.06 ? 0.6 + ((reach - t) / 0.06) * 0.4 : 1
}

export default function ColourArch({ colours, foliage, coverage, className = '', label }: { colours: NamedColour[]; foliage: string; coverage: string; className?: string; label?: string }) {
  const reach = coverageReach[coverage] ?? coverageReach['Fuller top']
  const chosen = colours.length ? colours : [{ name: 'Ivory', value: '#efe6cf' }]
  const weights = colourWeights(chosen.length)
  const plans = chosen.map((colour) => bloomsFor(colour.name, colour.value))
  const leaves = foliageFor(foliage)
  const id = `colour-arch-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const tinted = plans.flatMap((plan, index) => plan.tint ? [{ index, tint: plan.tint }] : [])

  function bloomFor(bloom: Bloom) {
    const colourIndex = pickWeighted(weights, bloom.roll) % plans.length
    const plan = plans[colourIndex]
    // hydrangeas make up about a quarter of the blooms where the colour allows one
    const hydrangeas = plan.blooms.filter((name) => BLOOMS.find((item) => item.name === name)?.hydrangea)
    const others = plan.blooms.filter((name) => !hydrangeas.includes(name))
    const pool: BloomName[] = hydrangeas.length && (bloom.hydrangea < 0.26 || !others.length) ? hydrangeas : others.length ? others : hydrangeas
    const name = pool[Math.floor(bloom.pick * pool.length)]
    return { name, colourIndex, tint: plan.tint, info: BLOOMS.find((item) => item.name === name)! }
  }

  return (
    <div className={`colour-arch ${className}`} role="img" aria-label={label ?? 'Preview of the heart arch dressed in your chosen colours'}>
      <img src={asset('/images/arch-bare.webp')} alt="" />
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#201a14" floodOpacity="0.3" /></filter>
          {leaves.darken > 0 && <filter id={`${id}-leaf`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={[0, 1, 2].map((row) => [0, 1, 2, 3].map((col) => (col === row ? (1 - leaves.darken).toFixed(3) : '0')).join(' ') + ' 0').concat('0 0 0 1 0').join(' ')} /></filter>}
          {tinted.map(({ index, tint }) => (
            <g key={index}>
              <filter id={`${id}-rose-${index}`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={recolourMatrix(tint, '#d4cdbb')} /></filter>
              <filter id={`${id}-hyd-${index}`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={recolourMatrix(tint, '#cfcdba')} /></filter>
            </g>
          ))}
        </defs>
        <g filter={`url(#${id}-shadow)`}>
          <g filter={leaves.darken > 0 ? `url(#${id}-leaf)` : undefined}>
            {arrangement.stems.map((stem, index) => {
              const scale = taper(stem.t, reach + 0.04)
              if (!scale) return null
              const kind = leaves.kinds[Math.floor(stem.pick * leaves.kinds.length)]
              const size = stem.size * scale
              return <image key={index} href={photo(kind)} x={-size / 2} y={-size} width={size} height={size} transform={`translate(${stem.x} ${stem.y}) rotate(${stem.rotate}) scale(${stem.flip ? -1 : 1} 1)`} />
            })}
          </g>
          {arrangement.blooms.map((bloom, index) => {
            const scale = taper(bloom.t, reach)
            if (!scale) return null
            const { name, colourIndex, tint, info } = bloomFor(bloom)
            const size = bloom.size * info.scale * scale
            const filter = tint ? `url(#${id}-${info.hydrangea ? 'hyd' : 'rose'}-${colourIndex})` : undefined
            return <image key={index} href={photo(name)} filter={filter} x={-size / 2} y={-size / 2} width={size} height={size} transform={`translate(${bloom.x} ${bloom.y}) rotate(${bloom.rotate}) scale(${bloom.flip ? -1 : 1} 1)`} />
          })}
        </g>
      </svg>
    </div>
  )
}
