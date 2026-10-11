import type { ScenarioResult, UnrealismLevel } from '~/types/scenario'
import { parseScenarioQuery } from '../utils/scenario-query'

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string | null
    }
  }>
}

const levelDescriptions: Record<UnrealismLevel, string> = {
  realista: 'realista y ceñido a lo históricamente plausible',
  ilusionante: 'optimista e ilusionante, con cierta exageración',
  descerebrado: 'deliberadamente disparatado y llevado al extremo'
}

export default defineEventHandler(async (event): Promise<ScenarioResult> => {
  const query = parseScenarioQuery(await readBody<unknown>(event))
  if (!query) {
    throw createError({ statusCode: 400, statusMessage: 'La pregunta, el año o el nivel de realismo no son válidos.' })
  }

  const config = useRuntimeConfig(event)
  if (!config.openrouterApiKey) {
    throw createError({ statusCode: 503, statusMessage: 'Configura NUXT_OPENROUTER_API_KEY en tu archivo .env.' })
  }

  let completion: OpenRouterResponse
  try {
    completion = await $fetch<OpenRouterResponse>('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.openrouterApiKey}`,
        'Content-Type': 'application/json'
      },
      body: {
        model: config.openrouterModel,
        temperature: 0.8,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'Eres una IA que explora historia alternativa en español. Devuelve únicamente un objeto JSON válido con dos propiedades: "narrative", un relato claro de uno o dos párrafos, y "consequences", una lista de entre 3 y 5 consecuencias breves.'
          },
          {
            role: 'user',
            content: `Hipótesis: ${query.question}\nAño de referencia: ${query.year}\nEstilo: ${levelDescriptions[query.unrealismLevel]}`
          }
        ]
      }
    })
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'No se pudo obtener una respuesta de OpenRouter. Inténtalo de nuevo.' })
  }

  const content = completion.choices?.[0]?.message?.content
  if (!content) {
    throw createError({ statusCode: 502, statusMessage: 'OpenRouter devolvió una respuesta vacía.' })
  }

  let generated: { narrative?: unknown, consequences?: unknown }
  try {
    generated = JSON.parse(content)
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'La respuesta de OpenRouter no tenía el formato esperado.' })
  }

  if (
    typeof generated.narrative !== 'string'
    || !Array.isArray(generated.consequences)
    || !generated.consequences.every(item => typeof item === 'string')
  ) {
    throw createError({ statusCode: 502, statusMessage: 'La respuesta de OpenRouter no tenía el formato esperado.' })
  }

  return {
    question: query.question,
    narrative: generated.narrative,
    consequences: generated.consequences
  }
})