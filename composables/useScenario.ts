import type { ScenarioQuery, ScenarioResult, ScenarioStatus } from '~/types/scenario'

export const useScenario = () => {
  const status = ref<ScenarioStatus>('idle')
  const query = ref<ScenarioQuery | null>(null)
  const result = ref<ScenarioResult | null>(null)
  const error = ref<string | null>(null)

  const explore = async (submittedQuery: ScenarioQuery) => {
    query.value = { ...submittedQuery }
    status.value = 'loading'
    result.value = null
    error.value = null

    try {
      result.value = await $fetch<ScenarioResult>('/api/scenario', {
        method: 'POST',
        body: submittedQuery
      })
      status.value = 'success'
    } catch (caught) {
      const responseError = caught as {
        data?: { statusMessage?: string }
        message?: string
      }
      error.value = responseError.data?.statusMessage
        ?? responseError.message
        ?? 'No se pudo generar el escenario. Inténtalo de nuevo.'
      status.value = 'error'
    }
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
