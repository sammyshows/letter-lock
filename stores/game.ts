import { v4 as uuid } from 'uuid';
import { defineStore } from 'pinia'
import { Preferences } from '@capacitor/preferences'
import axios from 'axios'

import { useAdsStore } from '@/stores/ads'
import levels from "@/helpers/levels"
import { generateUsername } from "@/helpers"
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

    leaderboardDisplayedOnMount: false,
    leaderboardAllTime: null as (Array<{}> | null), // top 5 users

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
        replayTally: 0,
        extraMovesUsed: false
      }
    } as IndexedLevelHistoryData, // it isn't exactly the same data type so feel free to remove
    
    // Settings
    settings: {
      id: uuid(),
      username: '',
      notifications: true,
      sound: true,
      vibrations: true,
      testMode: false,
      showAnimations: true,
      realLives: true
    },

    // Lives
    lives: {
      count: 5,
      nextLifeTime: null as (number | null) // unix 
    },

    // Currency
    currency: {
      amount: 0
    },

    // Stats
    stats: {
      streak: 0,
      adsWatchedForLives: 0,
      adsWatchedForMoves: 0,
      zeroLivesTally: 0
    },

    // Logs
    logs: [] as Array<{ logType: number, levelId: number, createdAt: string }>, // UserId is added to the log on the server side
  }),

  actions: {
    async setInitialState() {
      const levelHistory = await Preferences.get({ key: 'letterlock-levels' })
      const settings = await Preferences.get({ key: 'letterlock-settings' })
      const lives = await Preferences.get({ key: 'letterlock-lives' })
      const currency = await Preferences.get({ key: 'letterlock-currency' })
      const stats = await Preferences.get({ key: 'letterlock-stats' })
      const leaderboard = await Preferences.get({ key: 'letterlock-leaderboard' })

      if (levelHistory.value)
        this.levelHistory = JSON.parse((levelHistory.value))
      else
        this.showUserDemo = true

      if (settings.value) { // If settings exits
        this.settings = JSON.parse((settings.value))
      }
      if (!settings.value || !this.settings.username) { // initialise settings so we have a unique id from the start - OR - add username if it doesn't exist
        this.settings.username = generateUsername()
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

      if (leaderboard.value)
        this.leaderboardAllTime = JSON.parse((leaderboard.value))

      await this.setCurrentLevel()
    },

    async startLevel() {
      setTimeout(() => this.handleLives(-1), 2000) // delay so there's no UI lag. The heart lives count on the game page is static and should appear as if they haven't lost a life yet - this delay allows it to be set before 1 gets removed behind the scenes
      this.$router.push({ path: `/game` })

      await Preferences.set({
        key: 'letterlock-lives',
        value: JSON.stringify(this.lives)
      })
    },

    async setCurrentLevel(levelId?: number) {
      let level
      if (this.levelHistory) { // retrieve the user's current level
        const keys = Object.keys(this.levelHistory)
        this.maxLevelId = Math.max(levelId || 0, parseInt(keys[keys.length - 1]))

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
          replayTally: 0,
          extraMovesUsed: false
        }

        this.bestRemainingMoves = 0;

        await Preferences.set({
          key: 'letterlock-levels',
          value: JSON.stringify(this.levelHistory)
        })
      } else {
        this.bestRemainingMoves = 0;
        this.replayingLevel = false
      }
    },

    async saveLevelProgress(levelSuccess: boolean, remainingMoves: number, extraMovesUsed: boolean) {
      this.levelHistory[this.currentLevelId].attemptTally += 1
      if (this.replayingLevel)
        this.levelHistory[this.currentLevelId].replayTally += 1

      if (levelSuccess) {
        this.handleLives(1)
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

      await Preferences.set({
        key: 'letterlock-lives',
        value: JSON.stringify(this.lives)
      })
    },

    async resetLevel() {
      if (!this.replayingLevel)
        this.stats.streak = 0
        
      this.setCurrentLevel(this.currentLevelId)

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
      try {
        let timeToNextLife = 0
        if (this.lives.nextLifeTime)
          timeToNextLife = Math.floor((this.lives.nextLifeTime || 0) - (Date.now()))

        if (this.settings.realLives) {
          this.lives.count += number;

          const lifeLost = this.lives.count < 5 && !this.lives.nextLifeTime // if lives are less than 5 and there is no nextLifeTime, then set the nextLifeTime
          const lifeGained = number > 0 && this.lives.count < 5 && timeToNextLife <= 0 // if lives are less than 5 and there is no nextLifeTime, then set the nextLifeTime

          if (lifeLost || lifeGained) {
            this.lives.nextLifeTime = Date.now() + this.timeToRegainLife
          } else if (timeToNextLife > 2400000) { // second check is a safety guard - If timeToNextLife > 40 min, then something went wrong. Should always be under 1800000 (30min), can even be negative if there are 2 or more lives owed, see checkLives() for more info.
            this.lives.nextLifeTime = null
          }
        }

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
      } catch (error) {
        console.log('handleLives error', error)
      }
      this.processingLife = false
    },

    async checkLives() {
      // const timeToRegainLife = 1800000 // 30min in ms
      const now = Date.now()

      if (this.lives.nextLifeTime) {
        const timeToNextLife = this.lives.nextLifeTime - now; // time until the next life should be regained
    
        if (this.lives.count < 0) // if lives are negative, set to 0
          this.lives.count = 0

        // check if enough time has passed to regain a life
        if (this.lives.count < this.maxLives && timeToNextLife <= 0) {
          const livesGained = 1 + Math.max(Math.floor((timeToNextLife * -1) / this.timeToRegainLife), 0) // calculate how many lives should be regained, definitely 1, plus however many 30 min periods have passed
          this.lives.count = Math.min(this.lives.count + livesGained, this.maxLives) // add regained lives up to the maximum
    
          if (this.lives.count >= this.maxLives) { // if maximum lives is reached, reset nextLifeTime. Shouldn't get passed the Math.min() above, but need to set nextLifeTime to null anyway, and may as well set lives to max (5) again to be safe.
            this.lives.nextLifeTime = null;
            this.lives.count = this.maxLives
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

    insertLog(logType: number, levelId: number) {
      this.logs.push({ logType, levelId, createdAt: new Date().toISOString() })
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
    },

    async getLeaderboard() {
      // const url = 'http://localhost:3020/api/letterlock-leaderboard-read' // testing
      const url = 'https://www.stockwise.app/api/letterlock-leaderboard-read'

      const body = JSON.stringify({
        userId: this.settings.id
      })

      const res = await axios.post(url, body)
        .catch(error => {
          console.error(error)
        })

      if (res && res.data) {
        this.leaderboardAllTime = res.data.leaderboardAllTime

        Preferences.set({
          key: 'letterlock-leaderboard',
          value: JSON.stringify(this.leaderboardAllTime)
        })
      }

      const user = this.leaderboardAllTime?.find((user) => user.user_id === this.settings.id)

      if (user && this.settings.username) { // supports offline changes to user's leaderboard name/levels completed
        user.levels_completed_count = this.maxLevelId - 1
        user.username = this.settings.username
      }

      // TEMPORARY TO POPULATE OLD USER'S USERNAMES FROM DB (I insterted random usernames for all users)
      if (user && !this.settings.username) {
        this.settings.username = user.username
        Preferences.set({
          key: 'letterlock-settings',
          value: JSON.stringify(this.settings)
        })
      }
    }
  },
})