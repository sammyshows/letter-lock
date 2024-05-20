<template>
  <div @click="$emit('watchAd'); playSound('click')" class="ad-button-pulse flex self-center rounded-full bg-gradient-to-br from-green-400 to-green-600 focus:from-green-500 focus:to-green-700 disabled:from-slate-300 disabled:to-slate-500">
    <IconsClapperboard class="w-6 h-6 mr-3 -rotate-6 text-white sm:mr-4 sm:w-8 sm:h-8 lg:mr-6 lg:w-10 lg:h-10" />
    <button :disabled="disableAds" class="text-white font-medium shadow-sm drop-shadow text-sm sm:text-3xl lg:text-5xl" style="touch-action: manipulation;">{{ text }}</button>
  </div>
</template>

<script lang="ts">
  export default defineComponent({
    name: 'WatchAd',

    props: [ 'text', 'disableAds' ]
  })
</script>

<style>
.ad-button-pulse {
  animation: ad-button-pulse 1.5s infinite alternate;
}

@keyframes ad-button-pulse {
  0%, 100% {
    padding: 10px 32px;
  }

  50% {
    padding: 11px 38px;
  }
}

@media (min-width: 640px) {
  @keyframes ad-button-pulse {
    0%, 100% {
      padding: 15px 36px;
    }

    50% {
      padding: 16px 40px;
    }
  }
}

@media (min-width: 1024px) {
  @keyframes ad-button-pulse {
    0%, 100% {
      padding: 22px 56px;
    }

    50% {
      padding: 26px 70px;
    }
  }
}
</style>