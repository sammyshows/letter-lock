<template>
  <div v-show="showLetterSwapReminderModal || hideLetterSwapReminderModal" class="absolute h-full w-full flex justify-center items-center z-20">
    <div class="h-full w-full bg-transparent absolute" @click="$emit('close')"></div>
    
    <div :class="{ 'utility-modal-slide-in': showLetterSwapReminderModal,  'utility-modal-slide-out': hideLetterSwapReminderModal }" class="modal-padding absolute flex flex-col items-center justify-between h-5/12 w-5/6 z-30 bg-gradient-to-br from-white to-slate-50 rounded-3xl text-center shadow-xl sm:py-8 sm:w-2/3 sm:rounded-5xl lg:py-12">
      <div @click="$emit('close')" class="absolute -top-4 -right-4 xs:-top-5 xs:-right-5 md:-top-8 md:-right-8 lg:-top-12 lg:-right-12">
        <div class="z-10 absolute top-2 right-2 w-6 h-6 xs:w-10 xs:h-10 rounded-full bg-white md:w-16 md:h-16 lg:w-20 lg:h-20 lg:top-6 lg:right-6"></div>
        <IconsX class="absolute z-40 -top-0 -right-0 w-10 h-10 xs:w-14 xs:h-14 text-red-400 md:w-20 md:h-20 lg:w-28 lg:h-28" />
      </div>

      <div class="text-ll-orange text-3xl font-bold tracking-widest drop-shadow-sm sm:text-6xl lg:text-7xl" style="font-family: 'Luckiest Guy';">
        <p class="word-slide-left ml-8 sm:ml-16">SWAP</p>
        <p class="word-slide-right mr-8 sm:mr-16">LETTERS</p>
      </div>

      <div class="grow w-full h-full flex flex-col px-6 text-slate-500">
        <p class="grow flex justify-center items-center text-center font-medium text-sm xs:text-base sm:text-2xl lg:text-3xl">Quick reminder - you can swap two letters:</p>

        <div class="grow flex justify-center items-center mt-4">
          <div class="grow flex justify-center items-center">
            <div class="tile flex justify-center items-center bg-white rounded-lg shadow-lg rounded-12pc">
              <p class="w-full h-full relative text-blue-700 font-medium text-3xl flex justify-center items-center sm:text-5xl lg:text-6xl"></p>
            </div>
            <div class="relative flex items-center" style="margin-left: 3%; gap: 5%">
              <div class="tile-animate tile flex justify-center items-center bg-white rounded-lg shadow-lg rounded-12pc">
                <p class="w-full h-full relative text-blue-700 font-medium text-3xl flex justify-center items-center sm:text-5xl lg:text-6xl">B</p>
              </div>

              <IconsArrowsLeftRight class="absolute translate-x-1/2 translate-y-1/2 right-1/2 bottom-1/2 animate-pulse h-8 w-8 absolute text-ll-orange duration-700 z-30 sm:h-16 sm:w-16 lg:h-20 lg:w-20" />

              <div class="tile-animate-reverse tile flex justify-center items-center bg-white rounded-lg shadow-lg rounded-12pc">
                <p class="w-full h-full relative text-blue-700 font-medium text-3xl flex justify-center items-center sm:text-5xl lg:text-6xl">C</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div></div>
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game";
import { useAdsStore } from "@/stores/ads";

export default defineComponent({
  name: 'All Levels Complete Modal',

  setup() {
    const gameStore = useGameStore()
    const adStore = useAdsStore()

    const { lives, maxLives } = storeToRefs(gameStore)
    const { rewardAdsLoaded } = storeToRefs(adStore)

    return { gameStore, adStore, lives, maxLives, rewardAdsLoaded }
  },

  props: [
    'showLetterSwapReminderModal',
    'hideLetterSwapReminderModal'
  ]
})
</script>

<style scoped>
.modal-padding {
  padding: 1.5rem 0;
}

@media (max-width: 320px) {
  .modal-padding {
    padding: 0.75rem 0;
  }
}



.tile {
  width: 20vw;
  height: 20vw;
}

@media (min-width: 640px) {
  .tile {
    width: 15vw;
    height: 15vw;
  }
}

@media (min-width: 1024px) {
  .play-button {
    animation: size-change-lg 1.5s infinite alternate;
  }
}

@media (max-width: 320px) {
  .play-button {
    animation: size-change-xs 1.5s infinite alternate;
  }
}



.tile-animate {
  animation: tile-animate 3s ease-in-out infinite;
  animation-delay: 1s;
}

.tile-animate-reverse {
  animation: tile-animate-reverse 3s ease-in-out infinite;
  animation-delay: 1s;
}

@keyframes tile-animate {
  0% {
    transform: translateX(0);
  }
  15% {
    transform: translateX(0);
  }
  35% {
    transform: translateX(110%);
  }
  65% {
    transform: translateX(110%);
  }
  85% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes tile-animate-reverse {
  0% {
    transform: translateX(0);
  }
  15% {
    transform: translateX(0);
  }
  35% {
    transform: translateX(-110%);
  }
  65% {
    transform: translateX(-110%);
  }
  85% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(0);
  }
}
</style>