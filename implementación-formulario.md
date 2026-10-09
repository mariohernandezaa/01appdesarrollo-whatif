# Flujo del formulario de hipótesis

Este documento describe paso a paso cómo `HypothesisForm.vue` conserva la pregunta escrita y cómo la página la combina con el año y el nivel de irrealismo antes de guardar la consulta.

## Responsabilidades

- `HypothesisForm.vue` controla la entrada de texto y valida que la pregunta no esté vacía.
- `pages/index.vue` conserva la pregunta mientras se escribe y los valores de los otros selectores.
- `useScenario` conserva en memoria el objeto completo enviado al enviar el formulario.

## Paso a paso

1. **La página crea el estado de la pregunta.** `pages/index.vue` declara `const question = ref('')` y se lo pasa al formulario mediante `v-model`.
2. **El formulario refleja el estado recibido.** `HypothesisForm.vue` recibe `modelValue` y lo usa como valor del `<textarea>`. No mantiene una copia independiente del texto.
3. **Cada edición actualiza al padre.** El manejador `onInput` lee el texto del `<textarea>` y emite `update:modelValue`. Vue actualiza `question` en la página.
4. **Se limita y valida la entrada.** El atributo `maxlength` limita la pregunta a 280 caracteres. `isValid` comprueba que el texto tenga contenido después de quitar espacios al principio y al final; mientras esté vacío, el botón queda deshabilitado.
5. **El envío emite el texto limpio.** `onSubmit` evita el envío del formulario HTML y, si la pregunta es válida, emite `submit` con `modelValue.trim()`.
6. **La página reúne los valores de la consulta.** `handleSubmit` recibe la pregunta enviada y construye un `ScenarioQuery` con `question`, el año de `selectedYear` y el nivel de `selectedUnrealismLevel`.
7. **El composable conserva la consulta.** La página llama a `explore(query)` y `useScenario` guarda una copia del objeto en su ref `query`.

El flujo puede resumirse así:

```text
textarea
  -> update:modelValue
  -> question en pages/index.vue
  -> submit(pregunta limpia)
  -> { question, year, unrealismLevel }
  -> useScenario.query
```

## Qué significa “guardar” aquí

El texto se mantiene de forma reactiva en la página durante la edición. Al enviar, se conserva además una copia de la consulta completa en el estado de `useScenario`. Este almacenamiento vive en memoria mientras la instancia de la página está activa; no persiste al recargar ni se guarda en una base de datos.

## Límite de la integración actual

El objeto llega a `useScenario`, pero `explore` todavía no realiza una petición HTTP ni llama a un modelo. Para generar una respuesta hará falta un endpoint de servidor y elegir/configurar un proveedor. La llamada al modelo debe hacerse desde el servidor para no exponer una clave privada en el navegador.