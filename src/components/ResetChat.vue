<script setup lang="ts">
import IconReset from '@/components/icons/IconReset.vue'

const resetChat = () => {
  localStorage.clear()
  window.location.reload()
}
</script>

<template>
  <div class="w-full flex justify-between mt-2">
    <div class="flex items-center gap-2">
      <img src="../assets/logo.webp" class="h-10 w-10 object-cover" />
      <div>
        <h1 class="font-bold text-[#0055ff]">Médico Virtual</h1>
      </div>
    </div>

    <button
      @click="resetChat"
      class="flex items-center gap-2 cursor-pointer hover:bg-slate-200 transition-all duration-200 transform hover:scale-105 p-2 rounded-full font-semibold"
    >
      <IconReset /> Reiniciar chat
    </button>
  </div>
</template>
