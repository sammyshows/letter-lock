<template>
  <div class="h-full w-full bg-gradient-to-b from-blue-600 via-blue-400 to-blue-300 overflow-hidden">
    <NuxtPage v-if="gameStateLoaded" />
  </div>
</template>

<script>
import { useGameStore } from "@/stores/game";

export default {
  name: 'App',

  setup() {
    const gameStore = useGameStore()

    return { gameStore }
  },

  data() {
    return {
      gameStateLoaded: false
    }
  },

  async created() {
    await this.gameStore.setInitialState()
    this.gameStateLoaded = true
  }
}
</script>
