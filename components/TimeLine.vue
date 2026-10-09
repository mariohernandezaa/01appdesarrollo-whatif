<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: number
  minYear?: number
  maxYear?: number
}>(), {
  minYear: 1800,
  maxYear: 2100
})

const emit = defineEmits<{
  'update:modelValue': [year: number]
}>()

const onYearInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  emit('update:modelValue', Number(input.value))
}
</script>

<template>
  <section class="space-y-3">
    <div class="flex items-baseline justify-between gap-4">
      <label for="scenario-year" class="text-sm font-medium text-neutral-700">
        Año de referencia
      </label>
      <output for="scenario-year" class="text-xl font-semibold tabular-nums text-neutral-900">
        {{ modelValue }}
      </output>
    </div>

    <input
      id="scenario-year"
      type="range"
      :value="modelValue"
      :min="props.minYear"
      :max="props.maxYear"
      step="1"
      class="w-full accent-neutral-900"
      @input="onYearInput"
    >

    <div class="flex justify-between text-xs tabular-nums text-neutral-500" aria-hidden="true">
      <span>{{ props.minYear }}</span>
      <span>{{ props.maxYear }}</span>
    </div>
  </section>
</template>
