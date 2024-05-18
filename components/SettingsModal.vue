<template>
  <div v-if="showSettingsModal || hideSettingsModal" class="absolute h-full w-full flex justify-center items-center z-20 tracking-widest" style="font-family: 'Luckiest Guy';">
    <div class="h-full w-full bg-transparent absolute" @click="$emit('close')"></div>

    <div :class="{ 'utility-modal-slide-in': showSettingsModal,  'utility-modal-slide-out': hideSettingsModal }" class="absolute flex flex-col items-center justify-between h-1/2 w-5/6 z-30 bg-gradient-to-br from-white to-slate-50 rounded-3xl text-center shadow-xl sm:w-2/3 sm:h-1/2 sm:py-10 sm:rounded-5xl lg:w-2/3 lg:h-2/5">
      <div @click="$emit('close')" class="absolute -top-4 -right-4 xs:-top-5 xs:-right-5 md:-top-8 md:-right-8 lg:-top-12 lg:-right-12">
        <div class="z-10 absolute top-2 right-2 w-6 h-6 xs:w-10 xs:h-10 rounded-full bg-white md:w-16 md:h-16 lg:w-20 lg:h-20 lg:top-6 lg:right-6"></div>
        <IconsX class="absolute z-40 -top-0 -right-0 w-10 h-10 xs:w-14 xs:h-14 text-red-400 md:w-20 md:h-20 lg:w-28 lg:h-28" />
      </div>

      <div class="modal-padding h-full overflow-scroll">
        <div class="text-center">
          <h3 class="text-4xl leading-6 font-medium text-ll-orange sm:text-6xl lg:text-7xl">Settings</h3>
        </div>
  
        <div class="settings-margin w-full flex flex-col grow items-center px-8 text-sm sm:px-12 sm:text-2xl lg:px-16 lg:text-3xl">
          <div class="w-full flex justify-between mt-4">
            <span class="flex items-center pr-2 font-medium text-slate-500">Username</span>
            <input v-model="settings.username" maxlength="17" type="text" class="w-36 pl-2 text-sm text-right font-bold text-slate-600 border-b-2 outline-none sm:w-56 sm:text-2xl lg:w-72 lg:text-3xl" style="font-family: Poppins; touch-action: manipulation;">
          </div>
  
          <div class="w-full flex justify-between mt-4">
            <span class="flex items-center font-medium text-slate-500">Notifications</span>
            <label @click="playSound('switch')" class="relative inline-flex items-center cursor-pointer">
              <input v-model="settings.notifications" type="checkbox" class="sr-only peer" style="touch-action: manipulation;">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 sm:h-9 sm:w-16 sm:after:h-7 sm:after:w-7 sm:after:top-[4px] sm:after:left-[4px]"></div>
            </label>
          </div>
          
          <div class="w-full flex justify-between mt-4">
            <span class="flex items-center font-medium text-slate-500">Sound</span>
            <label @click="playSound('switch')" class="relative inline-flex items-center cursor-pointer">
              <input v-model="settings.sound" type="checkbox" class="sr-only peer" style="touch-action: manipulation;">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 sm:h-9 sm:w-16 sm:after:h-7 sm:after:w-7 sm:after:top-[4px] sm:after:left-[4px]"></div>
            </label>
          </div>
  
          <div class="w-full flex justify-between mt-4">
            <span class="flex items-center font-medium text-slate-500">Vibrations</span>
            <label @click="playSound('switch')" class="relative inline-flex items-center cursor-pointer">
              <input v-model="settings.vibrations" type="checkbox" class="sr-only peer" style="touch-action: manipulation;">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 sm:h-9 sm:w-16 sm:after:h-7 sm:after:w-7 sm:after:top-[4px] sm:after:left-[4px]"></div>
            </label>
          </div>
  
          <!-- TEST MODE BUTTON -->
          <div class="w-full flex justify-between mt-4">
            <span class="flex items-center font-medium text-slate-500">Test Mode</span>
            <label @click="playSound('switch')" class="relative inline-flex items-center cursor-pointer">
              <input v-model="settings.testMode" type="checkbox" class="sr-only peer" style="touch-action: manipulation;">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 sm:h-9 sm:w-16 sm:after:h-7 sm:after:w-7 sm:after:top-[4px] sm:after:left-[4px]"></div>
            </label>
          </div>
  
          <div v-if="settings.testMode" class="w-full flex flex-col items-center">
            <div class="w-full flex justify-between mt-4">
              <span class="flex items-center font-medium text-slate-500">Animations</span>
              <label @click="playSound('switch')" class="relative inline-flex items-center cursor-pointer">
                <input v-model="settings.showAnimations" type="checkbox" class="sr-only peer" style="touch-action: manipulation;">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 sm:h-9 sm:w-16 sm:after:h-7 sm:after:w-7 sm:after:top-[4px] sm:after:left-[4px]"></div>
              </label>
            </div>
  
            <div class="w-full flex justify-between mt-4">
              <span class="flex items-center font-medium text-slate-500">Real Lives</span>
              <label @click="playSound('switch')" class="relative inline-flex items-center cursor-pointer">
                <input v-model="settings.realLives" type="checkbox" class="sr-only peer" style="touch-action: manipulation;">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 sm:h-9 sm:w-16 sm:after:h-7 sm:after:w-7 sm:after:top-[4px] sm:after:left-[4px]"></div>
              </label>
            </div>
  
            <span class="mt-4 flex items-center font-medium text-slate-500">Level</span>
            <div class="flex items-center mt-2">
              <button type="button" style="touch-action: manipulation" class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm" @click="changeLevel(-1)">Prev</button>
              <input type="number" :value="currentLevelId" @keyup="setLevel" class="w-20 text-2xl text-center text-green-500 bg-transparent focus:outline-none" />
              <button type="button" style="touch-action: manipulation" class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm" @click="changeLevel(1)">Next</button>
            </div>
  
            <span class="mt-4 flex items-center font-medium text-slate-500">Lives</span>
            <div class="flex items-center mt-2">
              <button type="button" style="touch-action: manipulation" class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm" @click="changeLives(-1)">Prev</button>
              <input type="number" :value="lives.count" @keyup="setLives" class="w-20 text-2xl text-center text-green-500 bg-transparent focus:outline-none" />
              <button type="button" style="touch-action: manipulation" class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm" @click="changeLives(1)">Next</button>
            </div>
  
            <button @click="canDelete = !canDelete" type="button" style="touch-action: manipulation" class="w-min whitespace-nowrap inline-flex justify-center rounded-md shadow-sm mt-10 px-4 py-1 bg-slate-200 text-base font-medium text-gray-700 border border-slate-600 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">{{ canDelete ? 'Disable Delete' : 'Enable Delete' }}</button>
            <button v-if="canDelete" @click="gameStore.resetProgress()" type="button" style="touch-action: manipulation" class="w-min whitespace-nowrap inline-flex justify-center rounded-md shadow-sm mt-2 px-4 py-1 bg-red-400 disabled:bg-red-200 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">Reset Progress</button>
          </div>
        </div>
  
        <button type="button" style="touch-action: manipulation" class="w-min whitespace-nowrap inline-flex justify-center rounded-md shadow-sm mt-4 px-10 pt-2 pb-1 bg-ll-orange text-base font-medium text-white focus:outline-none sm:mt-0 sm:w-auto sm:text-3xl sm:pt-3 lg:text-4xl" @click="$router.push('demo')">Play Tutorial</button>
  
        <button v-if="settings.testMode" type="button" style="touch-action: manipulation" class="w-min whitespace-nowrap inline-flex justify-center rounded-md shadow-sm mt-4 px-4 pt-2 pb-1 bg-ll-orange text-base font-medium text-white focus:outline-none sm:mt-0 sm:w-auto sm:text-sm" @click="$router.push('leveldata')">Go To Level Data</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game";
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Preferences } from "@capacitor/preferences";

export default defineComponent({
  name: 'Settings Modal',

  setup() {
    const gameStore = useGameStore()
    const { currentLevelId, settings, lives } = storeToRefs(gameStore)

    return { gameStore, currentLevelId, settings, lives }
  },

  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot
  },

  props: [
    'showSettingsModal',
    'hideSettingsModal'
  ],

  data() {
    return {
      canDelete: false
    }
  },

  watch: {
    settings: {
      async handler(newValue) {
        await Preferences.set({
          key: 'letterlock-settings',
          value: JSON.stringify(newValue)
        })
      },
      deep: true
    },

    hideSettingsModal(newValue) {
      if (newValue)
        playSound('swoosh')
    }
  },

  methods: {
    changeLevel(levelIncrement) {
      this.gameStore.setCurrentLevel(this.currentLevelId + levelIncrement)
    },

    setLevel(event) {
      if (!event.target.valueAsNumber)
        this.gameStore.setCurrentLevel(1)
      else
        this.gameStore.setCurrentLevel(event.target.valueAsNumber)
    },

    changeLives(lifeIncrement) {
      this.gameStore.$patch({ 
        lives: { 
          count: this.gameStore.lives.count + lifeIncrement,
          nextLifeTime: null 
        } 
      })
    },

    setLives(event) {
      this.gameStore.$patch({ 
        lives: { 
          count: event.target.valueAsNumber,
          nextLifeTime: Date.now() + 1800000 
        } 
      })
    }
  }
})
</script>

<style scoped>
.modal-padding {
  padding: 2rem 0;
}

.settings-margin {
  margin-top: 1rem;
}

@media (max-width: 320px) {
  .modal-padding {
    padding: 1rem 0;
  }

  .settings-margin {
    margin-top: 0rem;
  }
}
</style>