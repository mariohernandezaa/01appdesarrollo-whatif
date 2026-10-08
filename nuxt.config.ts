// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: '¿Qué habría pasado si...?',
      meta: [
        {
          name: 'description',
          content: 'Explora universos alternativos creados a partir de tus preguntas.'
        }
      ]
    }
  }
})
