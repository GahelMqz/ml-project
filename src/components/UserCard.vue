<template>
  <div
    class="bg-gradient-to-br from-white to-blue-100 rounded-2xl shadow-md shadow-blue-200 transition-all duration-400 p-8 max-w-md w-full border-2 border-blue-200 overflow-hidden relative mb-8"
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
          <span class="text-[#0055ff] font-semibold block mb-1">IMC {{ userData.bmi }}</span>
          <span :class="stateImc(userData.bmi).class"> {{ stateImc(userData.bmi).text }}</span>
        </div>

        <div class="bg-blue-50/50 rounded-xl p-4 transition-transform">
          <span class="text-[#0055ff] font-semibold block mb-1"
            >Coresterol {{ userData.cholesterol_level }} mg/dL</span
          >
          <span :class="stateCoresterol(userData.cholesterol_level).class">{{
            stateCoresterol(userData.cholesterol_level).text
          }}</span>
        </div>

        <div class="bg-blue-50/50 rounded-xl p-4 transition-transform">
          <span class="text-[#0055ff] font-semibold block mb-1">Tipo de fumador</span>
          <span class="text-slate-400">{{
            transformSmoking_status(userData.smoking_status).text
          }}</span>
        </div>

        <div class="bg-blue-50/50 rounded-xl p-4 transition-transform">
          <span class="text-[#0055ff] font-semibold block mb-1"
            >Probabilidad de desarrollar cáncer</span
          >
          <span class="text-slate-400">{{
            probability !== null ? (probability * 100).toFixed(1) + '%' : 'N/A'
          }}</span>
        </div>
      </div>
    </div>
  </div>

  <div
    class="bg-gradient-to-br from-white to-pink-100 rounded-2xl shadow-md shadow-pink-200 transition-all duration-400 p-8 max-w-md w-full border-2 border-pink-200 overflow-hidden relative"
    v-if="userData"
  >
    <!-- Decorative corner element -->
    <div class="absolute top-0 left-0 w-16 h-16 bg-pink-200 rounded-br-full opacity-20"></div>

    <div class="relative z-10">
      <!-- Header Section -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
            <IconHearth />
          </div>
          <h2 class="font-bold">Recomendaciones</h2>
        </div>
      </div>

      <!-- Data Grid -->
      <div class="grid grid-cols-2 gap-6 mb-8">
        <div class="bg-pink-50/50 rounded-xl p-4 transition-transform col-span-2">
          <div class="flex gap-2 items-center justify-between mb-4">
            <span class="text-pink-600 font-semibold block mb-1"
              >En tu % de desarrollar cáncer</span
            >
            <span
              :class="stateUser((probability ?? 0) * 100).class"
              class="font-semibold px-2 py-1 rounded-full tracking-wider shadow-md"
            >
              {{ probability !== null ? (probability * 100).toFixed(1) + '%' : 'N/A' }}
            </span>
          </div>

          <p
            class="text-slate-400 mb-2"
            v-for="(tips, index) in stateUser((probability ?? 0) * 100).tips"
            :key="index"
          >
            <span class="text-pink-600">● </span>{{ tips }}
          </p>
        </div>

        <div class="bg-pink-50/50 rounded-xl p-4 transition-transform col-span-2">
          <div class="flex gap-2 items-center justify-between mb-4">
            <span class="text-pink-600 font-semibold block mb-1"
              >Según el tipo de fumador que eres</span
            >
            <span
              class="font-semibold text-center px-2 py-1 rounded-full tracking-wider shadow-md bg-slate-100 text-slate-800 ring-2 ring-slate-300/50 shadow-slate-200/50"
            >
              {{ transformSmoking_status(userData.smoking_status).text }}
            </span>
          </div>

          <p
            class="text-slate-400 mb-2"
            v-for="(tips, index) in transformSmoking_status(userData.smoking_status).tips"
            :key="index"
          >
            <span class="text-pink-600">● </span>{{ tips }}
          </p>
        </div>

        <div class="bg-pink-50/50 rounded-xl p-4 transition-transform col-span-2">
          <div class="flex gap-2 items-center justify-between mb-4">
            <span class="text-pink-600 font-semibold block mb-1">En tu IMC</span>
            <span
              :class="stateImc(userData.bmi).bgClass"
              class="font-semibold px-2 py-1 rounded-full tracking-wider shadow-md"
            >
              {{ stateImc(userData.bmi).text }}
            </span>
          </div>

          <p
            class="text-slate-400 mb-2"
            v-for="(tips, index) in stateImc(userData.bmi).tips"
            :key="index"
          >
            <span class="text-pink-600">● </span>{{ tips }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import IconUser from './icons/IconUser.vue'
import IconHearth from './icons/IconHearth.vue'

const userData = ref<Record<string, any> | null>(null)
const probability = ref<number | null>(null)

const stateUser = (value: number) => {
  if (value < 30) {
    return {
      text: 'Seguro',
      class: 'bg-green-100 text-green-800 ring-2 ring-green-300/50 shadow-green-200/50',
      tips: ['No fumes ni empieces', 'Evita humo de segunda mano', 'Haz ejercicio y come sano'],
    }
  } else if (value >= 30 && value < 60) {
    return {
      text: 'Alerta',
      class: 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-300/50 shadow-yellow-200/50',
      tips: [
        'Deja de fumar ya, aunque sea poco',
        'Usa mascarilla en lugares con polvo o químicos',
        'Ventila bien tu casa',
        'Hazte chequeos si tienes tos persistente',
      ],
    }
  } else if (value >= 60) {
    return {
      text: 'Peligro',
      class: 'bg-red-100 text-red-800 ring-2 ring-red-300/50 shadow-red-200/50',
      tips: [
        'Dejar de fumar urgente',
        'Consulta médica para evaluación pulmonar',
        'Hazte una tomografía de baja dosis si tienes más de 50 años y fumas',
        'Evita ambientes con humo, gases o polvos tóxicos',
      ],
    }
  } else {
    return {
      text: 'Desconocido',
      class: 'bg-slate-200 text-slate-400 ring-2 ring-slate-300/50 shadow-slate-200/50',
    }
  }
}

const stateImc = (value: number) => {
  if (value < 18.5) {
    return {
      text: 'Bajo peso',
      class: 'text-slate-600 ',
      bgClass: 'bg-slate-100 text-slate-800 ring-2 ring-slate-300/50 shadow-slate-200/50',
      tips: [
        'Aumentar la ingesta calórica con alimentos densos en nutrientes (aguacate, nueces, granos enteros)',
        'Incluir 5–6 comidas al día',
        'Agregar snacks nutritivos entre comidas (yogur, batidos de frutas con proteína)',
        'Incorporar ejercicios de fuerza para ganar masa muscular',
      ],
    }
  } else if (value >= 18.5 && value <= 24.9) {
    return {
      text: 'Peso saludable',
      class: 'text-green-600',
      bgClass: 'bg-green-100 text-green-800 ring-2 ring-green-300/50 shadow-green-200/50',
      tips: [
        'Seguir una dieta balanceada con frutas, verduras, proteínas magras y cereales integrales.',
        'Controlar porciones y evitar el exceso de azúcares y grasas saturadas.',
        'Hacer actividad física moderada al menos 150 minutos por semana.',
        'Mantener hidratación adecuada (mínimo 2 L de agua al día).',
      ],
    }
  } else if (value >= 25 && value <= 29.9) {
    return {
      text: 'Sobrepeso',
      class: 'text-yellow-600',
      bgClass: 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-300/50 shadow-yellow-200/50',
      tips: [
        'Reducir el consumo de alimentos ultraprocesados, frituras y bebidas azucaradas',
        'Priorizar verduras, proteínas magras y cereales integrales',
        'Comer despacio y con atención',
        'Realizar actividad física regular (mínimo 30–60 min al día)',
      ],
    }
  } else {
    return {
      text: 'Obesidad',
      class: 'text-red-600',
      bgClass: 'bg-red-100 text-red-800 ring-2 ring-red-300/50 shadow-red-200/50',
      tips: [
        'Consultar a un profesional de salud para un plan personalizado',
        'Seguir una dieta hipocalórica supervisada, rica en nutrientes',
        'Aumentar progresivamente la actividad física',
        'Controlar el entorno alimentario y emociones ligadas a la comida',
      ],
    }
  }
}

const stateCoresterol = (value: number) => {
  if (value < 200) {
    return {
      text: 'Deseable ',
      class: 'text-green-600',
    }
  } else if (value >= 200 && value <= 239) {
    return {
      text: 'Límite alto',
      class: 'text-yellow-600',
    }
  } else {
    return {
      text: 'Muy alto',
      class: 'text-red-600',
    }
  }
}

const transformSmoking_status = (value: number) => {
  switch (value) {
    case 0:
      return {
        text: 'Nunca has fumado',
        tips: [
          'No empieces, ni por curiosidad',
          'Evita lugares con humo',
          'Mantén un estilo de vida saludable',
        ],
      }
    case 1:
      return {
        text: 'Fumador pasivo',
        tips: [
          'Aléjate de fumadores o exige espacios libres de humo',
          'Ventila bien tu casa',
          'Usa purificadores si vives con fumadores',
        ],
      }
    case 2:
      return {
        text: 'Ex fumador',
        tips: [
          'No recaigas: evita tentaciones',
          'Haz ejercicio y cuida tus pulmones',
          'Haz chequeos médicos regulares',
        ],
      }
    case 3:
      return {
        text: 'Actualmente fumas',
        tips: [
          'Deja de fumar lo antes posible',
          'Busca ayuda médica o terapias',
          'Reduce poco a poco si no puedes dejarlo de golpe',
        ],
      }
    default:
      return { text: 'Desconocido', tips: ['No hay información disponible'] }
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
