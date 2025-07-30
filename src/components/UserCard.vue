<template>
  <div
    class="bg-gradient-to-br from-white to-blue-100 rounded-2xl shadow-md shadow-blue-200 transition-all duration-400 p-8 max-w-md w-full border-2 border-blue-200 overflow-hidden relative"
    v-if="userData"
  >
    <!-- Decorative corner element -->
    <div class="absolute top-0 left-0 w-16 h-16 bg-blue-200 rounded-br-full opacity-20"></div>

    <div class="relative z-10">
      <!-- Header Section -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <IconUser />
          </div>
          <h2 class="font-bold">Tu información</h2>
        </div>
        <span
          :class="stateUser((probability ?? 0) * 100).class"
          class="font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-md"
        >
          {{ stateUser((probability ?? 0) * 100).text }}
        </span>
      </div>

      <!-- Data Grid -->
      <div class="grid grid-cols-2 gap-6 mb-8">
        <div class="bg-blue-50/50 rounded-xl p-4 transition-transform">
          <span class="text-[#0055ff] font-semibold block mb-1">Edad</span>
          <span class="text-slate-400">{{ userData.age }} años</span>
        </div>

        <div class="bg-blue-50/50 rounded-xl p-4 transition-transform">
          <span class="text-[#0055ff] font-semibold block mb-1">Género</span>
          <span class="text-slate-400">{{ userData.gender === 0 ? 'Masculino' : 'Femenino' }}</span>
        </div>

        <div class="bg-blue-50/50 rounded-xl p-4 transition-transform">
          <span class="text-[#0055ff] font-semibold block mb-1">IMC</span>
          <span class="text-slate-400">{{ userData.bmi }}</span>
        </div>

        <div class="bg-blue-50/50 rounded-xl p-4 transition-transform">
          <span class="text-[#0055ff] font-semibold block mb-1">Nivel de coresterol</span>
          <span class="text-slate-400 truncate">{{ userData.cholesterol_level }} mg/dL</span>
        </div>

        <div class="bg-blue-50/50 rounded-xl p-4 transition-transform">
          <span class="text-[#0055ff] font-semibold block mb-1">Tipo de fumador</span>
          <span class="text-slate-400">{{ transformSmoking_status(userData.smoking_status) }}</span>
        </div>

        <div class="bg-blue-50/50 rounded-xl p-4 transition-transform">
          <span class="text-[#0055ff] font-semibold block mb-1"
            >Probabilidad de desarrollar cáncer</span
          >
          <span class="text-slate-400 truncate">{{
            probability !== null ? (probability * 100).toFixed(1) + '%' : 'N/A'
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import IconUser from './icons/IconUser.vue'

const userData = ref<Record<string, any> | null>(null)
const probability = ref<number | null>(null)

const stateUser = (value: number) => {
  if (value < 30) {
    return {
      text: 'Seguro',
      class: 'bg-green-100 text-green-800 ring-2 ring-green-300/50 shadow-green-200/50',
    }
  } else if (value >= 30 && value < 60) {
    return {
      text: 'Alerta',
      class: 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-300/50 shadow-yellow-200/50',
    }
  } else if (value >= 60) {
    return {
      text: 'Peligro',
      class: 'bg-red-100 text-red-800 ring-2 ring-red-300/50 shadow-red-200/50',
    }
  } else {
    return {
      text: 'Desconocido',
      class: 'bg-slate-200 text-slate-400 ring-2 ring-slate-300/50 shadow-slate-200/50',
    }
  }
}

const transformSmoking_status = (value: number) => {
  switch (value) {
    case 0:
      return 'Nunca has fumado'
    case 1:
      return 'Fumador pasivo'
    case 2:
      return 'Ex fumador'
    case 3:
      return 'Actualmente fumas'
    default:
      return 'Desconocido'
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
