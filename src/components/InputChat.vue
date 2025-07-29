<script setup lang="ts">
import IconArrowUp from '@/components/icons/IconArrowUp.vue'
import { ref } from 'vue'
import { useChatWizard } from '@/chatWizard'
import { askLLM, buildMedicalPrompt } from '@/openAi'

const emit = defineEmits(['newMessage'])

const mensaje = ref('')
const textarea = ref<HTMLTextAreaElement | null>(null)
const wizard = useChatWizard()
const loading = ref(false)

const autoResize = () => {
  const el = textarea.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

const sendReply = async () => {
  if (!mensaje.value || loading.value) return
  loading.value = true

  emit('newMessage', { from: 'user', text: mensaje.value })

  // 🔍 Obtener pregunta actual (tipo clínico)
  const currentQuestion = wizard.getCurrentQuestion?.() // ej: 'smoking_status'

  // 🧠 Interpretar con LLM usando prompt contextual
  emit('newMessage', { from: 'system', text: 'Interpretando tu respuesta' })

  let interpreted = ''
  if (currentQuestion) {
    const prompt = buildMedicalPrompt(mensaje.value, currentQuestion)
    interpreted = await askLLM(prompt)
  } else {
    interpreted = await askLLM(
      `${mensaje.value}\nConvierte esta respuesta en un valor clínico entendible.`,
    )
  }

  emit('newMessage', { from: 'bot', text: `🤖 ${interpreted.trim()}` })

  // 🧪 Procesar con wizard usando respuesta del modelo
  const result = await wizard.handleResponse(interpreted.trim())

  if (result.includes('No entendí')) {
    emit('newMessage', { from: 'bot', text: `⚠️ ${result}` })
  } else if (result.includes('procesada')) {
    emit('newMessage', { from: 'bot', text: `✅ ${result}` })
    const json = wizard.getResult()
    emit('newMessage', { from: 'json', text: JSON.stringify(json, null, 2) })
  } else {
    emit('newMessage', { from: 'bot', text: `${result}` })
  }

  mensaje.value = ''
  emit('newMessage', { from: 'remove-system' })
  loading.value = false
}

const handleKeydown = (e: any) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendReply()
    mensaje.value = ''
  }
}
</script>

<template>
  <div class="flex gap-2 mb-8">
    <textarea
      @keydown="handleKeydown"
      name=""
      id=""
      ref="textarea"
      v-model="mensaje"
      placeholder="Escribe tus respuestas..."
      class="custom-scrollbar w-full max-h-40 rounded-4xl py-4 px-8 border-2 border-blue-200 focus:outline-none shadow-md shadow-blue-200 resize-none bg-gradient-to-br from-white to-blue-100"
      @input="autoResize"
    ></textarea>

    <div class="content-center">
      <button
        :disabled="!mensaje.trim() || loading"
        @click="sendReply"
        class="bg-gradient-to-r from-[#0055ff] to-[#4080ff] hover:from-[#0055ff] hover:bg-[#4080ff] transition-all duration-200 transform hover:scale-105 rounded-full p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IconArrowUp />
      </button>
    </div>
  </div>
</template>

<style scoped>
textarea {
  /* background-color: white; */
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
