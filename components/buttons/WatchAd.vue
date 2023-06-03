<template>
  <div class="button-pulse flex self-center rounded-full bg-gradient-to-br from-green-400 to-green-600 focus:from-green-500 focus:to-green-700 disabled:from-slate-300 disabled:to-slate-500">
    <IconsClapperboard class="w-6 h-6 mr-3 -rotate-6 text-white" />
    <button @click="$emit('watchAd')" class="text-sm text-white font-medium shadow-sm drop-shadow">{{ text }}</button>
  </div>
</template>

<script lang="ts">
  export default defineComponent({
    name: 'WatchAd',

    props: [ 'text' ]
  })
</script>

<style>
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
</style>