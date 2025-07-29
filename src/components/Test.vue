<template>
  <div
    class="card bg-gradient-to-br from-white to-blue-100 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-400 p-8 max-w-md w-full border border-blue-200 overflow-hidden relative"
  >
    <!-- Decorative corner element -->
    <div class="absolute top-0 left-0 w-16 h-16 bg-blue-200 rounded-br-full opacity-20"></div>

    <div class="relative z-10">
      <!-- Header Section -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4">
          <div
            class="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center animate-pulse"
          >
            <svg
              class="w-7 h-7 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9-5 9 5-9 5z"
              />
            </svg>
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ patientName }}</h2>
        </div>
        <span
          :class="statusBadgeClass"
          class="text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm"
        >
          {{ patientStatus }}
        </span>
      </div>

      <!-- Data Grid -->
      <div class="grid grid-cols-2 gap-6 mb-8">
        <div class="bg-blue-50/50 rounded-xl p-4 transition-transform hover:scale-105">
          <span class="text-blue-700 font-semibold text-sm block mb-1">ID Paciente</span>
          <span class="font-bold text-gray-900 text-lg">{{ patientId }}</span>
        </div>

        <div class="bg-blue-50/50 rounded-xl p-4 transition-transform hover:scale-105">
          <span class="text-blue-700 font-semibold text-sm block mb-1">Edad</span>
          <span class="font-bold text-gray-900 text-lg">{{ age }} años</span>
        </div>

        <div class="bg-blue-50/50 rounded-xl p-4 transition-transform hover:scale-105">
          <span class="text-blue-700 font-semibold text-sm block mb-1">Última Consulta</span>
          <span class="font-bold text-gray-900 text-lg">{{ lastVisit }}</span>
        </div>

        <div class="bg-blue-50/50 rounded-xl p-4 transition-transform hover:scale-105">
          <span class="text-blue-700 font-semibold text-sm block mb-1">Diagnóstico</span>
          <span class="font-bold text-gray-900 text-lg truncate">{{ diagnosis }}</span>
        </div>

        <div class="bg-blue-50/50 rounded-xl p-4 transition-transform hover:scale-105 col-span-2">
          <span class="text-blue-700 font-semibold text-sm block mb-1">Médico Asignado</span>
          <span class="font-bold text-gray-900 text-lg">{{ doctor }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4">
        <button
          class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold transform hover:scale-105 shadow-md hover:shadow-lg"
          @click="$emit('view-details', patientId)"
        >
          Ver Detalles
        </button>
        <button
          class="px-6 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 rounded-lg hover:from-gray-300 hover:to-gray-400 transition-all duration-300 font-semibold transform hover:scale-105 shadow-md hover:shadow-lg"
          @click="$emit('edit', patientId)"
        >
          Editar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MedicalCard',
  props: {
    patientName: {
      type: String,
      required: true,
    },
    patientId: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    lastVisit: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    doctor: {
      type: String,
      required: true,
    },
    patientStatus: {
      type: String,
      default: 'Estable',
    },
  },
  computed: {
    statusBadgeClass() {
      const statusClasses = {
        Estable: 'bg-green-100 text-green-800 ring-2 ring-green-300/50 shadow-green-200/50',
        Crítico: 'bg-red-100 text-red-800 ring-2 ring-red-300/50 shadow-red-200/50',
        'En Observación':
          'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-300/50 shadow-yellow-200/50',
      }
      return (
        statusClasses[this.patientStatus] ||
        'bg-gray-100 text-gray-800 ring-2 ring-gray-300/50 shadow-gray-200/50'
      )
    },
  },
}
</script>

<style scoped>
.card {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(145deg, #ffffff, #e6f0ff);
  transition:
    transform 0.4s ease-in-out,
    box-shadow 0.4s ease-in-out;
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
}
button {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>
