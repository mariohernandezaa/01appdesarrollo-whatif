# Implementación del selector de año (`TimeLine.vue`)

## Objetivo

Este documento explica el selector de año añadido a `TimeLine.vue` y cómo se conecta con la página principal. En esta fase, la línea temporal permite elegir un año de referencia para una hipótesis. El componente comunica el año seleccionado a su componente padre, pero no genera una cronología de acontecimientos ni envía todavía el año a una IA.

## Qué se implementó

`TimeLine.vue` contiene un control HTML nativo de tipo `range`. La persona puede moverlo con el ratón o con una pantalla táctil, y también puede cambiar el valor con las teclas de flecha cuando el control tiene el foco. El componente muestra el año seleccionado y los extremos del intervalo disponible.

El intervalo predeterminado va de **1800 a 2100**, y el salto entre valores es de **un año**. La página inicia el selector en **1950**. El intervalo se puede personalizar al usar el componente mediante las propiedades `minYear` y `maxYear`.

## Responsabilidades de cada archivo

| Archivo | Responsabilidad |
| --- | --- |
| `components/TimeLine.vue` | Presenta el selector, recibe el año actual y emite el año nuevo cuando cambia. |
| `pages/index.vue` | Mantiene el valor seleccionado en `selectedYear` y lo enlaza con `TimeLine.vue` usando `v-model`. |

## Contrato del componente

El componente recibe estas propiedades:

| Propiedad | Tipo | Obligatoria | Valor predeterminado | Uso |
| --- | --- | --- | --- | --- |
| `modelValue` | `number` | Sí | No tiene | Año actualmente seleccionado. |
| `minYear` | `number` | No | `1800` | Primer año permitido por el control. |
| `maxYear` | `number` | No | `2100` | Último año permitido por el control. |

Cuando la selección cambia, el componente emite el evento `update:modelValue` con el año como número. Este nombre de evento, junto con la propiedad `modelValue`, es el contrato que Vue utiliza para implementar `v-model` en componentes propios.

De forma simplificada, el contrato es:

```ts
defineProps<{
  modelValue: number
  minYear?: number
  maxYear?: number
}>()

defineEmits<{
  'update:modelValue': [year: number]
}>()
```

## Cómo se actualiza el año

El valor del control se presenta con `:value="modelValue"`. Así, el componente no mantiene una copia local del año: el valor mostrado siempre procede de la página que lo utiliza.

Cuando ocurre el evento `input`, `onYearInput` obtiene el elemento HTML que originó el evento, lee su valor y lo convierte a número mediante `Number(input.value)`. Los valores de los controles HTML llegan como texto, por eso se realiza esa conversión antes de emitir el evento:

```ts
const onYearInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  emit('update:modelValue', Number(input.value))
}
```

El control establece sus límites con `min` y `max`, y usa `step="1"` para que sus valores sean años enteros. La etiqueta visible identifica el control como «Año de referencia» y `<output>` presenta el año elegido.

## Flujo de datos con `v-model`

En `pages/index.vue`, el año se mantiene en un `ref`:

```ts
const selectedYear = ref(1950)
```

La página enlaza ese estado al componente:

```vue
<TimeLine v-model="selectedYear" />
```

Vue interpreta esa sintaxis, de forma conceptual, como el paso de `selectedYear` mediante la propiedad `modelValue` y la escucha de `update:modelValue`. El flujo queda así:

1. La página proporciona `selectedYear` a `TimeLine.vue` como `modelValue`.
2. El control muestra ese valor como año seleccionado.
3. La persona cambia el control y `TimeLine.vue` emite `update:modelValue` con el nuevo año numérico.
4. `v-model` actualiza `selectedYear` en `pages/index.vue`.
5. Vue vuelve a renderizar el valor actualizado en el control y en `<output>`.

La página es propietaria del estado y el componente se ocupa de la interfaz y de notificar cambios. Esta separación permite combinar más adelante el año con la pregunta antes de enviar la consulta.

## Qué no hace todavía

La implementación actual cubre la selección y el almacenamiento reactivo del año mientras la página está abierta. No incluye:

- Guardado persistente en `localStorage`, una base de datos o una sesión. Al recargar la página, el valor vuelve al inicial `1950`.
- Envío del año junto con la pregunta al método `useScenario().explore(...)`.
- Inclusión del año en `ScenarioQuery` o en un prompt.
- Una llamada a un endpoint, proveedor de IA o servicio de generación.
- Animaciones con VueUse Motion. Aunque el paquete está instalado, el selector no usa directivas de movimiento y el módulo no está registrado en `nuxt.config.ts`.
- Una cronología de hitos generados. El componente actual es un selector de año, no una visualización de eventos a lo largo del tiempo.

Para preparar el siguiente paso, habrá que decidir si el año es obligatorio, añadirlo al tipo de consulta y pasarlo desde la página al composable. La construcción final del prompt y la llamada al proveedor deben hacerse en el servidor para mantener las credenciales fuera del navegador.

## Comprobación

El build de producción (`npm run build`) terminó correctamente después de implementar el selector. En el estado actual del workspace, sin embargo, `pages/index.vue` conserva `<ExampleQuestions @select="handleSelectExample" />`, pero no declara `handleSelectExample` y no existe `components/ExampleQuestions.vue`. El diagnóstico de la página informa de ese error. Es una incidencia separada del selector y debe resolverse para que la página actual vuelva a compilar.