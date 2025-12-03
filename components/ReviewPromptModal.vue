<template>
  <div v-show="showReviewPromptModal || hideReviewPromptModal" class="absolute h-full w-full flex justify-center items-center z-20">
    <div class="h-full w-full bg-transparent absolute" @click="handleMaybeLater"></div>

    <div :class="{ 'utility-modal-slide-in': showReviewPromptModal,  'utility-modal-slide-out': hideReviewPromptModal }" class="modal-padding absolute flex flex-col items-center justify-between h-auto w-5/6 z-30 bg-gradient-to-br from-white to-slate-50 rounded-3xl text-center shadow-xl sm:py-8 sm:w-2/3 sm:rounded-5xl lg:py-12">
      <div @click="handleMaybeLater" class="absolute -top-4 -right-4 xs:-top-5 xs:-right-5 md:-top-8 md:-right-8 lg:-top-12 lg:-right-12">
        <div class="z-10 absolute top-2 right-2 w-6 h-6 xs:w-10 xs:h-10 rounded-full bg-white md:w-16 md:h-16 lg:w-20 lg:w-20 lg:top-6 lg:right-6"></div>
        <IconsX class="absolute z-40 -top-0 -right-0 w-10 h-10 xs:w-14 xs:h-14 text-red-400 md:w-20 md:h-20 lg:w-28 lg:h-28" />
      </div>

      <div class="text-ll-orange text-2xl font-bold tracking-widest drop-shadow-sm mt-4 sm:text-5xl lg:text-6xl" style="font-family: 'Luckiest Guy';">
        <p>ENJOYING</p>
        <p>LETTER LOCK?</p>
      </div>

      <div class="px-6 py-6 text-slate-600 text-sm xs:text-base sm:text-2xl lg:text-3xl">
        <p class="text-center mb-4">You've made it through <strong class="font-semibold">{{ completedLevels }}</strong> levels!</p>
        <p class="text-center">We're a small team who values every player. Your review would mean the world to us and help others discover Letter Lock.</p>
      </div>

      <div class="flex flex-col w-full px-8 gap-3 mb-4 sm:gap-5 sm:mb-6 lg:gap-6 lg:mb-8">
        <button @click="handleRateNow" class="review-button review-button-primary text-lg sm:text-3xl lg:text-4xl" style="font-family: 'Luckiest Guy';">
          Rate Now
        </button>
        <button @click="handleMaybeLater" class="review-button review-button-secondary text-base sm:text-2xl lg:text-3xl" style="font-family: 'Luckiest Guy';">
          Maybe Later
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game";
import { AppReview } from '@capawesome/capacitor-app-review';

export default defineComponent({
  name: 'Review Prompt Modal',

  setup() {
    const gameStore = useGameStore()
    const { maxLevelId } = storeToRefs(gameStore)

    const completedLevels = computed(() => maxLevelId.value - 1)

    return { gameStore, completedLevels }
  },

  props: [
    'showReviewPromptModal',
    'hideReviewPromptModal'
  ],

  watch: {
    hideReviewPromptModal(newValue) {
      if (newValue)
        playSound('swoosh')
    },
    showReviewPromptModal(newValue) {
      if (newValue) {
        logFirebaseEvent('review-suggested', {
          level: this.gameStore.maxLevelId
        })
      }
    }
  },

  methods: {
    async handleRateNow() {
      playSound('click')

      logFirebaseEvent('review-started', {
        level: this.gameStore.maxLevelId
      })

      // Mark as reviewed
      this.gameStore.review.hasReviewed = true
      this.gameStore.review.lastReviewPromptLevel = this.gameStore.maxLevelId
      await this.gameStore.saveReview()

      // Request in-app review
      try {
        await AppReview.requestReview()
      } catch (error) {
        console.error('Error requesting review:', error)
      }

      this.$emit('close')
    },

    async handleMaybeLater() {
      playSound('click')

      logFirebaseEvent('review-postponed', {
        level: this.gameStore.maxLevelId
      })

      // Update last prompt level so we don't show again for another 10 levels
      this.gameStore.review.lastReviewPromptLevel = this.gameStore.maxLevelId
      await this.gameStore.saveReview()

      this.$emit('close')
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

.review-button {
  position: relative;
  border: 0;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  letter-spacing: 0.05rem;
  cursor: pointer;
  outline: 0;
  padding: 12px 32px 8px 32px;
  box-shadow: 0 0.3rem 1.25rem 0 rgba(128, 128, 128, 0.2);
  transition: all 100ms;
  touch-action: manipulation;
}

.review-button:active {
  transform: scale(0.95);
}

.review-button-primary {
  background: linear-gradient(135deg, rgb(251, 146, 60), rgb(249, 115, 22));
  color: white;
}

.review-button-secondary {
  background: white;
  color: rgb(100, 116, 139);
}

@media (min-width: 640px) {
  .review-button {
    padding: 16px 48px;
  }
}

@media (min-width: 1024px) {
  .review-button {
    padding: 20px 64px;
  }
}
</style>
