<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" @close="$emit('close', false)">
      <div class="h-full w-full flex items-center justify-center min-h-screen py-4 px-4 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div class="w-4/5 h-3/5 relative flex flex-col align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden bg-gray-800 shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div class="sm:flex sm:items-start">
              <div class="text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle as="h3" class="text-2xl leading-6 font-medium">Settings</DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-400">{{ message }}</p>
                </div>
              </div>
            </div>

            <div class="flex flex-col justify-between items-center grow">
              <div class="w-full flex flex-col items-center mt-10">
                <div class="w-full flex justify-between">
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-300">Test Mode</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input v-model="settings.testMode" type="checkbox" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div v-if="settings.testMode" class="w-full flex flex-col items-center mt-4">
                  <div class="w-full flex justify-between">
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-300">Animations</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="settings.showAnimations" type="checkbox" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <span class="mt-4 text-sm font-medium text-gray-900 dark:text-gray-300">Current Level</span>
                  <div class="flex items-center mt-2">
                    <button type="button" style="touch-action: manipulation" class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm" @click="changeLevel(-1)">Prev</button>
                    <input type="number" v-model="currentLevelId" class="w-20 text-2xl text-center text-green-300 bg-transparent focus:outline-none" />
                    <button type="button" style="touch-action: manipulation" class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm" @click="changeLevel(1)">Next</button>
                  </div>

                  <button type="button" style="touch-action: manipulation" class="w-min whitespace-nowrap inline-flex justify-center rounded-md shadow-sm mt-10 px-4 py-1 bg-red-400 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm" @click="gameStore.resetProgress()">Reset Progress</button>
                </div>
              </div>

              <button type="button" style="touch-action: manipulation" class="w-min whitespace-nowrap inline-flex justify-center rounded-md shadow-sm mt-4 px-4 py-1 bg-blue-500 text-base font-medium text-white hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm" @click="$router.push('leveldata')">Go To Level Data</button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game";
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Preferences } from "@capacitor/preferences";

export default defineComponent({
  name: 'Delete Confirmation',

  setup() {
    const gameStore = useGameStore()
    const { currentLevelId, settings } = storeToRefs(gameStore)

    return { gameStore, currentLevelId, settings }
  },

  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot
  },

  props: [
    'open', 'title', 'message', 'typeToConfirm'
  ],

  watch: {
    settings: {
      async handler(newValue) {
        await Preferences.set({
          key: 'letterlock-settings',
          value: JSON.stringify(newValue)
        })
      },
      deep: true
    }
  },

  methods: {
    changeLevel(levelIncrement) {
      this.gameStore.setCurrentLevel(this.currentLevelId + levelIncrement)
    }
  }
})
</script>