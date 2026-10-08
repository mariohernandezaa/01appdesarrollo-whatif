# ¿Qué habría pasado si...?

Aplicación web para explorar escenarios alternativos a partir de preguntas hipotéticas.

El usuario introduce una situación hipotética (por ejemplo: "¿Qué habría pasado si Internet se hubiese inventado en 1950?") y, en una fase posterior, una API de IA generará un escenario alternativo junto con sus posibles consecuencias.

> **Estado actual:** esta primera fase solo incluye la estructura base de la interfaz. La conexión con la API de IA todavía no está implementada.

## Stack

- [Nuxt 3](https://nuxt.com/)
- [Vue 3](https://vuejs.org/)
- TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- npm

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Build de producción

```bash
npm run build
```

## Estructura del proyecto

```
pages/
  index.vue              # Página principal (única página de la app)

components/
  HypothesisForm.vue      # Formulario para introducir la pregunta hipotética
  ExampleQuestions.vue    # Preguntas de ejemplo seleccionables
  ScenarioResult.vue      # Zona de resultado (estado vacío por ahora)

composables/
  useScenario.ts          # Composable preparado para la futura llamada a la IA

types/
  scenario.ts              # Tipos TypeScript de consulta y resultado

assets/
  css/
    main.css               # Entrada de Tailwind CSS
```

## Próximas funcionalidades

- Conexión con una API de IA para generar el escenario alternativo.
- Manejo de estados de carga y error en la respuesta de la IA.
- Renderizado del resultado generado en `ScenarioResult.vue`.
