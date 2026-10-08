<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: [question: string]
}>()

const MAX_LENGTH = 280

const charCount = computed(() => props.modelValue.length)
const isValid = computed(() => props.modelValue.trim().length > 0)

const onInput = (event: Event) => {
  const value = (event.target as HTMLTextAreaElement).value
  emit('update:modelValue', value)
}

const onSubmit = () => {
  if (!isValid.value) return
  emit('submit', props.modelValue.trim())
}
</script>

<template>
  <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
    <textarea
      :value="modelValue"
      :maxlength="MAX_LENGTH"
      rows="4"
      placeholder="¿Qué habría pasado si Internet se hubiese inventado en 1950?"
      class="w-full resize-none rounded-2xl border border-neutral-300 bg-white p-4 text-lg leading-relaxed text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
      @input="onInput"
    />

    <div class="flex items-center justify-between">
      <span class="text-sm text-neutral-400">{{ charCount }} / {{ MAX_LENGTH }}</span>

      <button
        type="submit"
        :disabled="!isValid"
        class="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        Explorar universo
      </button>
    </div>
  </form>
</template>
