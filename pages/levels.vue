<template>
  <div :class="[ platform === 'ios' ? 'pt-10' : 'pt-4' ]" class="h-full flex flex-col justify-between">
    <NuxtLink :to="{ path: '/' }" @click="playSound('click')" :class="[ platform === 'ios' ? 'top-10' : 'top-4' ]" class="absolute left-4" style="touch-action: manipulation;">
      <IconsArrowLeft class="h-10 w-10 sm:w-20 sm:h-20 sm:ml-3 sm:mt-2 lg:w-24 lg:h-24 lg:ml-5 lg:mt-3" />
    </NuxtLink>
    
    <h1 class="mt-16 xs:mt-28 font-medium text-4xl text-center sm:mt-36 sm:text-7xl lg:mt-44 lg:text-8xl" style="font-family: 'Luckiest Guy';">Level Selection</h1>

    <div class="flex justify-between items-center">
      <IconsChevron
        @click="prevPage"
        :class="{ 'opacity-30': currentPage == 1 }"
        class="grow w-10 h-10 mx-2 text-white sm:w-20 sm:h-20 lg:w-32 lg:h-32" />

      <div class="grid grid-cols-4 gap-3 mt-4 mb-4 sm:mt-10">
        <div 
          v-for="n in 20"
          @click="goToLevel(n)"
          style="font-family: Luckiest Guy;"
          class="h-9 w-9 xs:h-14 xs:w-14 bg-gray-200 flex items-center justify-center rounded-full text-2xl pt-2 sm:h-28 sm:w-28 sm:text-5xl lg:h-36 lg:w-36 lg:text-7xl lg:pt-4"
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
        :class="{ 'opacity-30': (currentPage * 20) >= maxLevelId }"
        class="grow w-10 h-10 mx-2 rotate-180 text-white sm:w-20 sm:h-20 lg:w-32 lg:h-32" />
    </div>

    <div class="h-32"></div>

    <LivesModal v-if="showLivesModal || hideLivesModal"
                :showLivesModal="showLivesModal"
                :hideLivesModal="hideLivesModal"
                @close="closeLivesModal" />

    <div :class="[ showLivesModal ? 'opacity-1' : 'opacity-0' ]" class="fixed top-0 left-0 right-0 bottom-0 backdrop-blur duration-500 pointer-events-none z-10"></div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia"
import { Capacitor } from "@capacitor/core"
import { useGameStore } from "@/stores/game";


export default {
  name: "Levels",

  setup() {
    const gameStore = useGameStore()

    const { maxLevelId, lives, settings } = storeToRefs(gameStore)

    return { gameStore, maxLevelId, lives, settings }
  },

  mounted() {
    this.currentPage = Math.ceil(this.maxLevelId / 20)
  },

  data() {
    return {
      platform: Capacitor.getPlatform(),
      currentPage: 1,
      showLivesModal: false,
      hideLivesModal: false
    }
  },

  methods: {
    async goToLevel(num) {
      playSound('click')

      if ((num + (this.currentPage - 1) * 20) <= this.maxLevelId || this.settings.testMode) {
        if (this.lives.count > 0) {
          this.gameStore.setCurrentLevel(num + (this.currentPage - 1) * 20)
          this.gameStore.startLevel()
        } else {
          await this.gameStore.checkLives()

          if (this.lives.count > 0) {
            this.gameStore.setCurrentLevel(num + (this.currentPage - 1) * 20)
            this.gameStore.startLevel()
          } else {
            this.showLivesModal = true
          }
        }
      }
    },

    nextPage() {
      if ((this.currentPage * 20) < this.maxLevelId || this.settings.testMode)
        this.currentPage++
    },

    prevPage() {
      if (this.currentPage > 1)
        this.currentPage--
    },

    closeLivesModal() {
      this.hideLivesModal = true

      // Not the prettiest, but this resets the modal animations 
      setTimeout(() => {
        this.showLivesModal = false
        this.hideLivesModal = false
      }, 700) // delay should match utility-modal-slide-out time
    },
  }
}
</script>