<template>
  <div class="min-h-screen h-full flex flex-col justify-center items-center bg-gradient-to-b from-blue-600 via-blue-400 to-blue-300">
    <div class="absolute top-0 left-0 z-10 mt-10 px-4">
      <NuxtLink :to="{ path: '/' }">
        <IconsArrowLeft class="h-10 w-10" />
      </NuxtLink>
    </div>
    <span class="mt-10 ml-5 text-3xl">Level Data</span>

    <div class="w-full flex justify-center mt-5 text-xl text-ll-orange">
      <span class="w-32 text-center">Level</span>
      <span class="w-32 text-center">Best Moves</span>
    </div>

    <div class="w-full flex flex-col items-center grow mt-2 overflow-scroll">
      <div v-for="(value, key) in levelHistory" class="w-full flex justify-center">
        <p class="w-32 text-center">Level {{ key }}:</p>
        <p class="w-32 text-center">{{ levels[key].maxMoves - value.bestRemainingMoves }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from "pinia"
import { useGameStore } from "@/stores/game"
import levels from "@/helpers/levels"

export default defineComponent({
  name: 'Level Data',

  setup() {
    const gameStore = useGameStore()
    const { levelHistory, stats } = storeToRefs(gameStore)

    console.log('stats', stats)

    return { levelHistory, stats }
  },

  data() {
    return {
      levels: levels
    }
  }
})
</script>