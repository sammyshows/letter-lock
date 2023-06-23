import { Capacitor } from '@capacitor/core';
import { TextZoom } from "@capacitor/text-zoom";
import { StatusBar } from '@capacitor/status-bar';

export default defineNuxtPlugin( async () => {
    if (Capacitor.getPlatform() === 'ios')
        TextZoom.set({ value: 1.15 })

    // Display content under transparent status bar (Android only)
    if (Capacitor.getPlatform() === 'android')
        StatusBar.setOverlaysWebView({ overlay: true })

    if (Capacitor.getPlatform() !== 'web')
        await StatusBar.hide()

})