<template>
  <div class="min-h-screen mb-10 flex relative overflow-hidden duration-300 bg-gradient-to-b from-blue-600 via-blue-400 to-blue-300">
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden">
      <div v-for="(letter, index) in letters" :key="index" class="snowflake border border-slate-300 w-6 h-6 rounded m-auto flex justify-center items-center capitalize text-slate-300">{{ letter }}</div>
    </div>

    <div class="flex flex-col grow justify-between z-10">
      <div class="pt-6">
        <div class="flex justify-between px-6">
          <IconsSettings @click="showSettingsModal = true" class="h-8 w-8 mt-1.5" />
          <div class="text-4.5xl font-bold text-end leading-10 mb-4 text-ll-orange"><p>LETTER</p><p>LOCK</p></div>
          <div class="flex flex-col">
            <div class="flex gap-x-1 mt-1.5">
              <IconsHeart class="h-6 w-6 text-red-500" />
              <span>{{ lives.count }}</span>
            </div>
            <div class="flex gap-x-1">
              <IconsDollar class="h-6 w-6 text-yellow-300" />
              <span>200</span>
            </div>
          </div>
        </div>
        <div class="flex justify-between px-10 mt-5">
          <IconsCart class="h-10 w-10 text-yellow-300" />
          <div>
            <IconsEllipsis class="h-10 w-10 text-emerald-400" />
          </div>
        </div>
      </div>


      <div>
        <div class="flex justify-center mb-4 text-4xl text-center font-medium">
          <p class="">LEVEL</p>
          <div class="relative flex items-end ml-3">
            <span :class="{ 'old-level-animation': levelUp }">{{ levelUp ? (currentLevelId - 1) : currentLevelId }}</span>
            <span :class="{ 'new-level-animation': levelUp }" class="absolute left-0 opacity-0">{{ currentLevelId }}</span>
          </div>
        </div>

        <div class="h-16 w-full flex items-center justify-center">
          <button @click="startGame" class="size-change bg-stone-100 text-blue-700 font-medium text-2xl px-10 py-2 rounded-full shadow mb-6 z-10">Play</button>
        </div>

        <div class="flex justify-center">
          <div class="bg-red-600/30 rounded-2xl mr-2">
            <IconsFire class="h-6 w-6" />
          </div>
          <p>3 IN A ROW!</p>
        </div>
      </div>

      <div class="h-32"></div>
    </div>


    <SettingsModal :showSettingsModal="showSettingsModal"
                    :hideSettingsModal="hideSettingsModal"
                    @close="closeSettingsModal()" />


    <LivesModal v-if="showLivesModal || hideLivesModal"
                :showLivesModal="showLivesModal"
                :hideLivesModal="hideLivesModal"
                @close="closeLivesModal()" />


    <div :class="[ showLivesModal && !hideLivesModal ? 'opacity-1' : 'opacity-0' ]" class="fixed top-0 left-0 right-0 bottom-0 backdrop-blur duration-700 pointer-events-none z-10"></div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game";
import SettingsModal from "../components/SettingsModal";

export default {
  components: { SettingsModal },

  setup() {
    const gameStore = useGameStore()
    const { currentLevelId, lives, maxLives } = storeToRefs(gameStore)

    return { gameStore, currentLevelId, lives, maxLives }
  },

  mounted() {
    // Show animation if levelled up
    if (this.$route.query.levelUp) {
      this.levelUp = true
      this.$router.replace({
        path: this.$route.path,
        query: {}
      })
    }

    // Check life count
    this.lifeCheckInterval = window.setInterval(() => {
      if (this.lives.count < this.maxLives) {
        this.gameStore.checkLives();
      }
    }, 6000);
  },

  beforeUnmount() {
    clearInterval(this.lifeCheckInterval);
  },

  data() {
    return {
      showSettingsModal: false,
      hideSettingsModal: false,
      showLivesModal: false,
      hideLivesModal: false,
      levelUp: false,
      letters: ['f', 'j', 't', 'l', 'u', 'y', 'v', 'd', 'n', 'h', 'o', 'p', 'a', 'c', 's', 'b', 'm', 'e', 'z', 'x', 'k', 'w', 'i', 'r', 'g', 'q', 'f', 'j', 't', 'l', 'u', 'y', 'v', 'd', 'n', 'h', 'o', 'p', 'a', 'c', 's', 'b', 'm', 'e', 'z', 'x', 'k', 'w', 'i', 'r', 'g']
    }
  },

  methods: {
    async startGame() {
      if (this.lives.count > 0)
        this.$router.push('/game')
      else {
        await this.gameStore.checkLives()

        if (this.lives.count > 0) {
          this.$router.push('/game')
        } else {
          this.showLivesModal = true
        }
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

/* Modal slide in */

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
    transform: translateX(-16px);
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
    transform: translateX(16px);
  }
}

.word-slide-right {
  animation: word-slide-right forwards 1.3s ease-out;
  animation-delay: 0.3s;
}



/* Size change effect - variation 4 */
.size-change {
  animation: size-change 1.5s infinite alternate;
}

@keyframes size-change {
  0%, 100% {
    padding: 8px 40px;
  }

  50% {
    padding: 10px 46px;
  }
}



/* Change level number animation */

@keyframes new-level-animation {
  0% {
    opacity: 0;
    transform: translateY(-80%);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.new-level-animation {
  animation: new-level-animation 0.4s ease-in-out forwards;
  animation-delay: 0.6s;
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
  animation-delay: 0.6s;
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

