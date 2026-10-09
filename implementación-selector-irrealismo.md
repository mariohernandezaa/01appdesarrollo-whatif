# Selector del nivel de irrealismo

Este documento explica paso a paso el nuevo `UnrealismSelector.vue`, que permite elegir cuánto debe exagerar la respuesta generada a partir de una hipótesis.

## Opciones

| Valor | Etiqueta | Comportamiento esperado |
| --- | --- | --- |
| `realista` | Realista | Se ciñe a los hechos conocidos y a lo más probable. |
| `ilusionante` | Ilusionante | Presenta posibilidades algo exageradas. |
| `descerebrado` | Descerebrado | Lleva la hipótesis mucho más allá de lo plausible. |

Las opciones definen el estilo que se solicitará al modelo en una futura integración. El selector por sí solo no modifica ni genera una respuesta.

## Paso a paso

1. **Se define un tipo cerrado.** `types/scenario.ts` declara `UnrealismLevel` como una unión de los tres valores permitidos. Esto evita que la aplicación envíe etiquetas arbitrarias.
2. **El componente recibe el valor seleccionado.** `UnrealismSelector.vue` recibe `modelValue` con tipo `UnrealismLevel`.
3. **Las opciones se muestran como radios nativos.** Cada alternativa usa un `<input type="radio">` con una descripción. El grupo está dentro de un `<fieldset>` con una leyenda, lo que permite que tecnologías de asistencia identifiquen el propósito del control.
4. **El cambio emite un valor tipado.** Al seleccionar una alternativa, el componente emite `update:modelValue` con `realista`, `ilusionante` o `descerebrado`.
5. **La página controla el estado.** `pages/index.vue` enlaza el componente con `v-model="selectedUnrealismLevel"`, cuyo valor inicial es `realista`.
6. **El nivel se adjunta a la consulta.** Al enviar la pregunta, `handleSubmit` reúne el texto limpio, el año seleccionado y el nivel actual en un único objeto `ScenarioQuery`.
7. **El composable conserva la consulta.** `useScenario.explore` guarda una copia del objeto recibido. Ese objeto ya tiene el nivel elegido para que un futuro endpoint lo traduzca a instrucciones para el modelo.

El contrato del componente es:

```ts
defineProps<{
  modelValue: UnrealismLevel
}>()

defineEmits<{
  'update:modelValue': [level: UnrealismLevel]
}>()
```

## Accesibilidad y presentación

Los radios nativos permiten la navegación por teclado del grupo y exponen la selección a lectores de pantalla. La opción seleccionada se distingue visualmente y su descripción mantiene contraste sobre el fondo seleccionado. En pantallas estrechas las opciones se apilan; en pantallas mayores se presentan en tres columnas.

## Qué falta para influir en una respuesta

Ahora el nivel forma parte de la consulta guardada, pero no se construye ningún prompt ni se realiza una llamada al modelo. Cuando se implemente el endpoint del servidor, deberá convertir el valor seleccionado en instrucciones explícitas y coherentes para el proveedor de IA. Por ejemplo, `descerebrado` debería indicar una exageración deliberada, sin presentar como hechos reales los elementos inventados.