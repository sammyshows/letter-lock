import { defineStore } from 'pinia'
import { Capacitor } from '@capacitor/core';
import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob';

import { useGameStore } from '@/stores/game'
import { logFirebaseEvent } from '@/composables/firebase'

import type { RewardAdOptions } from '@capacitor-community/admob';
import type { Reward } from "@/types/types";

export const useAdsStore = defineStore('ads', {
  state: () => {
    return {// these routes can show banner ads, routes that can't are /auth, /terms etc.
      platform: Capacitor.getPlatform(),
      rewardAdsLoaded: 0,
      adCompleted: false,
      currentReward: null as (Reward | null),
      rewardAdsLoadFailedTally: 0,
      rewardAdsLoadFailedTime: 0, // most recent time a reward ad failed to load
      adsWatched: [] as Array<object> // reset every time data is posted to the server
    }
  },

  actions: {
    async initialiseRewardAd() {
      AdMob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: ['B480F0393703070BEEF8D0B02FF711F5'], // If interested add test ids here such as laptop, my phone, Celine's phone: https://developers.google.com/admob/android/test-ads#add_your_test_device_in_the_admob_ui
        initializeForTesting: false
      });

      AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
        console.log('LOADED REWARD AD')
        this.rewardAdsLoaded += 1
      });

      AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error) => {
        console.log('FAILED TO LOAD AD:', JSON.stringify(error));
        this.rewardAdsLoadFailedTally += 1
        this.rewardAdsLoadFailedTime = Date.now()
        this.prepareRewardAd()
      });

      AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
        console.log('DISMISSED')

        if (this.platform === 'android')
          this.handleAdCompletion()
      })

      AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => {
        console.log('FAILED TO SHOW')

        this.rewardAdsLoaded -= 1
        this.currentReward = null
      })

      AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
        this.adCompleted = true
        if (this.platform === 'ios')
          this.handleAdCompletion()
      })

      AdMob.addListener(RewardAdPluginEvents.Showed, () => {
        console.log('SHOWED')
      })
    },

    async prepareRewardAd(): Promise<void> {
      if (this.rewardAdsLoaded > 2 || (this.rewardAdsLoadFailedTally > 2 && (Date.now() - this.rewardAdsLoadFailedTime) < 1800000)) return // prevents constant requests of ads if something's not working, don't want admob to be mad!

      const getRewardAdId = (): string => {
        if (this.platform === 'android')
          // return 'ca-app-pub-7719091147897476/8922262077' // testing
          return 'ca-app-pub-7719091147897476/8922262077' // production (real)
        else if (this.platform === 'ios')
          // return 'ca-app-pub-3940256099942544/5224354917' // testing
          return 'ca-app-pub-7719091147897476/9999762763' // production (real)
        else
          return ''
      }

      const options: RewardAdOptions = {
        adId: getRewardAdId()
      }

      await AdMob.prepareRewardVideoAd(options)
    },

    async showRewardAd(reward: Reward) {
      logFirebaseEvent('ad_watched', { reward: reward.type, level: useGameStore().currentLevelId})
      this.currentReward = reward
      this.prepareRewardAd()
      await AdMob.showRewardVideoAd()
    },

    handleAdCompletion() {
      const gameStore = useGameStore()

      console.log('AD COMPLETED:', true);
      this.rewardAdsLoaded -= 1;
  
      if (this.adCompleted && this.currentReward) {
          if (gameStore.currentLevelId && gameStore.levelHistory[gameStore.currentLevelId]) {
              this.adsWatched.push({
                  adType: this.currentReward.type,
                  levelId: gameStore.currentLevelId,
                  levelAttemptTally: gameStore.levelHistory[gameStore.currentLevelId].attemptTally,
                  levelSuccessTally: gameStore.levelHistory[gameStore.currentLevelId].successTally,
                  levelStreak: gameStore.stats.streak
              });
          }
  
          if (this.currentReward.type === 'additionalLife') {
              gameStore.handleLives(this.currentReward.quantity);
              gameStore.stats.adsWatchedForLives += 1;
              gameStore.saveStats();
          }
          else if (this.currentReward.type === 'additionalMoves') {
              gameStore.event = { type: 'userReceivedExtraMoves', quantity: this.currentReward.quantity };
              gameStore.stats.adsWatchedForMoves += 1;
          }
      }
  
      this.adCompleted = false;
      this.currentReward = null;
    }
  }
})