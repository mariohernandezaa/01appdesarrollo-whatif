<script setup lang="ts">
const examples = [
  '¿Qué habría pasado si Internet se hubiese inventado en 1950?',
  '¿Qué habría pasado si los dinosaurios no se hubieran extinguido?',
  '¿Qué habría pasado si la humanidad nunca hubiera inventado los coches?'
]

const emit = defineEmits<{
  select: [question: string]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="example in examples"
      :key="example"
      type="button"
      class="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
      @click="emit('select', example)"
    >
      {{ example }}
    </button>
  </div>
</template>
