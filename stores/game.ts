import { v4 as uuid } from 'uuid';
import { defineStore } from 'pinia'
import { Preferences } from '@capacitor/preferences'

import { useAdsStore } from '@/stores/ads'
import levels from "@/helpers/levels"
import { Tile, IndexedLevelHistoryData } from "@/types/types"

export const useGameStore = defineStore('game', {
  state: () => ({
    showUserDemo: false,
    totalLevelCount: Object.keys(levels).length,
    allLevelsCompleteModalShown: false,
    currentLevelId: 0,
    maxLevelId: 0,
    gridSize: 3,
    maxMoves: 0,
    bestRemainingMoves: 0,
    par: 0,
    currentLevelTiles: null as (Tile[] | null),
    currentLevelValidWords: null as (string[] | null),
    replayingLevel: false, // used to indicate if this level is being replayed i.e. it's being completed before
    timeToRegainLife: 1800000, // 30 mins in ms
    // timeToRegainLife: 8000, // 8 secs in ms
    maxLives: 5,
    processingLife: false,

    event: {
      type: '',
      quantity: 0
    },

    // Level History
    levelHistory: {
      1: {
        bestRemainingMoves: 0,
        attemptTally: 0,
        successTally: 0,
        extraMovesUsed: false
      }
    } as IndexedLevelHistoryData, // it isn't exactly the same data type so feel free to remove
    
    // Settings
    settings: {
      id: uuid(),
      notifications: true,
      sound: true,
      vibrations: true,
      testMode: false,
      showAnimations: true,
      realLives: true
    },

    // Lives
    lives: {
      count: 1,
      nextLifeTime: null as (number | null) // unix 
    },

    // Currency
    currency: {
      amount: 0
    },

    stats: {
      streak: 0,
      adsWatchedForLives: 0,
      adsWatchedForMoves: 0,
      zeroLivesTally: 0
    }
  }),

  actions: {
    async setInitialState() {
      const levelHistory = await Preferences.get({ key: 'letterlock-levels' })
      const settings = await Preferences.get({ key: 'letterlock-settings' })
      const lives = await Preferences.get({ key: 'letterlock-lives' })
      const currency = await Preferences.get({ key: 'letterlock-currency' })
      const stats = await Preferences.get({ key: 'letterlock-stats' })

      if (levelHistory.value)
        this.levelHistory = JSON.parse((levelHistory.value))
      else
        this.showUserDemo = true

      if (settings.value)
        this.settings = JSON.parse((settings.value))
      else { // initialise settings so we have a unique id from the start
        await Preferences.set({
          key: 'letterlock-settings',
          value: JSON.stringify(this.settings)
        })
      }

      if (lives.value) {
        this.lives = JSON.parse((lives.value))
        this.checkLives()
      }

      if (currency.value)
        this.currency = JSON.parse((currency.value))

      if (stats.value)
        this.stats = JSON.parse((stats.value))

      await this.setCurrentLevel()
    },

    async setCurrentLevel(levelId?: number) {
      let level
      if (this.levelHistory) { // retrieve the user's current level
        const keys = Object.keys(this.levelHistory)
        this.maxLevelId = parseInt(keys[keys.length - 1])

        const currentLevelId = levelId || this.maxLevelId
        level = levels[currentLevelId]
        this.currentLevelId = currentLevelId
      } else { // set the first level
        // const levelHistory = await Preferences.get({ key: 'letterlock-levels' })
        // if (!levelHistory.value) { // if no level history, set the first level. Checking a second time to be safe, this will overwrite any existing levelHistory
        //   level = levels[levelId || 1]
        //   this.currentLevelId = levelId || 1
        // }
      }

      if (level) {
        this.gridSize = level.gridSize
        this.maxMoves = level.maxMoves
        this.par = level.par
        this.currentLevelTiles = level.tiles
        this.currentLevelValidWords = level.validWords
      }

      if (this.levelHistory && this.levelHistory[this.currentLevelId] && this.levelHistory[this.currentLevelId].successTally > 0) {
        this.bestRemainingMoves = this.levelHistory[this.currentLevelId].bestRemainingMoves
        // console.log('REPLAYING LEVEL', this.replayingLevel)
        this.replayingLevel = true
      } else if (this.levelHistory && !this.levelHistory[this.currentLevelId]) {
        this.levelHistory[this.currentLevelId] = {
          bestRemainingMoves: 0,
          attemptTally: 0,
          successTally: 0,
          extraMovesUsed: false
        }

        await Preferences.set({
          key: 'letterlock-levels',
          value: JSON.stringify(this.levelHistory)
        })
      } else {
        this.replayingLevel = false
      }
    },

    async saveLevelProgress(levelSuccess: boolean, remainingMoves: number, extraMovesUsed: boolean) {
      this.levelHistory[this.currentLevelId].attemptTally += 1

      if (extraMovesUsed)
        this.stats.adsWatchedForMoves += 1
      
      if (levelSuccess) {
        let mostRemainingMoves = Math.max(remainingMoves, this.bestRemainingMoves)
        if (!this.replayingLevel)
          this.stats.streak ++

        this.levelHistory[this.currentLevelId].bestRemainingMoves = mostRemainingMoves
        this.levelHistory[this.currentLevelId].successTally += 1

        if (extraMovesUsed && ((remainingMoves > this.bestRemainingMoves) || !this.replayingLevel)) // only set if the extra moves were used to beat the previous best or if this is the first time the level has being completed
          this.levelHistory[this.currentLevelId].extraMovesUsed = true
        else if (remainingMoves > this.bestRemainingMoves)
          this.levelHistory[this.currentLevelId].extraMovesUsed = false
      }

      await Preferences.set({
        key: 'letterlock-levels',
        value: JSON.stringify(this.levelHistory)
      })

      await Preferences.set({
        key: 'letterlock-stats',
        value: JSON.stringify(this.stats)
      })
    },

    async resetLevel() {
      if (!this.replayingLevel)
        this.stats.streak = 0
        
      this.setCurrentLevel(this.currentLevelId)
      this.handleLives(-1)

      await Preferences.set({
        key: 'letterlock-stats',
        value: JSON.stringify(this.stats)
      })
    },

    handleLives(number) { // at this stage only -1 or 1
      const adsStore = useAdsStore()

      if (this.processingLife)
        return

      this.processingLife = true // prevents double ups
      let timeToNextLife = 0
      if (this.lives.nextLifeTime)
        timeToNextLife = Math.floor((this.lives.nextLifeTime || 0) / 1000 - (Date.now() / 1000))

      if (this.settings.realLives) {
        this.lives.count += number;

        if (this.lives.count < 5 && !this.lives.nextLifeTime) { // life lost
          this.lives.nextLifeTime = Date.now() + this.timeToRegainLife
        } else if (number > 0 && this.lives.count < 5 && timeToNextLife <= 0) { // life added
          this.lives.nextLifeTime = Date.now() + this.timeToRegainLife
        } else if (this.lives.count >= 5 || timeToNextLife > 2400000) { // second check is a safety guard - If timeToNextLife > 40 min, then something went wrong
          this.lives.nextLifeTime = null
        }
      }

      this.processingLife = false

      if (this.lives.count < 2 && adsStore.rewardAdsLoaded < 1)
        adsStore.prepareRewardAd()

      if (this.lives.count <= 0) {
        this.stats.zeroLivesTally += 1
        this.saveStats()
      }

      Preferences.set({
        key: 'letterlock-lives',
        value: JSON.stringify(this.lives)
      })
    },

    async checkLives() {
      // const timeToRegainLife = 1800000 // 30min in ms
      const now = Date.now()

      if (this.lives.nextLifeTime) {
        const timeToNextLife = this.lives.nextLifeTime - now; // time until the next life should be regained
    
        // check if enough time has passed to regain a life
        if (this.lives.count < this.maxLives && timeToNextLife <= 0) {
          const livesGained = Math.max(Math.floor(-timeToNextLife / this.timeToRegainLife), 1) // calculate how many lives should be regained, at least one
          this.lives.count = Math.min(this.lives.count + livesGained, this.maxLives) // add regained lives up to the maximum
    
          if (this.lives.count >= this.maxLives) { // if maximum lives is reached, reset nextLifeTime
            this.lives.nextLifeTime = null;
          } else { // otherwise, calculate the new nextLifeTime
            this.lives.nextLifeTime = now + this.timeToRegainLife;
          }
    
          // store updated lives data
          await Preferences.set({
            key: 'letterlock-lives',
            value: JSON.stringify(this.lives)
          });
        }
      } else {
        this.lives.count = this.maxLives
      }
    },

    async resetProgress() {
      await Preferences.remove({
        key: 'letterlock-levels'
      })

      await Preferences.remove({
        key: 'letterlock-lives'
      })

      await Preferences.remove({
        key: 'letterlock-settings'
      })

      await Preferences.remove({
        key: 'letterlock-currency'
      })

      await Preferences.remove({
        key: 'letterlock-stats'
      })
    },

    async saveStats() {
      await Preferences.set({
        key: 'letterlock-stats',
        value: JSON.stringify(this.stats)
      })
    }
  },
})