<template>
  <div class="h-full w-full bg-gradient-to-b from-blue-600 via-blue-400 to-blue-300 overflow-hidden">
    <NuxtPage v-if="gameStateLoaded" />
  </div>
</template>

<script>
import { useGameStore } from "@/stores/game";
import { useAdsStore } from "@/stores/ads";

export default {
  name: 'App',

  setup() {
    const gameStore = useGameStore()
    const adsStore = useAdsStore()

    return { gameStore, adsStore }
  },

  data() {
    return {
      gameStateLoaded: false
    }
  },

  async created() {
    await this.gameStore.setInitialState()
    this.adsStore.initialiseRewardAd()
    this.adsStore.prepareRewardAd()
    this.gameStateLoaded = true
  }
}
</script>
