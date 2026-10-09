<script setup lang="ts">
import type { UnrealismLevel } from '~/types/scenario'

defineProps<{
  modelValue: UnrealismLevel
}>()

const emit = defineEmits<{
  'update:modelValue': [level: UnrealismLevel]
}>()

const options: { value: UnrealismLevel, label: string, description: string }[] = [
  {
    value: 'realista',
    label: 'Realista',
    description: 'Se ciñe a los hechos y a lo más probable.'
  },
  {
    value: 'ilusionante',
    label: 'Ilusionante',
    description: 'Exagera un poco las posibilidades del escenario.'
  },
  {
    value: 'descerebrado',
    label: 'Descerebrado',
    description: 'Lleva la hipótesis mucho más allá de la realidad.'
  }
]
</script>

<template>
  <fieldset class="space-y-3">
    <legend class="text-sm font-medium text-neutral-700">
      Nivel de realismo
    </legend>

    <div class="grid overflow-hidden rounded-xl border border-neutral-300 sm:grid-cols-3">
      <label
        v-for="option in options"
        :key="option.value"
        class="cursor-pointer border-b border-neutral-300 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
      >
        <input
          type="radio"
          name="unrealism-level"
          :value="option.value"
          :checked="modelValue === option.value"
          class="peer sr-only"
          @change="emit('update:modelValue', option.value)"
        >
        <span class="block h-full px-4 py-3 transition-colors peer-checked:bg-neutral-900 peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[-2px] peer-focus-visible:outline-neutral-700">
          <span class="block text-sm font-semibold">{{ option.label }}</span>
          <span
            class="mt-1 block text-xs leading-relaxed"
            :class="modelValue === option.value ? 'text-neutral-300' : 'text-neutral-500'"
          >
            {{ option.description }}
          </span>
        </span>
      </label>
    </div>
  </fieldset>
</template>