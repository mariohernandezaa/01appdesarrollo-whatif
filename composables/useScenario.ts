import type { ScenarioQuery, ScenarioResult, ScenarioStatus } from '~/types/scenario'

export const useScenario = () => {
  const status = ref<ScenarioStatus>('idle')
  const query = ref<ScenarioQuery | null>(null)
  const result = ref<ScenarioResult | null>(null)
  const error = ref<string | null>(null)

  const explore = async (submittedQuery: ScenarioQuery) => {
    query.value = { ...submittedQuery }
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
    query,
    result,
    error,
    explore,
    reset
  }
}
