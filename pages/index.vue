<template>
  <div :class="[ platform === 'ios' ? 'pt-12' : 'pt-2' ]" class="min-h-screen mb-10 flex relative overflow-hidden duration-300 bg-gradient-to-b from-blue-700 via-blue-500 to-blue-600">
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden">
      <div v-for="(letter, index) in letters" :key="index" class="snowflake border border-slate-300 w-5 h-5 xs:w-6 xs:h-6 rounded m-auto flex justify-center items-center capitalize text-slate-300 text-sm xs: text-base sm:w-12 sm:h-12 sm:text-3xl">{{ letter }}</div>
    </div>

    <img :class="[ platform === 'ios' ? 'top-24 xs:top-14' : 'logo-top-android' ]" class="absolute w-4/5 left-1/2 -translate-x-1/2 sm:w-2/3 sm:top-24" src="@/assets/images/letterlock-final.png" alt="Letter Lock Logo">

    <div class="flex flex-col grow justify-around mt-20 z-10">
      <div class="h-12 sm:h-40"></div>
      
      <div class="mt-16">
        <div v-if="currentLevelId && currentLevelId <= totalLevelCount">
          <div v-if="!showUserDemo" class="flex justify-center items-center text-4xl text-center tracking-wider font-medium sm:text-7xl lg:text-8xl" style="font-family: 'Luckiest Guy';">
            <!-- <IconsMap class="h-10 mb-2.5 text-slate-200" /> -->
            <p class="mr-1 sm:mr-3 lg:mr-5">LEVEL</p>
  
            <div v-if="(currentLevelId - 1).toString().length !== currentLevelId.toString().length" class="relative flex items-end text-6xl pt-1 pl-4 rounded-full sm:text-8xl lg:text-9xl">
              <span>{{ currentLevelId }}</span>
            </div>
  
            <div v-else class="relative flex justify-center items-end text-6xl pt-1 pl-2.5 xs:pl-4 rounded-full sm:text-8xl lg:text-9xl">
              <span :class="{ 'old-level-animation': levelUp }">{{ levelUp ? (currentLevelId - 1) : currentLevelId }}</span>
              <span :class="{ 'new-level-animation': levelUp }" class="absolute">{{ currentLevelId }}</span>
            </div>
          </div>
  
          <div class="relative play-container w-full flex items-center justify-center sm:h-24 lg:h-32">
            <div @click="startGame" class="play-button text-3xl sm:text-5xl lg:text-7xl" style="font-family: 'Luckiest Guy'; touch-action: manipulation;">Play</div>
          </div>

          <div v-if="stats.streak >= 2" class="flex justify-center items-center mt-5 lg:mt-8">
            <IconsFire class="icons-3 sm:h-16 sm:w-16 lg:h-24 lg:w-24" />
            <p class="mt-3 ml-1 text-3xl sm:text-6xl sm:mt-4 lg:text-7-5xl lg:mt-7 lg:ml-3" style="font-family: 'Luckiest Guy';">{{ stats.streak }}</p>
          </div>
        </div>

        <div v-else class="flex flex-col justify-center items-center text-4xl text-center tracking-wider font-medium xs:mt-8 sm:text-7xl" style="font-family: 'Luckiest Guy';">
          <p>ALL</p>
          <p>LEVELS</p>
          <p>COMPLETE</p>
        </div>
      </div>

      <div>
        <div class="icons-bar flex justify-between items-center mt-6 px-12 sm:px-24 lg:px-32">
          <div class="relative drop-shadow">
            <IconsHeart class="icons-2 text-red-500 sm:h-16 sm:w-16 lg:h-24 lg:w-24" />
            <span class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-xl font-medium sm:text-3xl lg:text-5xl">{{ lives.count }}</span>
          </div>

          <IconsChart @click="showLeaderboard" class="icons-1 sm:h-16 lg:h-24" style="touch-action: manipulation;"/>
        </div>

        <div class="icons-bar flex justify-between items-center mt-10 px-12 sm:mt-16 sm:px-24 lg:mt-20 lg:px-32">
          <IconsSettings @click="showSettingsModal = true" class="icons-1 drop-shadow sm:h-16 lg:h-24" style="touch-action: manipulation;" />

          <NuxtLink :to="{ path: '/levels' }" style="touch-action: manipulation;">
            <IconsMap class="icons-1 sm:h-16 lg:h-24" />
          </NuxtLink>
        </div>
      </div>
    </div>


    <Leaderboard v-if="showLeaderboardModal || hideLeaderboardModal"
                 :showLeaderboardModal="showLeaderboardModal"
                 :hideLeaderboardModal="hideLeaderboardModal"
                 @close="closeLeaderboardModal" />

    <SettingsModal :showSettingsModal="showSettingsModal"
                   :hideSettingsModal="hideSettingsModal"
                   @close="closeSettingsModal" />

    <LivesModal v-if="showLivesModal || hideLivesModal"
                :showLivesModal="showLivesModal"
                :hideLivesModal="hideLivesModal"
                @close="closeLivesModal" />

    <AllLevelsCompleteModal v-if="showAllLevelsCompleteModal || hideAllLevelsCompleteModal"
                :showAllLevelsCompleteModal="showAllLevelsCompleteModal"
                :hideAllLevelsCompleteModal="hideAllLevelsCompleteModal"
                @close="closeAllLevelsCompleteModal" />

    <LetterSwapReminderModal v-if="showLetterSwapReminderModal || hideLetterSwapReminderModal"
                :showLetterSwapReminderModal="showLetterSwapReminderModal"
                :hideLetterSwapReminderModal="hideLetterSwapReminderModal"
                @close="closeLetterSwapReminderModal" />

    <div :class="[ showLeaderboardModal || showSettingsModal || showLivesModal || showAllLevelsCompleteModal || showLetterSwapReminderModal ? 'opacity-1' : 'opacity-0' ]" class="fixed top-0 left-0 right-0 bottom-0 backdrop-blur duration-500 pointer-events-none z-10"></div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { Capacitor } from "@capacitor/core"
import { useGameStore } from "@/stores/game";
import { useAdsStore } from "@/stores/ads";
import SettingsModal from "../components/SettingsModal";

export default {
  name: 'Home',
  
  components: { SettingsModal },

  setup() {
    const gameStore = useGameStore()
    const adsStore = useAdsStore()

    const { showUserDemo, totalLevelCount, allLevelsCompleteModalShown, currentLevelId, lives, maxLives, stats, settings, leaderboardDisplayedOnMount, leaderboardAllTime } = storeToRefs(gameStore)
    const { rewardAdsLoaded } = storeToRefs(adsStore)

    return { gameStore, adsStore, showUserDemo, totalLevelCount, allLevelsCompleteModalShown, currentLevelId, lives, maxLives, stats, settings, leaderboardDisplayedOnMount, leaderboardAllTime, rewardAdsLoaded }
  },

  mounted() {
    if (this.rewardAdsLoaded <= 0)
      this.adsStore.prepareRewardAd()

    // Show animation if levelled up
    if (this.$route.query.levelUp) {
      this.levelUp = true
      this.$router.replace({
        path: this.$route.path,
        query: {}
      })

      if (this.currentLevelId === 2)
        this.showLetterSwapReminderModal = true
    }

    // Check life count - checks every 6 seconds. Dunno why it's 6, but fuck it.
    this.lifeCheckInterval = window.setInterval(() => {
      if (this.lives.count < this.maxLives) {
        this.gameStore.checkLives();
      }
    }, 6000);


    // game over modal - damn a user really won the game
    if (!this.allLevelsCompleteModalShown && this.currentLevelId > this.totalLevelCount) {
      this.showAllLevelsCompleteModal = true
      this.allLevelsCompleteModalShown = true
    } else if (!this.leaderboardDisplayedOnMount && this.currentLevelId > 4) { // easy way to ensure 'showLetterSwapReminderModal' above is not shown at the same time
      this.showLeaderboard()
      this.gameStore.$patch({ leaderboardDisplayedOnMount: true })
    }
  },

  beforeUnmount() {
    clearInterval(this.lifeCheckInterval);
  },

  data() {
    return {
      platform: Capacitor.getPlatform(),
      showLeaderboardModal: false,
      hideLeaderboardModal: false,
      showSettingsModal: false,
      hideSettingsModal: false,
      showLivesModal: false,
      hideLivesModal: false,
      showAllLevelsCompleteModal: false,
      hideAllLevelsCompleteModal: false,
      showLetterSwapReminderModal: false,
      hideLetterSwapReminderModal: false,
      levelUp: false,
      letters: ['f', 'j', 't', 'l', 'u', 'y', 'v', 'd', 'n', 'h', 'o', 'p', 'a', 'c', 's', 'b', 'm', 'e', 'z', 'x', 'k', 'w', 'i', 'r', 'g', 'q', 'f', 'j', 't', 'l', 'u', 'y', 'v', 'd', 'n', 'h', 'o', 'p', 'a', 'c', 's', 'b', 'm', 'e', 'z', 'x', 'k', 'w', 'i', 'r', 'g']
    }
  },

  methods: {
    async startGame() {
      if (this.showUserDemo)
        return this.$router.push({ name: 'demo' })

      if (this.lives.count > 0)
        this.gameStore.startLevel()
      else {
        await this.gameStore.checkLives()

        if (this.lives.count > 0) {
          this.gameStore.startLevel()
        } else {
          this.showLivesModal = true
        }
      }
    },

    showLeaderboard() {
      if (this.leaderboardAllTime) { // if leaderboard data is available
        this.gameStore.getLeaderboard()
        this.showLeaderboardModal = true
      }
    },

    closeLivesModal() {
      this.hideLivesModal = true

      // Not the prettiest, but this resets the modal animations 
      setTimeout(() => {
        this.showLivesModal = false
        this.hideLivesModal = false
      }, 700) // delay should match utility-modal-slide-out time
    },

    closeSettingsModal() {
      this.hideSettingsModal = true

      // Not the prettiest, but this resets the modal animations 
      setTimeout(() => {
        this.showSettingsModal = false
        this.hideSettingsModal = false
      }, 700) // delay should match utility-modal-slide-out time
    },

    closeAllLevelsCompleteModal() {
      this.hideAllLevelsCompleteModal = true

      // Not the prettiest, but this resets the modal animations 
      setTimeout(() => {
        this.showAllLevelsCompleteModal = false
        this.hideAllLevelsCompleteModal = false
      }, 700) // delay should match utility-modal-slide-out time
    },

    closeLetterSwapReminderModal() {
      this.hideLetterSwapReminderModal = true

      // Not the prettiest, but this resets the modal animations 
      setTimeout(() => {
        this.showLetterSwapReminderModal = false
        this.hideLetterSwapReminderModal = false
      }, 700) // delay should match utility-modal-slide-out time
    },

    closeLeaderboardModal() {
      this.hideLeaderboardModal = true

      // Not the prettiest, but this resets the modal animations 
      setTimeout(() => {
        this.showLeaderboardModal = false
        this.hideLeaderboardModal = false
      }, 700) // delay should match utility-modal-slide-out time
    }
  },
};
</script>

<style>
input,
textarea,
button,
select,
a {
    -webkit-tap-highlight-color: transparent;
}


.logo-top-android {
  top: 3.5rem;
}

.play-container {
  height: 4rem;
}

.icons-3 {
  height: 3rem;
  width: 3rem;
}

.icons-1 {
  height: 2.5rem;
}

.icons-2 {
  height: 3rem;
}

@media (max-width: 320px) {
  .logo-top-android {
    top: 2.5rem;
  }

  .play-container {
    height: 3rem;
  }

  .icons-bar {
    margin-bottom: 0.5rem;
  }

  .icons-1 {
    height: 1.75rem;
  }

  .icons-2 {
    height: 2.1rem;
  }

  .icons-3 {
    height: 1.75rem;
    width: 1.75rem;
  }
}



/* Modal slide in */

.play-button {
  position: relative;
  border: 0;
  border-radius: 100px;
  display: flex;
  font-weight: 500;
  color: rgb(0, 85, 255);
  letter-spacing: 0.1rem;
  cursor: pointer;
  outline: 0;
  background: white;
  box-shadow: 0 0.3rem 1.25rem 0 rgba(128, 128, 128, 0.2);
  animation: size-change 1.5s infinite alternate;
  transition-duration: 100ms;
}

.play-button:active {
  transform: scale(0.95);
}

@media (min-width: 640px) {
  .play-button {
    animation: size-change-sm 1.5s infinite alternate;
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


@keyframes size-change {
  0%, 100% {
    padding: 8px 40px 0px 40px;
  }

  50% {
    padding: 10px 44px 2px 44px;
  }
}

@keyframes size-change-xs {
  0%, 100% {
    padding: 8px 32px 0px 32px;
  }

  50% {
    padding: 10px 36px 2px 36px;
  }
}

@keyframes size-change-sm {
  0%, 100% {
    padding: 16px 56px 4px 56px;
  }

  50% {
    padding: 20px 64px 8px 64px;
  }
}

@keyframes size-change-lg {
  0%, 100% {
    padding: 28px 72px 10px 72px;
  }

  50% {
    padding: 32px 84px 14px 84px;
  }
}





@keyframes utility-modal-slide-in {
  0% {
    transform: translateY(-130vh) rotate(12deg);
  }
  55% {
    transform: translateY(5vh) rotate(-3deg);
  }
  77% {
    transform: translateY(-3vh) rotate(2deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

.utility-modal-slide-in {
  animation: utility-modal-slide-in forwards 1s ease-in-out;
}



/* Modal slide out */

@keyframes utility-modal-slide-out {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  23% {
    transform: translateY(3vh) rotate(-3deg);
  }
  100% {
    transform: translateY(-130vh) rotate(12deg);
  }
}

.utility-modal-slide-out {
  animation: utility-modal-slide-out forwards 0.7s ease-in-out;
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





/* Change level number animation */

@keyframes new-level-animation {
  0% {
    opacity: 0;
    transform: translateY(-80%);
  }
  43% {
    opacity: 0;
    transform: translateY(-80%);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.new-level-animation {
  animation: new-level-animation 0.7s ease-in-out forwards;
}




@keyframes old-level-animation {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    transform: translateY(50%);
    opacity: 0;
  }
}

.old-level-animation {
  animation: old-level-animation 0.2s ease-in forwards;
  animation-delay: 0.3s;
}





/* Snowflake animation */
.snowflake {
  position: absolute;
  animation: snowflake-fall linear infinite;
}

@keyframes snowflake-fall {
  0% {
    transform: translateY(-10vh) translateX(calc(100vw * var(--rand))) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(120vh) translateX(calc(100vw * var(--rand))) rotate(720deg);
    opacity: 0.2;
  }
}

/* Snowflake random position and duration */
.snowflake {
  --rand: 0;
  --duration: 10s;
}

.snowflake {
  animation-duration: var(--duration);
  animation-delay: calc(-10 * var(--duration) * var(--rand));
  left: calc(100vw * var(--rand));
  top: calc(-120vh * var(--rand));
}

.snowflake:nth-child(1) {
  --rand: 0.01;
  --duration: 10s;
}

.snowflake:nth-child(2) {
  --rand: 0.05;
  --duration: 12s;
}

.snowflake:nth-child(3) {
  --rand: 0.1;
  --duration: 9s;
}

.snowflake:nth-child(4) {
  --rand: 0.15;
  --duration: 11s;
}

.snowflake:nth-child(5) {
  --rand: 0.2;
  --duration: 10s;
}

.snowflake:nth-child(6) {
  --rand: 0.25;
  --duration: 13s;
}

.snowflake:nth-child(7) {
  --rand: 0.3;
  --duration: 8s;
}

.snowflake:nth-child(8) {
  --rand: 0.35;
  --duration: 12s;
}

.snowflake:nth-child(9) {
  --rand: 0.4;
  --duration: 10s;
}

.snowflake:nth-child(10) {
  --rand: 0.45;
  --duration: 11s;
}

.snowflake:nth-child(11) {
  --rand: 0.5;
  --duration: 9s;
}

.snowflake:nth-child(12) {
  --rand: 0.55;
  --duration: 13s;
}

.snowflake:nth-child(13) {
  --rand: 0.6;
  --duration: 8s;
}

.snowflake:nth-child(14) {
  --rand: 0.65;
  --duration: 12s;
}


.snowflake:nth-child(15) {
  --rand: 0.55;
  --duration: 8s;
}

.snowflake:nth-child(16) {
  --rand: 0.65;
  --duration: 10s;
}

.snowflake:nth-child(17) {
  --rand: 0.75;
  --duration: 12s;
}

.snowflake:nth-child(18) {
  --rand: 0.85;
  --duration: 9s;
}

.snowflake:nth-child(19) {
  --rand: 0.95;
  --duration: 11s;
}

.snowflake:nth-child(20) {
  --rand: 0.05;
  --duration: 10s;
}

.snowflake:nth-child(21) {
  --rand: 0.18;
  --duration: 9s;
}

.snowflake:nth-child(22) {
  --rand: 0.28;
  --duration: 11s;
}

.snowflake:nth-child(23) {
  --rand: 0.18;
  --duration: 9s;
}

.snowflake:nth-child(24) {
  --rand: 0.94;
  --duration: 11s;
}

.snowflake:nth-child(26) {
  --rand: 0.52;
  --duration: 8s;
}

.snowflake:nth-child(27) {
  --rand: 0.76;
  --duration: 12s;
}

.snowflake:nth-child(28) {
  --rand: 0.4;
  --duration: 6s;
}

.snowflake:nth-child(29) {
  --rand: 0.83;
  --duration: 9s;
}

.snowflake:nth-child(30) {
  --rand: 0.14;
  --duration: 11s;
}

.snowflake:nth-child(31) {
  --rand: 0.68;
  --duration: 7s;
}

.snowflake:nth-child(32) {
  --rand: 0.33;
  --duration: 10s;
}

.snowflake:nth-child(33) {
  --rand: 0.92;
  --duration: 9s;
}

.snowflake:nth-child(34) {
  --rand: 0.06;
  --duration: 11s;
}

.snowflake:nth-child(35) {
  --rand: 0.71;
  --duration: 8s;
}

.snowflake:nth-child(36) {
  --rand: 0.44;
  --duration: 10s;
}

.snowflake:nth-child(37) {
  --rand: 0.77;
  --duration: 7s;
}

.snowflake:nth-child(38) {
  --rand: 0.28;
  --duration: 12s;
}

.snowflake:nth-child(39) {
  --rand: 0.61;
  --duration: 6s;
}

.snowflake:nth-child(40) {
  --rand: 0.19;
  --duration: 9s;
}

.snowflake:nth-child(41) {
  --rand: 0.53;
  --duration: 11s;
}

.snowflake:nth-child(42) {
  --rand: 0.86;
  --duration: 8s;
}

.snowflake:nth-child(43) {
  --rand: 0.37;
  --duration: 10s;
}

.snowflake:nth-child(44) {
  --rand: 0.99;
  --duration: 12s;
}

.snowflake:nth-child(45) {
  --rand: 0.11;
  --duration: 6s;
}

.snowflake:nth-child(46) {
  --rand: 0.64;
  --duration: 9s;
}

.snowflake:nth-child(47) {
  --rand: 0.3;
  --duration: 11s;
}

.snowflake:nth-child(48) {
  --rand: 0.74;
  --duration: 8s;
}

.snowflake:nth-child(49) {
  --rand: 0.47;
  --duration: 10s;
}

.snowflake:nth-child(50) {
  --rand: 0.92;
  --duration: 13s;
}

</style>

