<template>
  <div class="h-full w-full bg-gradient-to-b from-blue-700 via-blue-500 to-blue-600 overflow-hidden">
    <NuxtPage v-if="gameStateLoaded" />
  </div>
</template>

<script>
import { watch } from 'vue';
import axios from 'axios'
import Sortable, { Swap } from "sortablejs";
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { App } from "@capacitor/app";
import { useGameStore } from "@/stores/game";
import { useAdsStore } from "@/stores/ads";

Sortable.mount(new Swap());

export default {
  name: 'App',

  setup() {
    const gameStore = useGameStore()
    const adsStore = useAdsStore()

    watch(() => gameStore.stats, async () => {
      let deviceInfo = {};
      let appInfo = {};

      if (Capacitor.getPlatform() !== 'web') {
        deviceInfo = await Device.getInfo();
        appInfo = await App.getInfo();
      }

      const body = JSON.stringify({
        deviceOS: deviceInfo.osVersion || null,
        deviceModel: deviceInfo.model || null,
        stockwiseVersion: appInfo.version || null,
        levelHistory: gameStore.levelHistory,
        stats: gameStore.stats,
        settings: gameStore.settings,
        adsWatched: adsStore.adsWatched
      })


      const url = 'https://www.stockwise.app/api/letterlock-stats-upsert'
      // const url = 'http://localhost:8888/api/letterlock-stats-upsert'
      axios.post(url, body)
        .then(() => {
          adsStore.$patch({ adsWatched: [] })
        })
        .catch(error => {
          console.error(error)
        })
    },
    { deep: true })

    return { gameStore, adsStore }
  },

  data() {
    return {
      gameStateLoaded: false
    }
  },

  async created() {
    await this.gameStore.setInitialState()
    this.adsStore.initialiseRewardAd()
    this.adsStore.prepareRewardAd()
    this.gameStateLoaded = true





    let deviceInfo = {};
    let appInfo = {};

    if (Capacitor.getPlatform() !== 'web') {
      deviceInfo = await Device.getInfo();
      appInfo = await App.getInfo();
    }

    const body = JSON.stringify({
      deviceOS: deviceInfo.osVersion || null,
      deviceModel: deviceInfo.model || null,
      stockwiseVersion: appInfo.version || null,
      levelHistory: this.gameStore.levelHistory,
      stats: this.gameStore.stats,
      settings: this.gameStore.settings,
      adsWatched: this.adsStore.adsWatched
    })
      
    console.log('BODY', body)
    
    const url = 'https://www.stockwise.app/api/letterlock-stats-upsert'
      axios.post(url, body)
        .catch(error => {
          console.error(error)
        })
  }
}
</script>
