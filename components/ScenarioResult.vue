<script setup lang="ts">
import type { ScenarioResult, ScenarioStatus } from '~/types/scenario'

defineProps<{
  result: ScenarioResult | null
  status: ScenarioStatus
  error: string | null
}>()
</script>

<template>
  <div class="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center" aria-live="polite">
    <p v-if="status === 'loading'" class="text-neutral-500">
      Generando tu universo alternativo...
    </p>

    <p v-else-if="error" role="alert" class="text-red-700">
      {{ error }}
    </p>

    <p v-else-if="!result" class="text-neutral-400">
      Tu universo alternativo aparecerá aquí.
    </p>

    <div v-else class="space-y-4 text-left">
      <p class="text-lg leading-relaxed text-neutral-900">{{ result.narrative }}</p>
      <ul class="list-inside list-disc space-y-1 text-neutral-600">
        <li v-for="(consequence, index) in result.consequences" :key="index">
          {{ consequence }}
        </li>
      </ul>
    </div>
  </div>
</template>
