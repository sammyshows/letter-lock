import { defineStore } from 'pinia'
import { Capacitor } from '@capacitor/core';
import { AdMob, RewardAdPluginEvents, RewardAdOptions } from '@capacitor-community/admob';

import { useGameStore } from '@/stores/game'

export const useAdsStore = defineStore('ads', {
  state: () => {
    return {// these routes can show banner ads, routes that can't are /auth, /terms etc.
      platform: Capacitor.getPlatform(),
      rewardAdsLoaded: 0,
      currentReward: null as ({} | null)
    }
  },

  actions: {
    async initialiseRewardAd() {
      const gameStore = useGameStore()

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
      });      

      AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
        console.log('DISMISSED')
        this.rewardAdsLoaded -= 1
        this.prepareRewardAd()
        this.currentReward = null
      });

      AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => {
        console.log('FAILED TO SHOW')

        this.rewardAdsLoaded -= 1
        this.prepareRewardAd()
        this.currentReward = null
      });

      AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
        gameStore.handleLives(1)
        this.rewardAdsLoaded -= 1
        this.prepareRewardAd()
        if (this.currentReward) {
          if (this.currentReward.type === 'life')
            gameStore.handleLives(this.currentReward.count)
        }
        this.currentReward = null
      });

      AdMob.addListener(RewardAdPluginEvents.Showed, () => {
        console.log('SHOWED')
        this.rewardAdsLoaded -= 1
      });

      this.prepareRewardAd()
    },

    async prepareRewardAd(): Promise<void> {
      const getRewardAdId = (): string => {
        console.log(this.platform)
        if (this.platform === 'android')
          return 'ca-app-pub-7719091147897476/8922262077' // testing
          // return 'ca-app-pub-7719091147897476/7336552975' // production
        else // if (userStore.platform === 'ios')
          return 'ca-app-pub-3940256099942544/5224354917' // testing
          // return 'ca-app-pub-7719091147897476/5099565587' // production
      }

      const options: RewardAdOptions = {
        adId: getRewardAdId()
      }

      await AdMob.prepareRewardVideoAd(options)
      this.rewardAdsLoaded += 1
    },

    async showRewardAd(reward: object) {
      this.currentReward = reward
      await AdMob.showRewardVideoAd()
    }
  }
})