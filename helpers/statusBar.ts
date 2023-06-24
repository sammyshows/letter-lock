import { Capacitor } from '@capacitor/core';
import { StatusBar } from "@capacitor/status-bar";

export const configureStatusBar = async () => {
    // Display content under transparent status bar (Android only)
    if (Capacitor.getPlatform() === 'android')
        StatusBar.setOverlaysWebView({ overlay: true })

        console.log(Capacitor.getPlatform())
    if (Capacitor.getPlatform() !== 'web')
        await StatusBar.hide()
}