<template>
  <div class="max-w-xs mx-auto p-4">
    <h3 class="text-lg font-semibold text-slate-600 text-center mb-3">Indicador de Probabilidad</h3>

    <!-- Estado clínico -->
    <span
      :class="state.class"
      class="font-bold px-3 py-2 rounded-full uppercase tracking-wider text-sm shadow-md block text-center mb-4"
    >
      {{ state.text }}
    </span>

    <!-- Termómetro vertical estilizado -->
    <div class="relative h-64 w-10 mx-auto rounded-full bg-slate-200 shadow-inner overflow-hidden flex items-end">
      <div
        class="w-full flex items-center justify-center text-white font-bold text-sm"
        :style="{
          height: fillHeight + '%',
          background: fillColor,
          transition: 'height 0.6s ease-in-out'
        }"
      >
        <span v-if="probabilityValue > 10">{{ probabilityValue }}%</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

defineOptions({ name: 'ProbabilityThermometerVisual' })

// ✅ CORREGIDO: Cargar datos del localStorage igual que UserCard
const userData = ref<Record<string, any> | null>(null)
const probability = ref<number | null>(null)

// ✅ Usar la misma fórmula que UserCard
const probabilityValue = computed(() => +(((probability.value ?? 0) * 100).toFixed(1)))

const fillHeight = computed(() => probabilityValue.value)

const fillColor = computed(() => {
  const v = probabilityValue.value
  if (v < 20) return 'linear-gradient(to top, #a7f3d0, #34d399)'
  if (v < 40) return 'linear-gradient(to top, #fde68a, #facc15)'
  if (v < 60) return 'linear-gradient(to top, #fdba74, #fb923c)'
  if (v < 80) return 'linear-gradient(to top, #f87171, #ef4444)'
  return 'linear-gradient(to top, #dc2626, #991b1b)'
})

const state = computed(() => {
  const v = probabilityValue.value
  if (v < 30) {
    return {
      text: 'Seguro',
      class: 'bg-green-100 text-green-800 ring-2 ring-green-300/50 shadow-green-200/50'
    }
  } else if (v < 60) {
    return {
      text: 'Alerta',
      class: 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-300/50 shadow-yellow-200/50'
    }
  } else {
    return {
      text: 'Peligro',
      class: 'bg-red-100 text-red-800 ring-2 ring-red-300/50 shadow-red-200/50'
    }
  }
})

// ✅ CORREGIDO: Cargar del localStorage igual que UserCard
onMounted(() => {
  const stored = localStorage.getItem('user_data')
  if (stored) {
    const parsed = JSON.parse(stored)
    userData.value = parsed.input // 👈 igual que UserCard
    probability.value = parsed.probability // 👈 igual que UserCard
  }
})
</script>
