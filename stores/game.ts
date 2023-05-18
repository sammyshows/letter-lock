import { defineStore } from 'pinia'
import { Preferences } from '@capacitor/preferences';
import levels from "@/helpers/levels"
import { Tile, IndexedLevelHistoryData } from "@/types/types"

export const useGameStore = defineStore('game', {
  state: () => ({
    currentLevelId: 0,
    gridSize: 3,
    bestMoves: 0,
    maxMoves: 0,
    par: 0,
    currentLevelTiles: null as (Tile[] | null),
    currentLevelValidWords: null as (string[] | null),
    levelHistory: null as (IndexedLevelHistoryData | null) // it isn't exactly the same data type so feel free to remove
  }),

  actions: {
    async setGameState() {
      const levelHistory = await Preferences.get({ key: 'levels' })
      if (levelHistory.value)
        this.levelHistory = JSON.parse((levelHistory.value))

      this.setCurrentLevel()
    },

    async setCurrentLevel() {
      if (this.levelHistory) { // retrieve the user's current level
        const keys = Object.keys(this.levelHistory)
        const lastKey = parseInt(keys[keys.length - 1] + 1 ) // Be carefully if considering simplifying this. The current approach is safe...
        const level = levels[lastKey]

        this.currentLevelId = lastKey
        this.gridSize = level.gridSize
        this.maxMoves = level.maxMoves
        this.par = level.par
        this.currentLevelTiles = level.tiles
        this.currentLevelValidWords = level.validWords
      } else { // set the first level
        const level = levels[40]
        this.currentLevelId = 40
        this.gridSize = level.gridSize
        this.maxMoves = level.maxMoves
        this.par = level.par
        this.currentLevelTiles = level.tiles
        this.currentLevelValidWords = level.validWords
      }
    },

    async setNextLevel() {
      this.currentLevelId++ // bump the level
      const nextLevel = levels[ this.currentLevelId ]

      this.gridSize = nextLevel.gridSize
      this.maxMoves = nextLevel.maxMoves
      this.par = nextLevel.par
      this.currentLevelTiles = nextLevel.tiles
      this.currentLevelValidWords = nextLevel.validWords

      this.saveLevelProgress
    },

    async saveLevelProgress() {
      if (this.levelHistory) {
        this.levelHistory[this.currentLevelId] = {
          bestMoves: this.bestMoves
        }
      } else {
        this.levelHistory = { 0: { bestMoves: this.bestMoves } }
      }

      await Preferences.set({
        key: 'levels',
        value: JSON.stringify(this.levelHistory)
      })
    },

    async resetProgress() {
      await Preferences.set({
        key: 'levels',
        value: JSON.stringify(levels),
      });
    }
  },
})