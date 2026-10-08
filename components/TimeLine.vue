<script setup lang="ts">
const props = withDefaults(defineProps<{
	modelValue: number
	minYear?: number
	maxYear?: number
}>(), {
	minYear: 200,
	maxYear: 2100
})

const emit = defineEmits<{
	'update:modelValue': [year: number]
}>()

const selectedYear = computed({
	get: () => props.modelValue,
	set: (value: number | string) => emit('update:modelValue', Number(value))
})
</script>

<template>
	<section
		class="space-y-3"
		v-motion
		:initial="{ opacity: 0, y: 12 }"
		:enter="{ opacity: 1, y: 0, transition: { duration: 250 } }"
	>
		<label for="scenario-year" class="block text-sm font-medium">
			Año de referencia
		</label>

		<output for="scenario-year" class="block text-2xl font-semibold">
			{{ selectedYear }}
		</output>

		<input
			id="scenario-year"
			v-model.number="selectedYear"
			type="range"
			:min="props.minYear"
			:max="props.maxYear"
			step="1"
			class="w-full"
		>

		<div class="flex justify-between text-xs" aria-hidden="true">
			<span>{{ props.minYear }}</span>
			<span>{{ props.maxYear }}</span>
		</div>
	</section>
</template>
