<script setup lang="ts">
import IconArrowDown from './components/icons/IconArrowDown.vue'
import InputChat from './components/InputChat.vue'
import ResetChat from './components/ResetChat.vue'
import Test from './components/Test.vue'
import Test2 from './components/Test2.vue'
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="sticky top-0 mt-2 mx-8">
      <ResetChat />
    </div>

    <div class="custom-scrollbar flex-1 overflow-y-auto w-full mx-auto max-w-4xl px-16">
      <!-- Aqui iran las respuestas -->
      <p>Respuestas...</p>

      <div
        class="p-2 rounded-full bg-slate-400/30 fixed bottom-2/11 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <IconArrowDown />
      </div>
    </div>

    <div class="sticky bottom-0 w-full mx-auto max-w-4xl">
      <InputChat />
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  right: 20px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 4px;
}
</style>
