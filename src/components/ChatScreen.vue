<template>
  <div class="h-screen flex flex-col">
    <div class="flex-1 overflow-y-auto p-8">
      <TransitionGroup tag="div" name="slide" class="space-y-4" appear>
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="getAnimationClass(msg)"
          class="mb-4"
        >
          <div v-if="msg.from === 'bot'" class="flex items-start gap-2">
            <span class="bg-blue-100 p-2 rounded-full"
              ><img src="../assets/logo.webp" class="h-6 w-6"
            /></span>
            <p class="bg-blue-100 p-4 rounded-3xl">
              {{ msg.text }}
            </p>
          </div>

          <div
            v-else-if="msg.from === 'user'"
            class="flex items-start justify-end gap-2 text-right"
          >
            <p class="bg-slate-200 p-4 rounded-3xl">{{ msg.text }}</p>
            <span class="bg-slate-200 p-2 rounded-full"> <IconUser /> </span>
          </div>
          <div
            v-else-if="msg.from === 'system'"
            class="text-gray-500 italic flex items-center gap-2 animate-pulse"
          >
            <span class="material-symbols-outlined animate-spin"> progress_activity </span>
            {{ msg.text }}
          </div>
          <div v-else-if="msg.from === 'json'" class="bg-gray-100 p-4 rounded-md font-mono text-sm">
            <pre>{{ msg.text }}</pre>
          </div>
          <div v-else-if="msg.from === 'error'" class="text-red-500">⚠️ {{ msg.text }}</div>
        </div>
      </TransitionGroup>
    </div>
    <!-- Aquí va el input -->
    <div class="w-full mx-auto max-w-4xl p-4">
      <InputChat :onNewMessage="handleNewMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Transition } from 'vue'
import InputChat from './InputChat.vue'
import { useChatWizard } from '../chatWizard'
import { onMounted } from 'vue'
import IconUser from './icons/IconUser.vue'

// Mensajes acumulados
const messages = ref<{ text: string; from: 'bot' | 'user' | 'system' | 'json' | 'error' }[]>([])

const wizard = useChatWizard()

onMounted(() => {
  const primeraPregunta = wizard.nextQuestion()
  if (primeraPregunta) {
    messages.value.push({ from: 'bot', text: `${primeraPregunta}` })
  }
})

// Función que recibe nuevos mensajes desde InputChat
const handleNewMessage = (msg: {
  text: string
  from: 'bot' | 'user' | 'system' | 'json' | 'error'
}) => {
  messages.value.push(msg)
}

function getAnimationClass(msg: any) {
  if (msg.from === 'bot') return 'slide-from-left'
  if (msg.from === 'user') return 'slide-from-right'
  return ''
}
</script>

<style scoped>
.chat-screen {
  max-width: 768px;
  margin: 0 auto;
}
/* Transición general */
.slide-enter-active {
  transition: all 0.6s ease;
}
.slide-leave-active {
  transition: all 0.2s ease;
  opacity: 0;
}

/* Entrada desde la izquierda */
.slide-from-left.slide-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}
.slide-from-left.slide-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

/* Entrada desde la derecha */
.slide-from-right.slide-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.slide-from-right.slide-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>
