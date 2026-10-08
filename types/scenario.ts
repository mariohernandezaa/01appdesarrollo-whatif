export interface ScenarioQuery {
  question: string
}

export interface ScenarioResult {
  question: string
  narrative: string
  consequences: string[]
}

export type ScenarioStatus = 'idle' | 'loading' | 'success' | 'error'
