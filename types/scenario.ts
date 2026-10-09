export type UnrealismLevel = 'realista' | 'ilusionante' | 'descerebrado'

export interface ScenarioQuery {
  question: string
  year: number
  unrealismLevel: UnrealismLevel
}

export interface ScenarioResult {
  question: string
  narrative: string
  consequences: string[]
}

export type ScenarioStatus = 'idle' | 'loading' | 'success' | 'error'
