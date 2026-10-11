import type { ScenarioQuery, UnrealismLevel } from '../../types/scenario'

const unrealismLevels: UnrealismLevel[] = ['realista', 'ilusionante', 'descerebrado']

export const parseScenarioQuery = (input: unknown): ScenarioQuery | null => {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return null

  const values = input as Record<string, unknown>
  const question = values.question
  const year = values.year
  const unrealismLevel = values.unrealismLevel

  if (typeof question !== 'string' || question.trim().length === 0 || question.trim().length > 280) {
    return null
  }

  if (typeof year !== 'number' || !Number.isInteger(year) || year < 0 || year > 3000) {
    return null
  }

  if (typeof unrealismLevel !== 'string' || !unrealismLevels.includes(unrealismLevel as UnrealismLevel)) {
    return null
  }

  return {
    question: question.trim(),
    year,
    unrealismLevel: unrealismLevel as UnrealismLevel
  }
}