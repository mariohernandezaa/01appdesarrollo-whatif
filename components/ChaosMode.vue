<template>
  <ClientOnly>
    <Teleport to="body">
      <div class="chaos-exempt">
        <img
          v-if="active"
          ref="img"
          src="/img/fotorandom.jpeg"
          alt=""
          class="chaos-exempt chaos-bouncer"
        />
        <button
          type="button"
          class="chaos-exempt chaos-toggle"
          aria-label="???"
          @click="toggle"
        />
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
const active = ref(false)
const img = ref<HTMLImageElement | null>(null)

let raf = 0
let x = 0
let y = 0
let vx = 0
let vy = 0

function step() {
  const el = img.value
  if (!el) return
  const maxX = window.innerWidth - el.offsetWidth
  const maxY = window.innerHeight - el.offsetHeight
  x += vx
  y += vy
  if (x <= 0 || x >= maxX) {
    vx = -vx
    x = Math.min(Math.max(x, 0), Math.max(maxX, 0))
  }
  if (y <= 0 || y >= maxY) {
    vy = -vy
    y = Math.min(Math.max(y, 0), Math.max(maxY, 0))
  }
  el.style.transform = `translate(${x}px, ${y}px)`
  raf = requestAnimationFrame(step)
}

async function start() {
  active.value = true
  await nextTick()
  x = Math.random() * window.innerWidth * 0.5
  y = Math.random() * window.innerHeight * 0.5
  const speed = 3.5
  const angle = (Math.random() * 0.5 + 0.2) * Math.PI / 2
  vx = Math.cos(angle) * speed * (Math.random() < 0.5 ? -1 : 1)
  vy = Math.sin(angle) * speed * (Math.random() < 0.5 ? -1 : 1)
  raf = requestAnimationFrame(step)
}

function stop() {
  cancelAnimationFrame(raf)
  active.value = false
}

function toggle() {
  if (active.value) {
    document.documentElement.classList.remove('chaos')
    stop()
  } else {
    document.documentElement.classList.add('chaos')
    start()
  }
}

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  document.documentElement.classList.remove('chaos')
})
</script>

<style scoped>
.chaos-toggle {
  position: fixed;
  bottom: 4px;
  left: 50%;
  width: 28px;
  height: 10px;
  margin-left: -14px;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0.04;
  cursor: pointer;
  z-index: 2147483647;
}

.chaos-toggle:hover {
  opacity: 0.25;
}

.chaos-bouncer {
  position: fixed;
  top: 0;
  left: 0;
  width: 200px;
  filter: none;
  border-radius: 8px;
  box-shadow: 0 0 0 4px #fff, 0 0 0 8px #000, 0 0 24px 8px rgba(0, 0, 0, 0.6);
  height: auto;
  pointer-events: none;
  z-index: 2147483646;
  will-change: transform;
}
</style>
