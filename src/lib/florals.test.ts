import { describe, expect, it } from 'vitest'
import { bloomsFor, foliageFor, recolourMatrix } from './florals'

describe('Matching colours to the supplied flowers', () => {
  it('uses the real photographed flower when one matches the colour', () => {
    expect(bloomsFor('Blush', '#efc4c4')).toEqual({ blooms: ['blush-rose'], tint: null })
    expect(bloomsFor('Burgundy', '#7a1f2e').tint).toBeNull()
    expect(bloomsFor('Lilac', '#c7b2d6').blooms).toEqual(['lilac-hydrangea'])
  })

  it('recolours the ivory rose and white hydrangea for colours with no matching flower', () => {
    expect(bloomsFor('Navy', '#27355a')).toEqual({ blooms: ['ivory-rose', 'white-hydrangea'], tint: '#27355a' })
    expect(bloomsFor('Your shade #B04A6B', '#b04a6b').tint).toBe('#b04a6b')
  })

  it('keeps foliage natural except for dark choices', () => {
    expect(foliageFor('Eucalyptus').darken).toBe(0)
    expect(foliageFor('Fresh green').darken).toBe(0)
    expect(foliageFor('Black foliage').darken).toBeGreaterThan(0.5)
  })

  it('builds a valid colour matrix', () => {
    const values = recolourMatrix('#27355a', '#d4cdbb').split(' ').map(Number)
    expect(values).toHaveLength(20)
    expect(values.every((value) => Number.isFinite(value) && value >= 0)).toBe(true)
  })
})
