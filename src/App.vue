<script setup lang="ts">
import ChatScreen from './components/ChatScreen.vue'
import UserCard from './components/UserCard.vue'
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="custom-scrollbar flex-1 overflow-y-auto w-full mx-auto max-w-4xl px-16">
      <UserCard />
      <ChatScreen />
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
