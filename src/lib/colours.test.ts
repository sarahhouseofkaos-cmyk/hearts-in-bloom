import { describe, expect, it } from 'vitest'
import { colourWeights, coloursByName, describeCustomColours, isHexColour, joinNames, pickWeighted, shade } from './colours'

describe('Your own colours', () => {
  it('describes the chosen colours and foliage for the enquiry', () => {
    expect(describeCustomColours(coloursByName(['Blush', 'Ivory', 'Sage']), 'Eucalyptus')).toBe('Your own colours: Blush, Ivory & Sage with eucalyptus foliage')
    expect(describeCustomColours(coloursByName(['Burgundy']), '')).toBe('Your own colours: Burgundy')
    expect(describeCustomColours([], '')).toBe('Your own colours')
  })

  it('joins names naturally', () => {
    expect(joinNames(['A'])).toBe('A')
    expect(joinNames(['A', 'B'])).toBe('A & B')
    expect(joinNames(['A', 'B', 'C'])).toBe('A, B & C')
  })

  it('shades colours and ignores invalid values', () => {
    expect(shade('#808080', -0.5)).toBe('#404040')
    expect(shade('#000000', 1)).toBe('#ffffff')
    expect(shade('not-a-colour', -0.2)).toBe('not-a-colour')
    expect(isHexColour('#A1b2C3')).toBe(true)
    expect(isHexColour('red')).toBe(false)
  })

  it('weights the leading colour most and always picks a valid colour', () => {
    for (const count of [1, 2, 3, 4]) {
      const weights = colourWeights(count)
      expect(weights).toHaveLength(count)
      expect(weights.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1)
      expect(pickWeighted(weights, 0)).toBe(0)
      expect(pickWeighted(weights, 0.9999)).toBe(count - 1)
    }
  })
})
