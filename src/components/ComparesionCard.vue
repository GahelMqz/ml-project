<script lang="ts" setup>
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LinearScale } from 'chart.js'
import { Scatter } from 'vue-chartjs'
import { ref, onMounted, computed } from 'vue'

// Registrar componentes de Chart.js
ChartJS.register(Title, Tooltip, Legend, PointElement, LinearScale)

// Leer datos del localStorage
const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
const filteredData = JSON.parse(localStorage.getItem('filtered_data') || '[]')

const similarCasesCount = computed(() => filteredData.length)

// Computar sobrevivientes y no sobrevivientes
const survivedCount = computed(() => filteredData.filter((d: any) => d.survived === 1).length)
const notSurvivedCount = computed(() => filteredData.filter((d: any) => d.survived === 0).length)

// Extraer info del usuario
const userPoint = {
  x: userData.input.age,
  y: userData.input.bmi,
  probability: userData.probability,
}

// Separar filtrados según supervivencia
const survivedPoints = filteredData.filter((d: any) => d.survived === 1)
const notSurvivedPoints = filteredData.filter((d: any) => d.survived === 0)

// Configurar la data de la gráfica
const chartData = ref({
  datasets: [
    {
      label: 'Sobrevivió',
      data: survivedPoints.map((d: any) => ({ x: d.age, y: d.bmi })),
      backgroundColor: 'rgba(144, 238, 144, 0.7)', // Verde pastel
      pointRadius: 6,
    },
    {
      label: 'No sobrevivió',
      data: notSurvivedPoints.map((d: any) => ({ x: d.age, y: d.bmi })),
      backgroundColor: 'rgba(255, 182, 193, 0.7)', // Rosa pastel
      pointRadius: 6,
    },
    {
      label: `Tú (Probabilidad: ${(userPoint.probability * 100).toFixed(1)}%)`,
      data: [{ x: userPoint.x, y: userPoint.y }],
      backgroundColor: 'rgba(255, 215, 0, 1)', // Amarillo fuerte para destacar
      pointRadius: 10,
      pointStyle: 'star', // Icono tipo estrella para resaltar
      borderColor: 'black',
      borderWidth: 2,
    },
  ],
})

// Opciones visuales de la gráfica
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#444',
        font: { size: 14 },
      },
    },
    title: {
      display: true,
      text: `Comparación de Edad e IMC con Casos Similares`,
      color: '#333',
      font: { size: 18, weight: 'bold' },
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          if (context.dataset.label.includes('Tú')) {
            return `Edad: ${context.parsed.x}, IMC: ${context.parsed.y}, Prob: ${(userPoint.probability * 100).toFixed(1)}%`
          }
          return `Edad: ${context.parsed.x}, IMC: ${context.parsed.y}`
        },
      },
    },
  },
  scales: {
    x: {
      title: { display: true, text: 'Edad', color: '#555', font: { size: 14 } },
      ticks: { color: '#666' },
    },
    y: {
      title: { display: true, text: 'IMC (BMI)', color: '#555', font: { size: 14 } },
      ticks: { color: '#666' },
    },
  },
})
</script>

<template>
  <div class="p-6 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto">
    <div class="mb-4 text-gray-700">
      <p class="text-lg font-semibold">
        Casos similares encontrados: <span class="text-purple-600">{{ similarCasesCount }}</span>
      </p>
      <p class="text-sm text-gray-500">
        Sobrevivientes: <span class="text-green-600 font-medium">{{ survivedCount }}</span> | No
        sobrevivientes: <span class="text-red-500 font-medium">{{ notSurvivedCount }}</span>
      </p>
    </div>

    <div class="h-[500px]">
      <Scatter :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
body {
  background: #f8f9fa;
}
</style>
