<script setup lang="ts">
import IconLoading from '@/components/icons/IconLoading.vue'
</script>

<template>
  <transition name="fade">
    <div
      class="fixed inset-0 z-50 bg-gradient-to-r from-[#0055ff]/30 to-[#4080ff]/30 backdrop-blur-sm flex items-center justify-center"
    >
      <div
        class="bg-gradient-to-br from-white to-blue-100 border-4 border-blue-200 px-6 py-4 rounded-xl shadow-md shadow-blue-200 flex-col animate-pulse text-center"
      >
        <!-- <span class="material-symbols-outlined animate-spin text-[#0055ff]"
              >progress_activity</span
            > -->
        <IconLoading />
        <h1 class="font-bold text-3xl">✨ Generando tu predicción</h1>
        <p class="text-slate-400 text-xl">Esto puedo tomar algunos minutos</p>
      </div>
    </div>
  </transition>
</template>
