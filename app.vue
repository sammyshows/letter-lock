<template>
  <div class="h-full w-full bg-gradient-to-b from-blue-700 via-blue-500 to-blue-600 overflow-hidden">
    <NuxtPage v-if="gameStateLoaded" />
  </div>
</template>

<script setup>
import axios from 'axios'
import Sortable, { Swap } from 'sortablejs'
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { Device } from '@capacitor/device'
import { useGameStore } from '@/stores/game'
import { useAdsStore } from '@/stores/ads'

Sortable.mount(new Swap())

const gameStore = useGameStore()
const adsStore = useAdsStore()

const { settings, logs, stats, currentLevelId, levelHistory } = toRefs(gameStore)
const { rewardAdsLoaded, adsWatched } = toRefs(adsStore)

const gameStateLoaded = ref(false)
const sendingStats = ref(false)

const sendStats = async () => {
  if (sendingStats.value) return

  sendingStats.value = true
  let deviceInfo = {}
  let appInfo = {}
  const platform = Capacitor.getPlatform()

  if (platform !== 'web') {
    deviceInfo = await Device.getInfo()
    appInfo = await App.getInfo()
  }

  const logsCopy = [...logs.value] // Copy logs so we can safely remove them from state later without affecting new logs that were added during this process

  const body = JSON.stringify({
    deviceOS: deviceInfo.osVersion || null,
    deviceModel: deviceInfo.model || null,
    letterlockVersion: appInfo.version || null,
    levelHistory: levelHistory.value,
    stats: stats.value,
    settings: settings.value,
    adsWatched: adsWatched.value,
    logs: logsCopy,
    platform
  })

  // const url = 'http://localhost:3020/api/letterlock-stats-upsert'
  const url = 'https://www.stockwise.app/api/letterlock-stats-upsert'

  await axios.post(url, body)
    .then(() => {
      gameStore.$patch(state => state.logs = state.logs.filter(log => !logsCopy.includes(log)))
      adsStore.$patch({ adsWatched: [] })
    })
    .catch(error => console.error(error))

  sendingStats.value = false
}

const initialiseFirebase = async () => {
  const appInfo = await App.getInfo()
  await setFirebaseUserId(settings.value.id)
  await setFirebaseUserProperty({ 'letterlockVersion': appInfo.version || 'Unknown' })
}

const checkAdAttributionAndLog = async () => {
  const attributionData = await checkAdAttribution()
  if (attributionData?.attribution) {
    logFirebaseEvent("apple_search_ads_attribution", {
      campaign_id: attributionData.campaignId,
      ad_group_id: attributionData.adGroupId,
      ad_group_name: attributionData.adGroupName,
      keyword: attributionData.keyword
    })
  }
}

onMounted(async () => {
  await gameStore.setInitialState()
  gameStore.getLeaderboard()
  adsStore.initialiseRewardAd()
  adsStore.prepareRewardAd()
  gameStateLoaded.value = true
  initialiseFirebase()
  checkAdAttributionAndLog()

  window.screen.orientation.lock('portrait')

  App.addListener('appStateChange', ({ isActive }) => isActive ? playTrack() : pauseTrack())
})

watch(rewardAdsLoaded, (newValue) => {
  if (newValue <= 0) {
    adsStore.prepareRewardAd()
  }
})

watch(stats, () => {
  sendStats()
}, { deep: true })

watch(logs, () => {
  sendStats()
}, { deep: true })

watch(currentLevelId, (newLevelId, oldLevelId) => {
  if (newLevelId > oldLevelId) {
    sendStats()
  }
})
</script>


<style>
* {
    -webkit-touch-callout: none;  /* Disable callout (iOS Safari) */
    -webkit-user-select: none;    /* Disable text selection (Safari, Chrome, Opera) */
    -moz-user-select: none;       /* Disable text selection (Firefox) */
    -ms-user-select: none;        /* Disable text selection (IE, Edge) */
    user-select: none;            /* Generic disable text selection */
    -webkit-tap-highlight-color:  rgba(0,0,0,0); /* Remove tap highlight color (iOS Safari) */
}

img {
    pointer-events: none; /* Disable image dragging */
}

/* Overrides tailwind classes for thin screens */
@media (max-width: 300px) or (max-width: 320px) {
  .text-xs {
    font-size: 0.65rem !important; /* Slightly smaller size */
    line-height: 0.875rem !important;
  }
  .text-sm {
    font-size: 0.775rem !important;
    line-height: 1.125rem !important;
  }
  .text-base {
    font-size: 0.875rem !important;
    line-height: 1.375rem !important;
  }
  .text-lg {
    font-size: 1rem !important;
    line-height: 1.325rem !important;
  }
  .text-xl {
    font-size: 1.125rem !important;
    line-height: 1.625rem !important;
  }
  .text-2xl {
    font-size: 1.375rem !important;
    line-height: 1.875rem !important
  }
  .text-3xl {
    font-size: 1.525rem !important;
    line-height: 2.125rem !important;
  }
  .text-4xl {
    font-size: 2.075rem !important;
    line-height: 2.375rem !important;
  }
  .text-5xl {
    font-size: 2.75rem !important;
    line-height: 1 !important;
  }
  .text-6xl {
    font-size: 3.45rem !important;
    line-height: 1 !important;
  }
  .text-7xl {
    font-size: 4.15rem !important;
    line-height: 1 !important;
  }
  .text-8xl {
    font-size: 5.5rem !important;
    line-height: 1 !important;
  }
  .text-9xl {
    font-size: 7.5rem !important;
    line-height: 1 !important;
  }
  /* Custom text sizes */
  .text-4-5xl {
    font-size: 2rem !important;
    line-height: 2.3rem !important;
  }
  .text-5-5xl {
    font-size: 3.25rem !important;
    line-height: 3.7rem !important;
  }
  .text-6-5xl {
    font-size: 4.15rem !important;
    line-height: 4.7rem !important;
  }
  .text-7-5xl {
    font-size: 5.05rem !important;
    line-height: 5.8rem !important;
  }
}




/* Overrides tailwind classes for SMALLER screens */
@media (max-width: 300px), (max-height: 550px) {
  .text-xs {
    font-size: 0.6rem !important; /* Smaller size */
    line-height: 0.75rem !important;
  }
  .text-sm {
    font-size: 0.7rem !important;
    line-height: 1rem !important;
  }
  .text-base {
    font-size: 0.8rem !important;
    line-height: 1.25rem !important;
  }
  .text-lg {
    font-size: 0.9rem !important;
    line-height: 1.2rem !important;
  }
  .text-xl {
    font-size: 0.95rem !important;
    line-height: 1.3rem !important;
  }
  .text-2xl {
    font-size: 1.1rem !important;
    line-height: 1.65rem !important;
  }
  .text-3xl {
    font-size: 1.4rem !important;
    line-height: 2rem !important;
  }
  .text-4xl {
    font-size: 1.7rem !important;
    line-height: 2.15rem !important;
  }
  .text-5xl {
    font-size: 2.5rem !important;
    line-height: 1 !important;
  }
  .text-6xl {
    font-size: 3rem !important;
    line-height: 1 !important;
  }
  .text-7xl {
    font-size: 3.5rem !important;
    line-height: 1 !important;
  }
  .text-8xl {
    font-size: 4.5rem !important;
    line-height: 1 !important;
  }
  .text-9xl {
    font-size: 6rem !important;
    line-height: 1 !important;
  }
  /* Custom text sizes */
  .text-4-5xl {
    font-size: 1.8rem !important;
    line-height: 2.1rem !important;
  }
  .text-5-5xl {
    font-size: 2.8rem !important;
    line-height: 3.4rem !important;
  }
  .text-6-5xl {
    font-size: 3.5rem !important;
    line-height: 4rem !important;
  }
  .text-7-5xl {
    font-size: 4.2rem !important;
    line-height: 5rem !important;
  }
}

</style>
