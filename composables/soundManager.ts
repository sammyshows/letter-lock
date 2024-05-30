import { Howl } from 'howler';
import { useGameStore } from '@/stores/game';

class SoundManager {
  constructor() {
    this.sounds = {};
    this.gameStore = useGameStore();
  }

  loadSound(name, src, volume = 1, playbackRate = 1) {
    this.sounds[name] = new Howl({
      src: [src],
      volume: volume,
      rate: playbackRate
    });
  }

  playSound(name) {
    if (!this.gameStore.settings.soundEffects) {
      console.log('Sound effects are disabled in settings');
      return;
    }

    if (this.sounds[name]) {
      this.sounds[name].play();
    } else {
      console.warn(`Sound ${name} not found!`);
    }
  }

  stopSound(name) {
    if (this.sounds[name]) {
      this.sounds[name].stop();
    } else {
      console.warn(`Sound ${name} not found!`);
    }
  }
}

const soundManager = ref(null);

export const useSoundManager = () => {
  if (!soundManager.value) {
    soundManager.value = new SoundManager();
    soundManager.value.loadSound('boom', '/sounds/boom.mp3', 0.25, 1);
    soundManager.value.loadSound('click', '/sounds/click.wav', 0.8);
    soundManager.value.loadSound('switch', '/sounds/switch.wav', 0.1);
    soundManager.value.loadSound('metalDong', '/sounds/metal-dong.mp3', 0.15, 4);
    soundManager.value.loadSound('tileSwap', '/sounds/tile-swap.flac', 0.08);
    soundManager.value.loadSound('swoosh', '/sounds/swoosh.flac', 0.06);
    soundManager.value.loadSound('whoosh', '/sounds/whoosh.wav', 0.05);
    soundManager.value.loadSound('wordFormed', '/sounds/word-formed.wav', 0.15, 1.75);
    soundManager.value.loadSound('levelComplete', '/sounds/level-complete.mp3', 0.08);
  }

  return soundManager.value;
};
