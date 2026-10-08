# Guía: selector de año para la línea temporal

Esta guía explica cómo transformar `TimeLine.vue` en un selector de año animado y cómo preparar ese año para enviarlo a una IA en una fase posterior. Es una guía de aprendizaje: **no se han cambiado componentes, configuración ni dependencias de la aplicación**.

## Estado actual

Aunque se llama `TimeLine.vue`, ahora mismo el componente contiene preguntas de ejemplo y emite el evento `select` con una pregunta. En `pages/index.vue` se escucha ese evento para rellenar el formulario. Todavía no hay un año seleccionado ni una llamada al modelo: `useScenario()` solo mantiene el estado de la futura respuesta.

La idea es cambiar el propósito del componente cuando decidas implementarlo:

1. `TimeLine.vue` muestra un intervalo de años y permite elegir uno.
2. El componente emite el año elegido; no construye ni envía prompts.
3. `pages/index.vue` mantiene juntos la pregunta y el año seleccionados.
4. Más adelante, `useScenario()` enviará ambos datos a un endpoint del servidor.

## 1. Elegir la librería de animación

Para este proyecto recomiendo **VueUse Motion** (`@vueuse/motion`): se integra con Vue y Nuxt, permite declarar animaciones en la plantilla y es compatible con la renderización del servidor.

La librería se ocupa del movimiento visual, no del control deslizante. Para elegir el año usa el elemento HTML nativo `<input type="range">`: ya permite arrastrar con ratón o táctil, usar las flechas del teclado y establecer límites numéricos. Así no necesitas instalar una segunda librería solo para el selector.

Documentación oficial: [VueUse Motion](https://motion.vueuse.org/) y [uso con Nuxt](https://motion.vueuse.org/getting-started/nuxt).

### Instalar y registrar

Desde la terminal, instala el paquete:

```bash
npm install @vueuse/motion
```

Después, añade el módulo en `nuxt.config.ts`, conservando el módulo de Tailwind que ya existe:

```ts
modules: ['@nuxtjs/tailwindcss', '@vueuse/motion/nuxt'],
```

Nuxt registra automáticamente las directivas de Motion. No tienes que crear un plugin Vue manual.

## 2. Diseñar el componente

Antes de escribir código, decide qué intervalo tiene sentido para la aplicación. Por ejemplo, `1800`–`2100` sirve como demostración de años históricos recientes y futuros; cambia esos límites si el producto necesita representar otros periodos. Define también cómo representarás años antes de nuestra era: el selector numérico admite valores negativos, pero la convención debe quedar clara para las personas y para el modelo.

El componente debería recibir el año actual como `modelValue` y emitir `update:modelValue` cuando cambie. Ese contrato permite usarlo como `v-model` desde la página. Un punto de partida para `TimeLine.vue` sería:

```vue
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

const selectedYear = computed({
	get: () => props.modelValue,
	set: (value: number | string) => emit('update:modelValue', Number(value))
})
</script>

<template>
	<section class="space-y-3">
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
```

Qué hace cada parte:

- `modelValue` es el valor que controla el padre, y `update:modelValue` notifica un cambio. Juntos habilitan el patrón `v-model` de Vue.
- `minYear`, `maxYear` y `step` definen el rango y el tamaño del salto. `step="1"` hace que cada movimiento seleccione un año entero.
- `v-model.number` convierte el valor del control a número. La conversión adicional del setter hace explícito el tipo del dato emitido.
- `<label>` da nombre accesible al control; `<output>` muestra el año seleccionado. Los extremos visibles aclaran el rango.

Este fragmento es una base didáctica, no una implementación aplicada al proyecto. Si permites que el intervalo cambie después, asegúrate de limitar el valor seleccionado cuando quede fuera de los nuevos extremos.

## 3. Añadir movimiento

Aplica la directiva de Motion a un elemento que aparezca al cargar el componente. Por ejemplo, puedes añadir estos atributos al `<section>` de la plantilla:

```vue
v-motion
:initial="{ opacity: 0, y: 12 }"
:enter="{ opacity: 1, y: 0, transition: { duration: 250 } }"
```

`initial` describe el estado inicial y `enter` el estado al que anima. Mantén el movimiento sutil y comprueba el resultado en móvil. La directiva anima la entrada del elemento, no crea una línea temporal ni cambia el año: esa lógica sigue siendo responsabilidad del `<input type="range">` y de Vue.

Para animar también el cambio del número, empieza con una transición visual discreta alrededor de `<output>` y valida que los cambios rápidos del control sigan siendo legibles. Respeta la preferencia del sistema para reducir movimiento; si una animación no aporta información, es mejor dejarla desactivada para esos usuarios.

## 4. Conectar el selector con la página

En `pages/index.vue`, crea un estado para el año y enlázalo al componente. El ejemplo siguiente muestra únicamente las líneas que tendrías que incorporar en el `<script setup>` y en la plantilla:

```ts
const selectedYear = ref(1950)
```

```vue
<TimeLine v-model="selectedYear" />
```

El dato fluye así: al mover el control, `TimeLine.vue` emite el nuevo número; `v-model` actualiza `selectedYear` en la página. Mantener el estado en la página permite combinarlo después con la pregunta del formulario sin que el componente visual conozca la IA.

## 5. Preparar el tipo de consulta para la IA

Cuando llegue el momento de conectar el modelo, amplía `ScenarioQuery` en `types/scenario.ts` para que represente ambos datos. Por ejemplo:

```ts
export interface ScenarioQuery {
	question: string
	year: number
}
```

Luego ajusta `useScenario().explore(...)` para recibir la pregunta y el año, y desde `pages/index.vue` pásale los valores al enviar el formulario. Decide si el año es obligatorio; si puede omitirse, modela ese caso de forma explícita, por ejemplo con `year: number | null`, y no inventes un año por defecto silenciosamente.

Envía los datos estructurados (`question` y `year`) al servidor. En el servidor puedes construir instrucciones claras para el proveedor, por ejemplo: «Analiza el escenario tomando `year` como año de referencia». No dependas de extraer el año de una frase libre si el usuario ya lo eligió con el control.

## 6. Conectar el modelo de forma segura

Cuando implementes la integración, sigue este flujo:

1. Crea un endpoint de servidor Nuxt, por ejemplo `server/api/scenario.post.ts`, que reciba la pregunta y el año.
2. Valida en el servidor que la pregunta sea texto útil y que el año sea un entero dentro del intervalo permitido.
3. Guarda la clave del proveedor en una variable de entorno del servidor y léela mediante `runtimeConfig` privado de Nuxt. **No pongas la clave en `runtimeConfig.public`, en un componente Vue ni en el código que se envía al navegador.**
4. Desde el endpoint, llama al proveedor elegido y envíale la pregunta y el año como contexto explícito.
5. Devuelve una respuesta con una estructura estable, actualiza `status`, `result` y `error` en `useScenario()`, y muestra los estados de carga y error en la interfaz.
6. Prueba los casos de año mínimo, máximo, fuera de rango, pregunta vacía, error del proveedor y clave ausente.

La clave privada evita que cualquier visitante la extraiga del navegador. El endpoint también permite validar y limitar las peticiones antes de consumir la API.

## Orden recomendado para practicar

1. Instala y registra VueUse Motion; arranca la aplicación y confirma que Nuxt reconoce `v-motion`.
2. Cambia el contenido de `TimeLine.vue` por el control numérico y verifica que emite enteros dentro del rango.
3. Enlázalo con `v-model` desde `pages/index.vue` y comprueba que el año visible cambia al mover el control.
4. Añade la animación y revisa teclado, móvil y preferencia de movimiento reducido.
5. Solo después, modifica los tipos y el composable para enviar pregunta y año a un endpoint de servidor.

No implementes la llamada al modelo hasta tener decidido el proveedor, su esquema de respuesta y cómo gestionarás su clave. La interfaz puede funcionar y probarse con el año local antes de esa integración.