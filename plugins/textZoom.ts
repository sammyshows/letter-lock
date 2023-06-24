import { Capacitor } from '@capacitor/core';
import { TextZoom } from "@capacitor/text-zoom";
import { configureStatusBar } from '~/helpers/statusBar';

export default defineNuxtPlugin( async () => {
    if (Capacitor.getPlatform() === 'ios')
        TextZoom.set({ value: 1.15 })

    // Display content under transparent status bar (Android only)

    console.log(Capacitor.getPlatform())
    if (Capacitor.getPlatform() !== 'web')
        configureStatusBar()

})