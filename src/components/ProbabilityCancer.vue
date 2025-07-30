<template>
  <div
    :class="stateProbability((probability ?? 0) * 100).class"
    class="px-6 py-4 rounded-xl shadow-md flex-col text-center mb-8"
  >
    <!-- <span class="material-symbols-outlined animate-spin text-[#0055ff]"
              >progress_activity</span
            > -->
    <IconLoading />
    <h1 :class="stateProbability((probability ?? 0) * 100).textColor" class="font-bold text-3xl">
      {{ probability !== null ? (probability * 100).toFixed(1) + '%' : 'N/A' }}
    </h1>
    <p class="text-slate-400 text-xl">Probabilidad de desarrollar cáncer pulmonar</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const userData = ref<Record<string, any> | null>(null)
const probability = ref<number | null>(null)

const stateProbability = (value: number) => {
  if (value < 30) {
    return {
      class: 'bg-green-100 ring-2 ring-green-300/50 shadow-green-200/50',
      textColor: 'text-green-800',
    }
  } else if (value >= 30 && value < 60) {
    return {
      class: 'bg-yellow-100 ring-2 ring-yellow-300/50 shadow-yellow-200/50',
      textColor: 'text-yellow-800',
    }
  } else if (value >= 60) {
    return {
      class: 'bg-red-100 ring-2 ring-red-300/50 shadow-red-200/50',
      textColor: 'text-red-800',
    }
  } else {
    return {
      class: 'bg-slate-200 text-slate-400 ring-2 ring-slate-300/50 shadow-slate-200/50',
    }
  }
}

onMounted(() => {
  const stored = localStorage.getItem('user_data')
  if (stored) {
    const parsed = JSON.parse(stored)
    userData.value = parsed.input // 👈 aquí está el cambio clave
    probability.value = parsed.probability
  }
})
</script>
