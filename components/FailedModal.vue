<template>
  <div v-show="showFailedModal || hideFailedModal || false" :class="{ 'modal-slide-in': showFailedModal,  'modal-slide-out': hideFailedModal }" class="absolute flex flex-col items-center justify-between h-1/2 w-5/6 py-8 z-20 bg-gradient-to-br from-white to-slate-50 rounded-3xl text-center shadow-xl">
    <div @click="$emit('close', true)" class="absolute top-2 right-3">
      <IconsX class="absolute z-40 -top-0 -right-0  w-8 h-8 text-red-400" />
    </div>

    <div class="relative text-ll-orange text-4xl font-bold">
      <p class="word-slide-left mr-4">LETTERS</p>
      <p class="drop-not absolute bottom-1.5 -left-8 text-2xl text-purple-400 underline underline-offset-2 opacity-0">NOT</p>
      <p class="word-slide-right ml-4">LOCKED</p>
    </div>
    <p class="px-6 text-slate-600">Oh no! You are so close to locking all the words!</p>
    <div v-if="allowExtraMoves" class="flex justify-center items-center mt-3 text-green-500 drop-shadow">
        <span class="text-3xl font-medium">+3</span>
        <IconsArrowsLeftRight class="w-12 h-12 ml-2" />
      </div>
    <div class="flex flex-col justify-center gap-y-2 w-full h-16 text-lg">
      <div class="h-3/5 flex justify-center">
        <ButtonsWatchAd v-if="allowExtraMoves" @watchAd="watchRewardAd" text="Play On!" />
        <div v-else @click="$emit('close', true)" class="button-pulse flex self-center rounded-full bg-gradient-to-br from-red-300 to-red-500 focus:from-red-400 focus:to-red-600">
          <button class="text-sm text-white font-medium shadow-sm drop-shadow">Try Again</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game";
import { useAdsStore } from "@/stores/ads";
import { Preferences } from "@capacitor/preferences";

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
    'showFailedModal',
    'hideFailedModal',
    'allowExtraMoves'
  ],

  data() {
    return {
      lifeRemainingTime: '',
      lifeTimeInterval: 0,
      processingLife: false,
      showHeart: false
    }
  },

  mounted() {
    setTimeout(() => this.showHeart = true, 2000)

    this.updateLifeRemainingTime();
    this.lifeTimeInterval = window.setInterval(() => {
      if (this.lives.count < this.maxLives) {
        this.updateLifeRemainingTime();
      }
    }, 1000);
  },

  beforeUnmount() {
    clearInterval(this.lifeTimeInterval);
  },

  watch: {
    settings: {
      async handler(newValue) {
        await Preferences.set({
          key: 'letterlock-settings',
          value: JSON.stringify(newValue)
        })
      },
      deep: true
    }
  },

  methods: {
    async watchRewardAd() {
      const moveReward = {
        type: 'additionalMoves',
        quantity: 3
      }

      this.adStore.showRewardAd(moveReward)
    },

    updateLifeRemainingTime() {
      if (this.processingLife || this.lives.count >= this.maxLives)
        return '00:00';

      const secondsRemaining = Math.floor((this.lives.nextLifeTime || 0) / 1000 - (Date.now() / 1000))

      if (secondsRemaining <= 0)
        this.gameStore.handleLives(1)

      const minutes = Math.floor(secondsRemaining / 60);
      const seconds = secondsRemaining % 60;

      // Ensure minutes and seconds are always two digits
      const twoDigitMinutes = String(minutes).padStart(2, '0');
      const twoDigitSeconds = String(seconds).padStart(2, '0');

      this.lifeRemainingTime = `${twoDigitMinutes}:${twoDigitSeconds}`
    }
  }
})
</script>

