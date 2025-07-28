<template>
  <div class="chat-screen p-8">
    <div v-for="(msg, index) in messages" :key="index" class="mb-4">
      <div v-if="msg.from === 'bot'" class="flex items-start gap-2">
        <span>👨‍⚕️</span>
        <p class="bg-blue-100 p-4 rounded-xl">{{ msg.text }}</p>
      </div>
      <div v-else-if="msg.from === 'user'" class="flex items-start justify-end gap-2 text-right">
        <p class="bg-green-100 p-4 rounded-xl">{{ msg.text }}</p>
        <span>🧍</span>
      </div>
      <div v-else-if="msg.from === 'system'" class="text-gray-500 italic">
        🤖 {{ msg.text }}
      </div>
      <div v-else-if="msg.from === 'json'" class="bg-gray-100 p-4 rounded-md font-mono text-sm">
        <pre>{{ msg.text }}</pre>
      </div>
      <div v-else-if="msg.from === 'error'" class="text-red-500">
        ⚠️ {{ msg.text }}
      </div>
    </div>

    <!-- Aquí va el input -->
    <InputChat :onNewMessage="handleNewMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputChat from './InputChat.vue'
import { useChatWizard } from '../chatWizard'
import { onMounted } from 'vue'

// Mensajes acumulados
const messages = ref<
  { text: string; from: 'bot' | 'user' | 'system' | 'json' | 'error' }[]
>([])

const wizard = useChatWizard()

onMounted(() => {
  const primeraPregunta = wizard.nextQuestion()
  if (primeraPregunta) {
    messages.value.push({ from: 'bot', text: `👨‍⚕️ ${primeraPregunta}` })
  }
})

// Función que recibe nuevos mensajes desde InputChat
const handleNewMessage = (msg: { text: string; from: 'bot' | 'user' | 'system' | 'json' | 'error' }) => {
  messages.value.push(msg)
}
</script>

<style scoped>
.chat-screen {
  max-width: 768px;
  margin: 0 auto;
}
</style>
