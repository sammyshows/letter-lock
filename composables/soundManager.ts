class SoundManager {
  constructor() {
    this.sounds = {};
    this.poolSize = 2; // Adjust the pool size based on your needs
  }

  loadSound(name, src, volume = 1, playbackRate = 1) {
    this.sounds[name] = {
      instances: Array.from({ length: this.poolSize }, () => {
        const audio = new Audio(src);
        audio.volume = volume;
        audio.playbackRate = playbackRate;
        return audio;
      }),
      currentIndex: 0,
    };
  }

  playSound(name) {
    if (this.sounds[name]) {
      const sound = this.sounds[name];
      const audio = sound.instances[sound.currentIndex];
      audio.currentTime = 0;
      audio.play();

      sound.currentIndex = (sound.currentIndex + 1) % this.poolSize;
    } else {
      console.warn(`Sound ${name} not found!`);
    }
  }

  stopSound(name) {
    if (this.sounds[name]) {
      this.sounds[name].instances.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    } else {
      console.warn(`Sound ${name} not found!`);
    }
  }
}

const soundManager = ref(null);

export const useSoundManager = () => {
  if (!soundManager.value) {
    soundManager.value = new SoundManager();
    soundManager.value.loadSound('click', '/sounds/click.wav');
    soundManager.value.loadSound('switch', '/sounds/switch.wav', 0.2);
    soundManager.value.loadSound('crickets', '/sounds/crickets.wav');
    soundManager.value.loadSound('gameOver', '/sounds/game-over.wav');
    soundManager.value.loadSound('item', '/sounds/item.wav');
    soundManager.value.loadSound('levelUp', '/sounds/level-up.wav');
    soundManager.value.loadSound('menu', '/sounds/menu.wav');
    soundManager.value.loadSound('newLife', '/sounds/new-life.mp3');
    soundManager.value.loadSound('plop', '/sounds/plop.wav');
    soundManager.value.loadSound('win', '/sounds/win.wav');
    soundManager.value.loadSound('won', '/sounds/won.wav');
    soundManager.value.loadSound('tileSwap', '/sounds/tile-swap.flac', 0.1);
    soundManager.value.loadSound('swoosh', '/sounds/swoosh.flac', 0.1);
    soundManager.value.loadSound('wordFormed', '/sounds/word-formed.wav', 0.5, 1.75);
    soundManager.value.loadSound('levelComplete', '/sounds/level-complete.mp3', 0.3);
  }

  return soundManager.value;
}
