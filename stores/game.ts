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
    levelHistory: null as (IndexedLevelHistoryData | null), // it isn't exactly the same data type so feel free to remove
    settings: {
      testMode: false,
      showAnimations: true
    }
  }),

  actions: {
    async setInitialState() {
      const levelHistory = await Preferences.get({ key: 'letterlock-levels' })
      const settings = await Preferences.get({ key: 'letterlock-settings' })

      if (levelHistory.value)
        this.levelHistory = JSON.parse((levelHistory.value))

      if (settings.value)
        this.settings = JSON.parse((settings.value))

      this.setCurrentLevel()
    },

    setCurrentLevel(levelId?) {
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

    async saveLevelProgress(remainingMoves) {
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