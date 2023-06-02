import { defineStore } from 'pinia'
import { Preferences } from '@capacitor/preferences';
import levels from "@/helpers/levels"
import { Tile, IndexedLevelHistoryData } from "@/types/types"

export const useGameStore = defineStore('game', {
  state: () => ({
    currentLevelId: 0,
    gridSize: 3,
    bestRemainingMoves: 0,
    maxMoves: 0,
    par: 0,
    currentLevelTiles: null as (Tile[] | null),
    currentLevelValidWords: null as (string[] | null),
    replayingLevel: false, // used to indicate if this level is being replayed i.e. it's being completed before
    timeToRegainLife: 1800000, // 30 mins in ms
    // timeToRegainLife: 8000, // 3 secs in ms
    maxLives: 5,
    processingLife: false,

    // Settings
    levelHistory: null as (IndexedLevelHistoryData | null), // it isn't exactly the same data type so feel free to remove
    settings: {
      testMode: false,
      showAnimations: true,
      realLives: true
    },

    // Lives
    lives: {
      count: 1,
      nextLifeTime: null as (number | null) // unix 
    }
  }),

  actions: {
    async setInitialState() {
      const levelHistory = await Preferences.get({ key: 'letterlock-levels' })
      const settings = await Preferences.get({ key: 'letterlock-settings' })
      const lives = await Preferences.get({ key: 'letterlock-lives' })

      if (levelHistory.value)
        this.levelHistory = JSON.parse((levelHistory.value))

      if (settings.value)
        this.settings = JSON.parse((settings.value))

      if (lives.value) {
        this.lives = JSON.parse((lives.value))
        this.checkLives()
      }

      this.setCurrentLevel()
    },

    setCurrentLevel(levelId?: number) {
      let level
      if (this.levelHistory) { // retrieve the user's current level
        const keys = Object.keys(this.levelHistory)
        const currentLevelId = levelId || parseInt(keys[keys.length - 1]) + 1 // Be carefully if considering simplifying this. The current approach is safe...
        level = levels[currentLevelId]
        this.currentLevelId = currentLevelId
      } else { // set the first level
        level = levels[levelId || 1]
        this.currentLevelId = levelId || 1
      }
      this.gridSize = level.gridSize
      this.maxMoves = level.maxMoves
      this.par = level.par
      this.currentLevelTiles = level.tiles
      this.currentLevelValidWords = level.validWords

      if (this.levelHistory && this.levelHistory[this.currentLevelId]) {
        this.bestRemainingMoves = this.levelHistory[this.currentLevelId].bestRemainingMoves
        this.replayingLevel = true
      } else {
        this.replayingLevel = false
      }
    },

    async saveLevelProgress(remainingMoves: number) {
      let mostRemainingMoves = remainingMoves

      if (this.levelHistory) {
        if (this.levelHistory[this.currentLevelId]) {
          mostRemainingMoves = Math.max(remainingMoves, this.bestRemainingMoves)
        }

        this.levelHistory[this.currentLevelId] = {
          bestRemainingMoves: mostRemainingMoves
        }
      } else {
        this.levelHistory = { 1: { bestRemainingMoves: remainingMoves } }
      }

      await Preferences.set({
        key: 'letterlock-levels',
        value: JSON.stringify(this.levelHistory)
      })
    },

    resetLevel() {
      this.setCurrentLevel(this.currentLevelId)
      this.handleLives(-1)
    },

    handleLives(number) { // at this stage only -1 or 1
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
      this.levelHistory = null
      this.setCurrentLevel()

      await Preferences.remove({
        key: 'letterlock-levels'
      });
    }
  },
})