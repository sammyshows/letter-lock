<template>
  <div class="min-h-screen mb-10 flex relative overflow-hidden duration-300 bg-gradient-to-b from-blue-600 via-blue-400 to-blue-300">
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden">
      <div v-for="(letter, index) in letters" :key="index" class="snowflake border border-slate-300 w-6 h-6 rounded m-auto flex justify-center items-center capitalize text-slate-300">{{ letter }}</div>
    </div>

    <div class="flex flex-col grow justify-between z-10">
      <div class="pt-6">
        <div class="flex justify-between px-6">
          <IconsSettings class="h-8 w-8 mt-1.5" />
          <div class="text-4.5xl font-bold text-end leading-10 mb-4 text-ll-orange"><p>LETTER</p><p>LOCK</p></div>
          <div class="flex flex-col">
            <div class="flex gap-x-1 mt-1.5">
              <IconsHeart class="h-6 w-6 text-red-500" />
              <span>3</span>
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
<!--        <div class="text-sm text-white mb-8 px-6 text-center">Slide, Solve, and Progress! Unleash the word master within!</div>-->


      <!-- Size changing button - variation 4 -->
      <div>
        <p class="mb-4 text-4xl text-center font-medium">LEVEL {{ currentLevelId }}</p>

        <div class="h-16 w-full flex items-center justify-center">
          <button @click="startGame" class="bg-stone-100 text-blue-700 font-medium text-2xl px-10 py-2 rounded-full shadow mb-6 size-change-4 z-10">Play</button>
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
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game";

export default {
  data() {
    return {
      letters: ['f', 'j', 't', 'l', 'u', 'y', 'v', 'd', 'n', 'h', 'o', 'p', 'a', 'c', 's', 'b', 'm', 'e', 'z', 'x', 'k', 'w', 'i', 'r', 'g', 'q', 'f', 'j', 't', 'l', 'u', 'y', 'v', 'd', 'n', 'h', 'o', 'p', 'a', 'c', 's', 'b', 'm', 'e', 'z', 'x', 'k', 'w', 'i', 'r', 'g']
    }
  },

  setup() {
    const gameStore = useGameStore()
    const { currentLevelId } = storeToRefs(gameStore)

    return { currentLevelId }
  },

  methods: {
    startGame() {
      this.$router.push('/game');
    }
  },
};
</script>

<style>
/* Size change effect - variation 4 */
.size-change-4 {
  animation: size-change-4 1.5s infinite alternate;
}

@keyframes size-change-4 {
  0%, 100% {
    padding: 8px 40px;
  }

  50% {
    padding: 10px 46px;
  }
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

