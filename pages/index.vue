<script setup lang="ts">
import type { UnrealismLevel } from '~/types/scenario'

const question = ref('')
const selectedYear = ref(1950)
const selectedUnrealismLevel = ref<UnrealismLevel>('realista')
const { result, explore } = useScenario()

const handleSubmit = (submittedQuestion: string) => {
  question.value = submittedQuestion
  void explore({
    question: submittedQuestion,
    year: selectedYear.value,
    unrealismLevel: selectedUnrealismLevel.value
  })
}
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-2xl flex-col gap-10 px-6 py-16 sm:py-24">
    <header class="space-y-4 text-center">
      <h1 class="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
        ¿Qué habría pasado si...?
      </h1>
      <p class="text-lg text-neutral-500">
        Explora universos alternativos creados a partir de tus preguntas.
      </p>
    </header>

    <section class="space-y-4">
      <HypothesisForm v-model="question" @submit="handleSubmit" />
      <TimeLine v-model="selectedYear" />
      <UnrealismSelector v-model="selectedUnrealismLevel" />
    </section>

    <section>
      <ScenarioResult :result="result" />
    </section>
  </main>
</template>
