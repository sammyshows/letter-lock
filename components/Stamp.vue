<template>
  <div class="stamp">
    <div class="transform -rotate-12 rounded-full flex justify-center items-center" style="height: 45vw; width: 45vw; border-width: 2vw;">
      <div class="relative rounded-full border-2 flex justify-center items-center" style="height: 95%; width: 95%;">
        <div class="relative" style="height: 100%; width: 100%;">
          <div
              v-for="i in 12"
              :key="i"
              class="absolute transform"
              :style="{
              top: `calc(50% + ${40 * Math.sin((2 * Math.PI / 12) * (i - 1))}% - 0.7rem)`,
              left: `calc(50% + ${40 * Math.cos((2 * Math.PI / 12) * (i - 1))}% - 0.7rem)`,
            }">
            <IconsStar class="text-ll-orange" :class="{ 'invisible': [1, 2, 6, 8, 12].includes(i) }" style="height: 6vw; width: 6vw;" />
          </div>
        </div>

        <div class="absolute rounded-full border-4" style="height: 65%; width: 65%;"></div>
        <div class="absolute rounded-full border" style="height: 56%; width: 56%;"></div>

        <div class="absolute rounded-xl border-4 flex justify-center items-center" style="height: 50%; padding: 0.5vw; width: 140%;">
          <div class="h-full w-full pt-1 rounded-xl bg-ll-orange border-2 text-center tracking-widest leading-6 font-bold flex justify-center items-center" style="font-size: 1.5rem; font-family: 'Stardos Stencil'">
            LETTERS<br>LOCKED
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes stamp {
  0% {
    transform: scale(0.5) translateY(-100vh) translateX(-20vw);
  }
  70% {
    transform: scale(1.5) translateY(0vh) translateX(-20vw);
  }
  100% {
    transform: scale(1) translateY(0vh) translateX(-20vw);
  }
}

.stamp {
  animation: stamp forwards 2s cubic-bezier(0.3, 0.27, 0.07, 1.65);
}
</style>