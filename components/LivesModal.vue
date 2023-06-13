<template>
  <div v-show="showLivesModal || hideLivesModal" class="absolute h-full w-full flex justify-center items-center z-20">
    <div class="h-full w-full bg-transparent absolute" @click="$emit('close')"></div>
    
    <div :class="[{ 'utility-modal-slide-in': showLivesModal,  'utility-modal-slide-out': hideLivesModal }, rewardAdsLoaded > 0 ? 'h-1/2 justify-between' : 'h-2/5 justify-around' ]" class="absolute flex flex-col items-center w-5/6 py-6 z-30 bg-gradient-to-br from-white to-slate-50 rounded-3xl text-center shadow-xl">
      <div @click="$emit('close')" class="absolute -top-5 -right-5">
        <div class="z-10 absolute  top-2 right-2  w-10 h-10 rounded-full bg-white"></div>
        <IconsX class="absolute z-40 -top-0 -right-0  w-14 h-14 text-red-400" />
      </div>

      <div>
        <p class="word-slide-left ml-6 text-ll-orange text-3xl font-bold drop-shadow-sm">NO MORE</p>
        <p class="word-slide-right mr-6 text-ll-orange text-3xl font-bold drop-shadow-sm">LIVES</p>
      </div>

      <div class="w-3/4 flex justify-between items-center">
        <div :class="{ 'heart-pulse': showHeart }" class="relative w-min h-min flex justify-center -rotate-6">
          <IconsHeart class="h-20 w-20 text-pink-500 drop-shadow-xl" />
          <div class="absolute w-full h-full top-0 flex justify-center items-center text-3xl font-medium">{{ lives.count }}</div>
        </div>

        <div class="w-3/5">
          <div class="w-full flex flex-col justify-center items-center ml-auto">
            <span class="text-xl text-slate-600">Next life in:</span>
            <span class="px-6 rounded-full text-xl text-slate-500 font-bold bg-orange-200">{{ lifeRemainingTime }}</span>
          </div>
        </div>
      </div>

      <div v-if="rewardAdsLoaded > 0" class="w-full h-24 flex items-center text-lg">
        <div class="w-full flex justify-between pl-8 pr-4">
          <div class="relative w-1/4 h-min flex justify-center drop-shadow">
            <IconsHeart class="h-12 w-12 text-pink-500 drop-shadow-xl" />
            <div class="absolute w-full h-full top-0 flex justify-center items-center text-base font-medium">+1</div>
          </div>
          <div class="w-3/4 flex justify-center">
            <ButtonsWatchAd @click="watchRewardAd()" text="Watch Ad!" />
          </div>
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
    'showLivesModal',
    'hideLivesModal'
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
    },

    showLiveseModal(newValue) {
      if (!newValue)
      this.showHeart = false
    }
  },

  methods: {
    watchRewardAd() {
      const lifeReward = {
        type: 'lives',
        quantity: 1
      }

      this.adStore.showRewardAd(lifeReward)
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

<style>
/* 'Next' button size changer */

.button-pulse {
  animation: button-pulse 1.5s infinite alternate;
}

@keyframes button-pulse {
  0%, 100% {
    padding: 10px 32px;
  }

  50% {
    padding: 11px 38px;
  }
}




@keyframes heart-pulse {
  0% {
    transform: scale(1) rotate(-6deg);
  }
  30% {
    transform: scale(1.2) rotate(12deg);
  }
  40% {
    transform: scale(1.2) rotate(12deg);
  }
  48% {
    transform: scale(1.08) rotate(-13deg);
  }
  57% {
    transform: scale(1) rotate(-6deg);
  }
  100% {
    transform: rotate(-6deg);
  }
}

.heart-pulse {
  animation: heart-pulse 4s ease-out infinite;
}
</style>