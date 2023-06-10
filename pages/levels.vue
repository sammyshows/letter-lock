<template>
  <div class="h-full flex flex-col justify-between pt-20">
    <NuxtLink :to="{ path: '/' }" class="absolute top-4 left-4">
      <IconsArrowLeft class="h-10 w-10 md:w-20 md:h-20 md:ml-3 md:mt-2" />
    </NuxtLink>
    
    <h1 class="mt-8 font-medium text-4xl text-center" style="font-family: 'Luckiest Guy';">Level Selection</h1>

    <div class="flex justify-between items-center">
      <IconsChevron
        @click="prevPage"
        :class="{ 'opacity-30': currentPage == 1 }"
        class="w-10 h-10 mx-2 text-white" />

      <div class="grid grid-cols-4 gap-3 mt-4 mb-4">
        <div 
          v-for="n in 20"
          @click="goToLevel(n)"
          class="h-14 w-14 bg-gray-200 flex items-center justify-center rounded-full"
          :class="[
            (n + (currentPage - 1) * 20) <= maxLevelId ? 'bg-ll-orange' : 'bg-slate-300'
          ]"
          :key="n + (currentPage - 1) * 20"
        >
          {{ n + (currentPage - 1) * 20 }}
        </div>
      </div>
      
      <IconsChevron
        @click="nextPage" 
        :class="{ 'opacity-30': (currentPage * 20) > maxLevelId }"
        class="w-10 h-10 mx-2 rotate-180 text-white" />
    </div>

    <div class="h-32"></div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia"
import { useGameStore } from "@/stores/game";

export default {
  name: "Levels",

  setup() {
    const gameStore = useGameStore()

    const { maxLevelId } = storeToRefs(gameStore)

    return { gameStore, maxLevelId }
  },

  data() {
    return {
      currentPage: 1, 
    }
  },

  methods: {
    goToLevel(num) {
      this.gameStore.setCurrentLevel(num + (this.currentPage - 1) * 20)
      this.$router.push({ path: `/game` })
    },

    nextPage() {
      if ((this.currentPage * 20) < this.maxLevelId)
        this.currentPage++
    },

    prevPage() {
      if(this.currentPage > 1) {
        this.currentPage--
      }
    }
  }
}
</script>