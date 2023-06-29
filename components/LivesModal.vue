<template>
  <div v-show="showLivesModal || hideLivesModal" class="absolute h-full w-full flex justify-center items-center z-20">
    <div class="h-full w-full bg-transparent absolute" @click="$emit('close')"></div>
    
    <div :class="[{ 'utility-modal-slide-in': showLivesModal,  'utility-modal-slide-out': hideLivesModal }, offerLife ? 'h-1/2 justify-between' : 'h-2/5 justify-around' ]" class="modal-padding absolute flex flex-col items-center w-5/6 z-30 bg-gradient-to-br from-white to-slate-50 rounded-3xl text-center shadow-xl sm:py-8 sm:w-2/3 sm:rounded-5xl lg:py-12">
      <div @click="$emit('close')" class="absolute -top-4 -right-4 xs:-top-5 xs:-right-5 md:-top-8 md:-right-8 lg:-top-12 lg:-right-12">
        <div class="z-10 absolute top-2 right-2 w-6 h-6 xs:w-10 xs:h-10 rounded-full bg-white md:w-16 md:h-16 lg:w-20 lg:h-20 lg:top-6 lg:right-6"></div>
        <IconsX class="absolute z-40 -top-0 -right-0 w-10 h-10 xs:w-14 xs:h-14 text-red-400 md:w-20 md:h-20 lg:w-28 lg:h-28" />
      </div>

      <div class="text-ll-orange text-4xl font-bold tracking-widest drop-shadow-sm sm:text-5-5xl sm:leading-14 lg:text-7xl" style="font-family: 'Luckiest Guy';">
        <p class="word-slide-left ml-6 sm:ml-14">GET MORE</p>
        <p class="word-slide-right mr-6 sm:mr-14">LIVES</p>
      </div>

      <div class="w-3/4 flex justify-between items-center">
        <div :class="[ showHeart ? 'heart-pulse' : '-rotate-6' ]" class="relative w-min h-min flex justify-center">
          <IconsHeart class="h-16 w-16 xs:h-20 xs:w-20 text-pink-500 drop-shadow-xl sm:h-28 sm:w-28 lg:h-36 lg:w-36" />
          <div class="absolute w-full h-full top-0 flex justify-center items-center text-3xl font-medium sm:text-5xl lg:text-6xl">{{ lives.count }}</div>
        </div>

        <div class="w-3/5">
          <div class="w-full flex flex-col justify-center items-center ml-auto">
            <span class="text-xl text-slate-600 sm:text-4xl lg:text-5xl">Next life in:</span>
            <span class="px-6 rounded-full text-xl text-slate-500 font-bold bg-orange-200 sm:mt-2 sm:text-4xl sm:px-10 sm:py-1 lg:mt-4 lg:text-5-5xl lg:py-4 lg:px-14">{{ lifeRemainingTime }}</span>
          </div>
        </div>
      </div>

      <div v-if="offerLife" class="w-full h-24 flex items-center text-lg">
        <div class="w-full flex justify-between pl-8 pr-4">
          <div class="relative w-1/4 h-min flex justify-center drop-shadow">
            <IconsHeart class="h-12 w-12 text-pink-500 drop-shadow-xl sm:h-20 sm:w-20 lg:h-28 lg:w-28" />
            <div class="absolute w-full h-full top-0 flex justify-center items-center text-base font-medium sm:text-3xl lg:text-4-5xl">+1</div>
          </div>
          <div class="w-3/4 flex justify-center">
            <ButtonsWatchAd @watchAd="watchRewardAd()" text="Watch Ad!" />
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

  mounted() {
    if (this.rewardAdsLoaded <= 0)
      this.adStore.prepareRewardAd()

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

  data() {
    return {
      lifeRemainingTime: '',
      lifeTimeInterval: 0,
      processingLife: false,
      showHeart: false,
      livesProvided: 0
    }
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
    },

    rewardAdsLoaded(newValue) {
      if (newValue <= 0)
        this.adStore.prepareRewardAd()
    }
  },

  computed: {
    offerLife() {
      return this.rewardAdsLoaded > 0 && this.livesProvided <= 2 && this.lives.count < this.maxLives
    }
  },

  methods: {
    watchRewardAd() {
      const lifeReward = {
        type: 'additionalLife',
        quantity: 1
      }

      this.adStore.showRewardAd(lifeReward)
      this.livesProvided += 1
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

<style scoped>
.modal-padding {
  padding: 1.5rem 0;
}

@media (max-width: 320px) {
  .modal-padding {
    padding: 0.75rem 0;
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