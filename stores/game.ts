import { defineStore } from 'pinia'
import { Preferences } from '@capacitor/preferences';
import levels from "@/helpers/levels"
import { Tile, IndexedLevelHistoryData, LevelData } from "@/types/types"

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
      lifeLostTime: null as (number | null) // unix 
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
      if (this.settings.realLives) {
        this.lives.count += number;

        if (number < 0) { // life lost
          this.lives.lifeLostTime = new Date().getTime(); // get current time in milliseconds since Unix epoch
        } else if (number > 0 && this.lives.count <= 5) { // life gained, and total lives doesn't exceed maximum (5 in this case)
          this.lives.lifeLostTime = null; // reset the life lost time
        }
      }

      Preferences.set({
        key: 'letterlock-lives',
        value: JSON.stringify(this.lives)
      })
    },

    async checkLives() {
      const now = new Date().getTime(); // get current time

      if (this.lives.lifeLostTime) {
        const timePassed = now - this.lives.lifeLostTime; // time passed since a life was lost
        const timeToRegainLife = 25 * 60 * 1000; // 25 minutes in milliseconds

        // check if enough time has passed to regain a life
        if (this.lives.count < 5 && timePassed >= timeToRegainLife) {
          const livesGained = Math.floor(timePassed / timeToRegainLife); // calculate how many lives should be regained
          this.lives.count += livesGained; // add regained lives

          if (this.lives.count >= 5) { // if maximum lives is reached, reset lifeLostTime
            this.lives.count = 5;
            this.lives.lifeLostTime = null;
          } else { // otherwise, calculate the new lifeLostTime
            this.lives.lifeLostTime += livesGained * timeToRegainLife;
          }

          // store updated lives data
          await Preferences.set({
            key: 'letterlock-lives',
            value: JSON.stringify(this.lives)
          });
        }
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