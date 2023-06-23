<template>
  <div class="h-full w-full bg-gradient-to-b from-blue-700 via-blue-500 to-blue-600 overflow-hidden">
    <NuxtPage v-if="gameStateLoaded" />
  </div>
</template>

<script>
import axios from 'axios'
import Sortable, { Swap } from "sortablejs";
import { App } from "@capacitor/app";
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { useGameStore } from "@/stores/game";
import { useAdsStore } from "@/stores/ads";

Sortable.mount(new Swap());

export default {
  name: 'App',

  setup() {
    const gameStore = useGameStore()
    const adsStore = useAdsStore()

    return { gameStore, adsStore }
  },

  watch: {
    'gameStore.stats': {
      handler() {
        this.sendStats()
      },
      deep: true
    }
  },

  data() {
    return {
      gameStateLoaded: false,
      sendingStats: false,
      platform: Capacitor.getPlatform()
    }
  },

  async created() {
    await this.gameStore.setInitialState()
    this.adsStore.initialiseRewardAd()
    this.adsStore.prepareRewardAd()
    this.gameStateLoaded = true

    window.screen.orientation.lock('portrait')
  },

  methods: {
    async sendStats() {
      if (this.sendingStats) return

      this.sendingStats = true
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

      // const url = 'http://localhost:8888/api/letterlock-stats-upsert'
      const url = 'https://www.stockwise.app/api/letterlock-stats-upsert'
      
      await axios.post(url, body)
        .then(() => {
          this.adsStore.$patch({ adsWatched: [] })
        })
        .catch(error => {
          console.error(error)
        })

      this.sendingStats = false
    }
  }
}
</script>

<style>
/* Overrides tailwind classes for thin screens */
@media (max-width: 300px) or ((max-height: 650px) and (min-width: 280px)) {
  .text-xs {
    font-size: 0.65rem; /* Slightly smaller size */
    line-height: 0.875rem;
  }
  .text-sm {
    font-size: 0.775rem;
    line-height: 1.125rem;
  }
  .text-base {
    font-size: 0.875rem;
    line-height: 1.375rem;
  }
  .text-lg {
    font-size: 1rem;
    line-height: 1.325rem;
  }
  .text-xl {
    font-size: 1.125rem;
    line-height: 1.625rem;
  }
  .text-2xl {
    font-size: 1.375rem;
    line-height: 1.875rem;
  }
  .text-3xl {
    font-size: 1.525rem;
    line-height: 2.125rem;
  }
  .text-4xl {
    font-size: 2.075rem;
    line-height: 2.375rem;
  }
  .text-5xl {
    font-size: 2.75rem;
    line-height: 1;
  }
  .text-6xl {
    font-size: 3.45rem;
    line-height: 1;
  }
  .text-7xl {
    font-size: 4.15rem;
    line-height: 1;
  }
  .text-8xl {
    font-size: 5.5rem;
    line-height: 1;
  }
  .text-9xl {
    font-size: 7.5rem;
    line-height: 1;
  }
  /* Custom text sizes */
  .text-4-5xl {
    font-size: 2rem;
    line-height: 2.3rem;
  }
  .text-5-5xl {
    font-size: 3.25rem;
    line-height: 3.7rem;
  }
  .text-6-5xl {
    font-size: 4.15rem;
    line-height: 4.7rem;
  }
  .text-7-5xl {
    font-size: 5.05rem;
    line-height: 5.8rem;
  }
}
</style>
