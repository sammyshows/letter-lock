import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useGameStore } from "@/stores/game";

export default defineNuxtPlugin(() => {
  return {
      provide: {
          vibrateLight: async () => {
            const gameStore = useGameStore()
            
            if (gameStore.settings.vibrations)
              await Haptics.impact({ style: ImpactStyle.Light })
          },

          vibrateMedium: async () => {
            const gameStore = useGameStore()

            if (gameStore.settings.vibrations)
              await Haptics.vibrate({ duration: 25 })
          }
      }
  }
})