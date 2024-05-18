<template>
  <div v-show="showLoseLifeModal || hideLoseLifeModal" 
    :class="{ 'modal-slide-in': showLoseLifeModal,  'modal-slide-out': hideLoseLifeModal }" 
    class="modal-padding absolute flex flex-col items-center justify-between h-1/2 w-5/6 bg-gradient-to-br from-white to-slate-50 rounded-3xl text-center shadow-xl z-20 sm:py-10 sm:w-2/3 sm:h-3/5 sm:rounded-5xl">
    <div @click="$emit('close', false)" class="absolute top-2 right-3 sm:top-3 sm:right-4 lg:top-4 lg:right-5">
      <IconsX class="absolute z-40 -top-0 -right-0 w-8 h-8 text-red-400 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
    </div>

    <div class="relative text-ll-orange text-4-5xl font-bold tracking-widest leading-11 sm:text-6xl lg:text-7-5xl" style="font-family: 'Luckiest Guy';">
      <p class="word-slide-left mr-4">LETTERS</p>
      <p class="drop-not absolute bottom-2 -left-5 xs:bottom-3 xs:-left-7 text-2xl tracking-wide text-purple-400 underline underline-offset-2 sm:text-4xl sm:-left-11 sm:bottom-4 lg:text-5xl lg:-left-16 lg:bottom-7" style="font-family: 'Poppins';">NOT</p>
      <p class="word-slide-right ml-4">LOCKED</p>
    </div>

    <p class="px-6 font-medium text-slate-500 text-lg sm:text-4xl lg:text-5xl">This level isn't finished, are you sure you want to leave now?</p>

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
  ],

  watch: {
    hideLoseLifeModal(newValue) {
      if (newValue)
        playSound('swoosh')
    }
  }
})
</script>

<style scoped>
.modal-padding {
  padding: 2rem 0;
}

@media (max-width: 320px) {
  .modal-padding {
    padding: 1rem 0;
  }
}



/* Word Slides */

@keyframes word-slide-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-1rem);
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
    transform: translateX(1rem);
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






/* Dropping the word NOT in the modal :) */

@keyframes drop-not {
  0% {
    opacity: 0;
    /* transform: scale(0.1) rotate(12deg); */
  }
  84% {
    opacity: 0;
  }
  85% {
    opacity: 1;
    transform: scale(2.5) rotate(12deg);
  }
  88% {
    opacity: 1;
    transform: scale(2.2) rotate(12deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(12deg);
  }
}

.drop-not {
  animation: drop-not forwards 2s ease-out;
}
</style>

