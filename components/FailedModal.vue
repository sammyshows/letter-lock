<template>
  <div v-show="showFailedModal || hideFailedModal" :class="{ 'modal-slide-in': showFailedModal,  'modal-slide-out': hideFailedModal }"
    class="absolute flex flex-col items-center justify-between h-1/2 w-5/6 py-8 z-20 bg-gradient-to-br from-white to-slate-50 rounded-3xl text-center shadow-xl sm:py-10 sm:w-2/3 sm:h-3/5 sm:rounded-5xl">
    <div @click="$emit('close', true)" class="absolute top-2 right-3 sm:top-3 sm:right-4 lg:top-4 lg:right-5">
      <IconsX class="absolute z-40 -top-0 -right-0 w-8 h-8 text-red-400 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
    </div>

    <div class="relative text-ll-orange text-4xl font-bold tracking-widest sm:text-6-5xl sm:leading-18 lg:text-7-5xl lg:leading-22" style="font-family: 'Luckiest Guy';">
      <p class="word-slide-left mr-4">LETTERS</p>
      <p class="drop-not absolute bottom-1.5 -left-7 text-2xl text-purple-400 tracking-wide underline underline-offset-2 opacity-0 sm:text-4-5xl sm:-left-14 sm:bottom-8 lg:text-5xl lg:-left-16 lg:bottom-10" style="font-family: 'Poppins';">NOT</p>
      <p class="word-slide-right ml-4">LOCKED</p>
    </div>

    <p v-html="HTMLText" :class="[ fontSizeClass(offerExtraMoves ? 1 : 2) ]" class="px-6 font-medium text-slate-500"></p>

    <div v-if="offerExtraMoves" class="flex justify-center items-center mt-3 text-green-500 drop-shadow">
      <span class="pt-3 text-4xl font-medium tracking-widest sm:pt-5 sm:text-6xl lg:text-7-5xl" style="font-family: 'Luckiest Guy';">+3</span>
      <IconsArrowsLeftRight class="w-12 h-12 ml-2 sm:w-16 sm:h-16 lg:w-24 lg:h-24" />
    </div>
    
    <div class="flex flex-col justify-center gap-y-2 w-full h-16 text-lg sm:h-24 lg:h-36">
      <div class="h-3/5 flex justify-center text-sm sm:text-3xl lg:text-4-5xl">
        <ButtonsWatchAd v-if="offerExtraMoves" @watchAd="watchRewardAd" text="Play On!" />
        <div v-else @click="$emit('close', true)" class="button-pulse flex self-center rounded-full bg-gradient-to-br from-rose-300 to-rose-500 focus:from-red-400 focus:to-red-600">
          <button class="text-white font-medium shadow-sm drop-shadow" style="touch-action: manipulation;">Try Again</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import { Preferences } from "@capacitor/preferences";
import { useGameStore } from "@/stores/game";
import { useAdsStore } from "@/stores/ads";
import { levelFailedText, levelFailedWatchAdText } from "@/helpers/text";

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
      showHeart: false,
      adDisabled: false // Set to true once ad is shown, reset to false when modal is closed
    }
  },

  computed: {
    offerExtraMoves() {
      return this.allowExtraMoves && this.rewardAdsLoaded > 0
    },

    HTMLText() {
      return this.offerExtraMoves ? levelFailedWatchAdText[Math.floor(Math.random() * levelFailedWatchAdText.length)] : levelFailedText[Math.floor(Math.random() * levelFailedText.length)]
    },
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
    watchRewardAd() {
      if (this.adDisabled) return

      const moveReward = {
        type: 'additionalMoves',
        quantity: 3
      }

      this.adStore.showRewardAd(moveReward)
      this.adDisabled = true
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
    },

    fontSizeClass(classNumber) {
      const sizeClasses = {
        1: {
          '': 'text-base',
          'sm': 'text-xl',
          'md': 'text-3xl',
          'lg': 'text-4-5xl',
          'xl': 'text-5xl'
        },

        2: {
          '' : 'text-lg',
          'sm': 'text-2xl',
          'md': 'text-4xl',
          'lg': 'text-5xl',
          'xl': 'text-5xl'
        }
      }

      const currentScreenWidth = window.innerWidth;
      let screen = '';

      if (currentScreenWidth >= 1280) screen = 'xl';
      else if (currentScreenWidth >= 1024) screen = 'lg';
      else if (currentScreenWidth >= 768) screen = 'md';
      else if (currentScreenWidth >= 640) screen = 'sm';

      return sizeClasses[classNumber][screen];
    }
  }
})
</script>

<style scoped>
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

@media (min-width: 640px) {
  @keyframes button-pulse {
    0%, 100% {
      padding: 15px 46px;
    }

    50% {
      padding: 16px 56px;
    }
  }
}

@media (min-width: 1024px) {
  @keyframes button-pulse {
    0%, 100% {
      padding: 22px 56px;
    }

    50% {
      padding: 26px 70px;
    }
  }
}





/* Word Slides */

@keyframes word-slide-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-1rem);
  }
}

.word-slide-left {
  animation: word-slide-left forwards 1.3s ease-out;
  animation-delay: 0.3s;
}

@keyframes word-slide-right {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(1rem);
  }
}

.word-slide-right {
  animation: word-slide-right forwards 1.3s ease-out;
  animation-delay: 0.3s;
}

@media (min-width: 640px) {
  @keyframes word-slide-left {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-2rem);
    }
  }

  .word-slide-left {
    animation: word-slide-left forwards 1.3s ease-out;
    animation-delay: 0.3s;
  }

  @keyframes word-slide-right {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(2rem);
    }
  }

  .word-slide-right {
    animation: word-slide-right forwards 1.3s ease-out;
    animation-delay: 0.3s;
  }
}

</style>
