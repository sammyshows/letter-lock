<template>
  <div v-show="showLoseLifeModal || hideLoseLifeModal" :class="{ 'modal-slide-in': showLoseLifeModal,  'modal-slide-out': hideLoseLifeModal }" class="absolute flex flex-col items-center justify-between h-1/2 w-5/6 py-8 z-20 bg-gradient-to-br from-white to-slate-50 rounded-3xl text-center shadow-xl">
    <div @click="$emit('close', false)" class="absolute top-2 right-3">
      <IconsX class="absolute z-40 -top-0 -right-0  w-8 h-8 text-red-400" />
    </div>

    <div class="relative text-ll-orange text-4xl font-bold">
      <p class="word-slide-left mr-4">LETTERS</p>
      <p class="drop-not absolute bottom-1.5 -left-8 text-2xl text-purple-400 underline underline-offset-2 opacity-0">NOT</p>
      <p class="word-slide-right ml-4">LOCKED</p>
    </div>

    <p class="px-6 text-slate-600">This level isn't finished, are you sure you want to leave now?</p>

    <ButtonsGiveUp @giveUp="$emit('close', true)" text="Play On!" />
  </div>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game";
import { useAdsStore } from "@/stores/ads";

export default defineComponent({
  name: 'Lives Modal',

  setup() {
    const gameStore = useGameStore()
    const adStore = useAdsStore()

    const { lives, maxLives } = storeToRefs(gameStore)
    const { rewardAdsLoaded } = storeToRefs(adStore)

    return { gameStore, adStore, lives, maxLives, rewardAdsLoaded }
  },

  props: [
    'showLoseLifeModal',
    'hideLoseLifeModal'
  ]
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

