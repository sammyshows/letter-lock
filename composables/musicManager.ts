import { Howl, Howler } from 'howler';
import { useGameStore } from '@/stores/game';

class MusicManager {
  constructor() {
    this.tracks = {};
    this.currentTrack = null;
    this.gameStore = useGameStore();
  }

  loadTrack(name, src, volume = 1, playbackRate = 1) {
    console.log(`Loading track: ${name}, src: ${src}, volume: ${volume}, playbackRate: ${playbackRate}`);
    this.tracks[name] = {
      howl: new Howl({
        src: [src],
        volume: volume,
        rate: playbackRate,
        loop: false,
        html5: false,
        // onload: () => console.log(`${name} loaded successfully`),
        // onplay: () => console.log(`${name} started playing`),
        // onend: () => console.log(`${name} finished playing`),
        // onstop: () => console.log(`${name} stopped`),
        // onpause: () => console.log(`${name} paused`),
        // onfade: () => console.log(`${name} fading`),
        // onloaderror: (id, err) => console.error(`Error loading ${name}:`, err),
        // onplayerror: (id, err) => console.error(`Error playing ${name}:`, err),
      }),
      initialVolume: volume // Store the initial volume
    };
  }

  fadeOutTrack(track, duration = 500) {
    // console.log(`Fading out track over ${duration}ms`);
    return new Promise((resolve) => {
      if (!track) {
        // console.log('No track to fade out');
        return resolve();
      }

      const startVolume = track.initialVolume;

      track.howl.fade(track.howl.volume(), 0, duration);
      setTimeout(() => {
        track.howl.pause();
        track.howl.volume(startVolume); // Reset to initial volume
        track.howl.seek(0);
        // console.log('Track faded out and stopped');
        resolve();
      }, duration);
    });
  }

  fadeInTrack(track, duration = 500) {
    // console.log('Fading in track');
    return new Promise((resolve) => {
      if (!track) {
        // console.log('No track to fade in');
        return resolve();
      }

      const targetVolume = track.initialVolume;
      // console.log('Initial track volume:', targetVolume);
      track.howl.volume(0);
      track.howl.play();
      track.howl.fade(0, targetVolume, duration);
      // console.log('Finished fading in track to ' + targetVolume);
      setTimeout(resolve, duration);
    });
  }

  async playTrack(name = null, loop = true) {
    if (!this.gameStore.settings.music) {
      // console.log('Music is disabled in settings');
      return;
    }

    if (name === null) {
      if (this.currentTrack && !this.currentTrack.howl.playing()) {
        // console.log('Resuming the current track');
        this.currentTrack.howl.play();
        return;
      } else {
        // console.log('Current track is already playing or no track to resume');
        return;
      }
    }
  
    // console.log(`Playing track: ${name}, loop: ${loop}`);
    try {
      if (this.tracks[name] !== this.currentTrack) {
        // console.log('Switching to a different track');
        if (this.currentTrack) {
          // console.log('Fading out current track');
          this.fadeOutTrack(this.currentTrack);
        }
  
        this.currentTrack = this.tracks[name];
        this.currentTrack.howl.loop(loop);
        // console.log('Fading in new track');
        this.fadeInTrack(this.currentTrack);
        // console.log('New track playing');
      } else {
        if (!this.currentTrack.howl.playing()) {
          this.currentTrack.howl.play();
        } else {
          // console.log('Track is already playing');
        }
      }
    } catch (error) {
      console.error('Error playing track:', error);
    }
  }

  pauseTrack(reset = false) {
    // console.log('Pausing current track');
    try {
      if (this.currentTrack) {
        this.currentTrack.howl.pause();
        // console.log('Current track paused');

        if (reset) {
          this.currentTrack.howl.seek(0);
          this.currentTrack = null;
          // console.log('Current track reset');
        }
      }
    } catch (error) {
      console.error('Error pausing track:', error);
    }
  }
}

const musicManager = ref(null);

export const useMusicManager = () => {
  if (!musicManager.value) {
    musicManager.value = new MusicManager();
    musicManager.value.loadTrack('home', '/music/home.mp3', 0.15); // Home page music
    musicManager.value.loadTrack('game', '/music/game.mp3', 0.09); // Gameplay music
    musicManager.value.loadTrack('failed', '/music/failed.mp3', 0.1); // Failed modal music
  }

  return musicManager.value;
}
