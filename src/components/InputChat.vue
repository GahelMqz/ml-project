<script setup lang="ts">
import IconArrowUp from '@/components/icons/IconArrowUp.vue'
import { ref } from 'vue'

const mensaje = ref('')
const textarea = ref(null)

const autoResize = () => {
  const el = textarea.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}
</script>

<template>
  <div class="flex gap-2 mb-8 mx-16">
    <textarea
      name=""
      id=""
      ref="textarea"
      v-model="mensaje"
      placeholder="Pregunta lo que quieras..."
      class="custom-scrollbar w-full max-h-40 rounded-4xl py-4 px-8 border-2 border-slate-200 focus:outline-none shadow-md shadow-slate-200 resize-none"
      @input="autoResize"
    />

    <div class="content-center">
      <button class="bg-[#0055ff] hover:bg-[#4080ff] rounded-full p-2 cursor-pointer">
        <IconArrowUp />
      </button>
    </div>
  </div>
</template>

<style scoped>
textarea {
  background-color: white;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  right: 20px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.4);
  border-radius: 4px;
}
</style>
