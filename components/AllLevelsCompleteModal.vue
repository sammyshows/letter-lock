<template>
  <div v-show="showAllLevelsCompleteModal || hideAllLevelsCompleteModal" class="absolute h-full w-full flex justify-center items-center z-20">
    <div class="h-full w-full bg-transparent absolute" @click="$emit('close')"></div>
    
    <div :class="{ 'utility-modal-slide-in': showAllLevelsCompleteModal,  'utility-modal-slide-out': hideAllLevelsCompleteModal }" class="modal-padding absolute flex flex-col items-center justify-between h-1/2 w-5/6 z-30 bg-gradient-to-br from-white to-slate-50 rounded-3xl text-center shadow-xl sm:py-8 sm:w-2/3 sm:rounded-5xl lg:py-12">
      <div @click="$emit('close')" class="absolute -top-4 -right-4 xs:-top-5 xs:-right-5 md:-top-8 md:-right-8 lg:-top-12 lg:-right-12">
        <div class="z-10 absolute top-2 right-2 w-6 h-6 xs:w-10 xs:h-10 rounded-full bg-white md:w-16 md:h-16 lg:w-20 lg:h-20 lg:top-6 lg:right-6"></div>
        <IconsX class="absolute z-40 -top-0 -right-0 w-10 h-10 xs:w-14 xs:h-14 text-red-400 md:w-20 md:h-20 lg:w-28 lg:h-28" />
      </div>

      <div class="text-ll-orange text-3xl font-bold tracking-widest drop-shadow-sm sm:text-6xl lg:text-7xl" style="font-family: 'Luckiest Guy';">
        <p class="word-slide-left ml-8 sm:ml-16">ALL LEVELS</p>
        <p class="word-slide-right mr-8 sm:mr-16">COMPLETE</p>
      </div>

      <div class="px-6 text-slate-500 text-sm xs:text-base sm:text-2xl lg:text-4xl">
        <p class="text-center">Congratulations! You are one of very <strong class="font-medium">FEW</strong> people to complete <strong class="font-medium">EVERY</strong> level!</p>
        <br>
        <p class="text-center">If you have enjoyed <strong class="font-medium">Letter Lock</strong> so far, please let us know by leaving a review and we will bring more levels to you soon!</p>
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
    'showAllLevelsCompleteModal',
    'hideAllLevelsCompleteModal'
  ],

  hideAllLevelsCompleteModal(newValue) {
    if (newValue)
      playSound('swoosh')
  }
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
</style>