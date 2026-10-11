import { describe, expect, it } from 'vitest'
import { parseScenarioQuery } from '../server/utils/scenario-query'

describe('parseScenarioQuery', () => {
  it('accepts a valid query and trims its question', () => {
    expect(parseScenarioQuery({
      question: '  ¿Y si Roma no hubiera caído?  ',
      year: 1950,
      unrealismLevel: 'realista'
    })).toEqual({
      question: '¿Y si Roma no hubiera caído?',
      year: 1950,
      unrealismLevel: 'realista'
    })
  })

  it.each([0, 3000])('accepts the boundary year %i', (year) => {
    expect(parseScenarioQuery({
      question: 'Una hipótesis',
      year,
      unrealismLevel: 'ilusionante'
    })?.year).toBe(year)
  })

  it('accepts a question with exactly 280 characters', () => {
    expect(parseScenarioQuery({
      question: 'a'.repeat(280),
      year: 1950,
      unrealismLevel: 'realista'
    })?.question).toHaveLength(280)
  })

  it.each(['realista', 'ilusionante', 'descerebrado'] as const)('accepts the %s style', (unrealismLevel) => {
    expect(parseScenarioQuery({
      question: 'Una hipótesis',
      year: 1950,
      unrealismLevel
    })?.unrealismLevel).toBe(unrealismLevel)
  })

  it.each(['', '   ', 'a'.repeat(281)])('rejects an empty or overlong question', (question) => {
    expect(parseScenarioQuery({
      question,
      year: 1950,
      unrealismLevel: 'realista'
    })).toBeNull()
  })

  it.each([-1, 3001, 1950.5, '1950'])('rejects an invalid year: %s', (year) => {
    expect(parseScenarioQuery({
      question: 'Una hipótesis',
      year,
      unrealismLevel: 'realista'
    })).toBeNull()
  })

  it('rejects an unsupported realism level', () => {
    expect(parseScenarioQuery({
      question: 'Una hipótesis',
      year: 1950,
      unrealismLevel: 'fantástico'
    })).toBeNull()
  })
})