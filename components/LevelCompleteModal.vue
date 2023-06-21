<template>
  <div v-show="showLevelCompleteModal || hideLevelCompleteModal" :class="{ 'modal-slide-in': showLevelCompleteModal, 'modal-slide-out': hideLevelCompleteModal }" class="absolute flex flex-col items-center justify-between h-1/2 w-5/6 py-8 z-20 bg-gradient-to-br from-white to-slate-50 rounded-3xl text-center shadow-xl sm:py-12 sm:w-2/3 sm:h-1/2 sm:rounded-5xl">
    <div class="text-ll-orange text-4.5xl leading-11 font-bold tracking-widest sm:text-6xl lg:text-7.5xl" style="font-family: 'Luckiest Guy';">
      <p class="word-slide-left">LETTERS</p>
      <p class="word-slide-right">LOCKED</p>
    </div>
    <p v-html="HTMLText" class="px-6 text-xl font-medium text-slate-500 sm:text-4xl lg:text-5xl"></p>
    <div class="flex flex-col justify-center gap-y-2 text-lg sm:text-3xl lg:text-4.5xl" :class="[ settings.testMode ? 'h-28 mt-4' : 'h-16' ]">
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
.button-pulse {
  animation: button-pulse 1.5s infinite alternate;
}

@keyframes button-pulse {
  0%, 100% {
    padding: 10px 32px;
  }

  50% {
    padding: 11px 38px;
  }
}

@media (min-width: 640px) {
  @keyframes button-pulse {
    0%, 100% {
      padding: 13px 40px;
    }

    50% {
      padding: 14px 48px;
    }
  }
}

@media (min-width: 1024px) {
  @keyframes button-pulse {
    0%, 100% {
      padding: 18px 48px;
    }

    50% {
      padding: 22px 60px;
    }
  }
}


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

@media (min-width: 640px) {
  @keyframes word-slide-left {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-2rem);
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
      transform: translateX(2rem);
    }
  }

  .word-slide-right {
    animation: word-slide-right forwards 1.3s ease-out;
    animation-delay: 0.3s;
  }
}
</style>
