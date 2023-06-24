import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import { useGameStore } from "@/stores/game";

export default defineNuxtPlugin(() => {
  return {
      provide: {
          vibrateLight: async () => {
            const gameStore = useGameStore()
            
            if (gameStore.settings.vibrations) {
              if (Capacitor.getPlatform() === 'ios') {
                await Haptics.impact({ style: ImpactStyle.Medium }) // Different setting for iOS
              } else if (Capacitor.getPlatform() === 'android') {
                await Haptics.impact({ style: ImpactStyle.Light })
              }
            }
          },

          vibrateMedium: async () => {
            const gameStore = useGameStore()

            if (gameStore.settings.vibrations) {
              if (Capacitor.getPlatform() === 'ios') {
                await Haptics.impact({ style: ImpactStyle.Heavy }) // Different setting for iOS
              } else if (Capacitor.getPlatform() === 'android') {
                await Haptics.vibrate({ duration: 25 }) // Different setting for Android
              }
            }
          }
      }
  }
});
