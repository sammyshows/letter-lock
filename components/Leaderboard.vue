<template>
  <div v-show="showLeaderboardModal || hideLeaderboardModal" class="absolute h-full w-full flex justify-center items-center z-20">
    <div class="h-full w-full bg-transparent absolute" @click="$emit('close')"></div>
    
    <div :class="{ 'utility-modal-slide-in': showLeaderboardModal,  'utility-modal-slide-out': hideLeaderboardModal }" class="modal-padding absolute flex flex-col items-center justify-between w-5/6 z-30 bg-gradient-to-br from-white to-slate-50 rounded-3xl text-center shadow-xl sm:py-8 sm:w-2/3 sm:rounded-5xl lg:py-12">
      <div @click="$emit('close')" class="absolute -top-4 -right-4 xs:-top-5 xs:-right-5 md:-top-8 md:-right-8 lg:-top-12 lg:-right-12">
        <div class="z-10 absolute top-2 right-2 w-6 h-6 xs:w-10 xs:h-10 rounded-full bg-white md:w-16 md:h-16 lg:w-20 lg:h-20 lg:top-6 lg:right-6"></div>
        <IconsX class="absolute z-40 -top-0 -right-0 w-10 h-10 xs:w-14 xs:h-14 text-red-400 md:w-20 md:h-20 lg:w-28 lg:h-28" />
      </div>

      <div class="text-ll-orange text-3xl font-bold tracking-widest drop-shadow-sm sm:text-6xl lg:text-7xl" style="font-family: 'Luckiest Guy';">
        <p class="word-slide-left ml-8 sm:ml-16">ALL-TIME</p>
        <p class="word-slide-right mr-8 sm:mr-16">LEADERBOARD</p>
      </div>

      <p class="my-2 px-2 text-center font-medium text-slate-500 text-xs xs:text-base sm:my-4 sm:text-2xl lg:text-3xl">You currently sit at <span class="text-ll-orange">{{ leaderboardPosition }}</span> for most levels completed all-time!</p>

      <div class="w-full flex flex-col px-6">
        <div class="flex flex-col justify-center items-center gap-y-2 mt-4 text-slate-600 lg:gap-y-4">
          <div v-for="(user, index) in leaderboardAllTime" :key="user.user_id" class="w-full h-9 grow flex justify-center items-center gap-x-2 xs:h-11 sm:h-16 sm:gap-x-4 lg:h-20 lg:gap-x-6">
            <div class="relative w-10 h-9 flex justify-center xs:w-12 xs:h-11 sm:w-16 sm:h-16 lg:w-20 lg:h-20">
              <div class="circle w-9 h-9 rounded-xl border-4 xs:w-11 xs:h-11 sm:w-16 sm:h-16 sm:rounded-2xl lg:w-20 lg:h-20 lg:rounded-3xl" :style="{ backgroundColor: getColor(index, 0.8) || 'rgb(230,230,230)', borderColor: getColor(index, 1) || 'rgb(230,230,230)' }"></div>
              <p class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-medium sm:text-4xl lg:text-4-5xl">{{ user.position }}</p>
            </div>
            <div :class="[ user.user_id === settings.id ? 'bg-ll-orange text-slate-800' : 'bg-blue-600 text-white' ]" class="leaderboard-details h-9 grow flex justify-between items-center pl-4 pr-2 rounded-xl xs:h-11 sm:h-16 sm:rounded-2xl lg:h-20 lg:pl-6 lg:rounded-3xl">
              <div class="text-sm font-medium sm:text-2xl lg:text-3xl">{{ user.username }}</div>
              <div class="w-10 text-xl text-center font-bold sm:w-20 sm:text-4xl lg:w-28 lg:text-5xl">{{ user.levels_completed_count }}</div>
            </div>
          </div>
        </div>
      </div>

      <div></div>
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from "pinia"
import { useGameStore } from "@/stores/game"

export default defineComponent({
  name: 'All Levels Complete Modal',

  setup() {
    const gameStore = useGameStore()

    const { settings, leaderboardAllTime } = storeToRefs(gameStore)

    return { gameStore, settings, leaderboardAllTime }
  },

  props: [
    'showLeaderboardModal',
    'hideLeaderboardModal'
  ],

  computed: {
    leaderboardPosition() {
      if (this.leaderboardAllTime) {
        const user = this.leaderboardAllTime.find(user => user.user_id === this.settings.id)
        if (user)
          return user.position
      }
    }
  },

  watch: {
    hideLeaderboardModal(newValue) {
      if (newValue)
        playSound('swoosh')
    }
  },

  methods: {
    getColor(index, opacity) {
      const colors = [
        `rgb(252, 173, 3, ${opacity})`, // Gold
        `rgb(176, 176, 176, ${opacity})`, // Silver
        `rgb(209, 161, 119, ${opacity})` // Bronze
      ]

      return colors[index]
    }
  }
})
</script>

<style scoped>
.circle::after {
  content: '';
  position: absolute;
  top: 0%;
  left: 15%;
  width: 70%;
  height: 25%;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2));
}

.leaderboard-details {
  position: relative;
  overflow: hidden;
}

.leaderboard-details::before {
  content: '';
  position: absolute;
  top: 10%;
  left: 2%;
  width: 96%;
  height: 35%;
  border-radius: 9999px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2));
}


.modal-padding {
  padding: 1.5rem 0;
}

@media (max-width: 320px) {
  .modal-padding {
    padding: 0.75rem 0;
  }
}



.tile {
  width: 20vw;
  height: 20vw;
}

@media (min-width: 640px) {
  .tile {
    width: 15vw;
    height: 15vw;
  }
}

@media (min-width: 1024px) {
  .play-button {
    animation: size-change-lg 1.5s infinite alternate;
  }
}

@media (max-width: 320px) {
  .play-button {
    animation: size-change-xs 1.5s infinite alternate;
  }
}



.tile-animate {
  animation: tile-animate 3s ease-in-out infinite;
  animation-delay: 1s;
}

.tile-animate-reverse {
  animation: tile-animate-reverse 3s ease-in-out infinite;
  animation-delay: 1s;
}

@keyframes tile-animate {
  0% {
    transform: translateX(0);
  }
  15% {
    transform: translateX(0);
  }
  35% {
    transform: translateX(110%);
  }
  65% {
    transform: translateX(110%);
  }
  85% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes tile-animate-reverse {
  0% {
    transform: translateX(0);
  }
  15% {
    transform: translateX(0);
  }
  35% {
    transform: translateX(-110%);
  }
  65% {
    transform: translateX(-110%);
  }
  85% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(0);
  }
}
</style>