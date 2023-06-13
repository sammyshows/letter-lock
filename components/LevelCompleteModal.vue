<template>
  <div v-show="showLevelCompleteModal || hideLevelCompleteModal" :class="{ 'modal-slide-in': showLevelCompleteModal, 'modal-slide-out': hideLevelCompleteModal }" class="absolute flex flex-col items-center justify-between h-1/2 w-5/6 py-8 z-20 bg-gradient-to-br from-white to-slate-50 rounded-3xl text-center shadow-xl">
    <div class="text-ll-orange text-4xl font-bold">
      <p class="word-slide-left">LETTERS</p>
      <p class="word-slide-right">LOCKED</p>
    </div>
    <p v-html="HTMLText" class="px-6 text-xl text-slate-600"></p>
    <div class="flex flex-col justify-center gap-y-2 text-lg" :class="[ settings.testMode ? 'h-28 mt-4' : 'h-12' ]">
      <button v-if="settings.testMode" @click="$emit('resetLevel')" class="button-pulse self-center rounded-full bg-ll-orange text-white shadow-sm">Retry Level</button>
      <button @click="$emit('nextLevel')" class="button-pulse self-center rounded-full bg-purple-400 text-white font-medium shadow-sm">Next Level</button>
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from "pinia"
import { useGameStore } from "@/stores/game"
import { levelCompleteText } from "@/helpers/text"

export default defineComponent({
  name: 'Lives Modal',

  setup() {
    const gameStore = useGameStore()

    const { settings } = storeToRefs(gameStore)

    return { settings }
  },

  props: [
    'showLevelCompleteModal',
    'hideLevelCompleteModal'
  ],

  data() {
    return {
      HTMLText: levelCompleteText[Math.floor(Math.random() * levelCompleteText.length)]
    }
  }
})
</script>

<style scoped>
/* Word Slides */

@keyframes word-slide-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-16px);
  }
}

.word-slide-left {
  animation: word-slide-left forwards 1.3s ease-out;
  animation-delay: 0.3s;
}


@keyframes word-slide-right {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(16px);
  }
}

.word-slide-right {
  animation: word-slide-right forwards 1.3s ease-out;
  animation-delay: 0.3s;
}
</style>
