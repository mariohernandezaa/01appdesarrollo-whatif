import type { ScenarioResult, ScenarioStatus } from '~/types/scenario'

export const useScenario = () => {
  const status = ref<ScenarioStatus>('idle')
  const result = ref<ScenarioResult | null>(null)
  const error = ref<string | null>(null)

  const explore = async (question: string) => {
    // TODO: conectar con la API de IA en una fase posterior.
    status.value = 'idle'
    result.value = null
    error.value = null
  }

  const reset = () => {
    status.value = 'idle'
    result.value = null
    error.value = null
  }

  return {
    status,
    result,
    error,
    explore,
    reset
  }
}
