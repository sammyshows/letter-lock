<template>
  <div v-show="showAllLevelsCompleteModal || hideAllLevelsCompleteModal" class="absolute h-full w-full flex justify-center items-center z-20">
    <div class="h-full w-full bg-transparent absolute" @click="$emit('close')"></div>
    
    <div :class="{ 'utility-modal-slide-in': showAllLevelsCompleteModal,  'utility-modal-slide-out': hideAllLevelsCompleteModal }" class="absolute flex flex-col items-center justify-between h-1/2 w-5/6 py-6 z-30 bg-gradient-to-br from-white to-slate-50 rounded-3xl text-center shadow-xl">
      <div @click="$emit('close')" class="absolute -top-5 -right-5">
        <div class="z-10 absolute  top-2 right-2  w-10 h-10 rounded-full bg-white"></div>
        <IconsX class="absolute z-40 -top-0 -right-0  w-14 h-14 text-red-400" />
      </div>

      <div>
        <p class="word-slide-left ml-8 text-ll-orange text-3xl font-bold drop-shadow-sm">ALL LEVELS</p>
        <p class="word-slide-right mr-8 text-ll-orange text-3xl font-bold drop-shadow-sm">COMPLETE</p>
      </div>

      <div class="px-6 text-slate-500">
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
  ]
})
</script>