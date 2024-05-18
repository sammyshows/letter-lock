class MusicManager {
  constructor() {
    this.tracks = {};
    this.currentTrack = null;
  }

  loadTrack(name, src, volume = 1, playbackRate = 1) {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.playbackRate = playbackRate;
    
    this.tracks[name] = audio;
  }

  fadeOut(track) {
    return new Promise((resolve) => {
      if (!track) return resolve();

      const defaultVolume = track.volume;

      const step = track.volume / (500 / 50);

      const fade = setInterval(() => {
        if (track.volume > 0) {
          track.volume = Math.max(0, track.volume - step);
        } else {
          clearInterval(fade);
          resolve();
          track.volume = defaultVolume;
        }
      }, 50);
    });
  }

  fadeIn(track) {
    return new Promise((resolve) => {
      if (!track) return resolve();

      const targetVolume = track.volume;
      track.volume = 0;
      const step = targetVolume / (400 / 50);

      const fade = setInterval(() => {
        if (track.volume < targetVolume) {
          track.volume = Math.min(targetVolume, track.volume + step);
        } else {
          clearInterval(fade);
          resolve();
        }
      }, 50);

      track.play();
    });
  }

  async playTrack(name, loop = true) {
    try {
      if (this.tracks[name] !== this.currentTrack) {
        if (this.currentTrack) {
          await this.fadeOut(this.currentTrack);
          this.currentTrack.pause();
          this.currentTrack.currentTime = 0;
        }

        this.currentTrack = this.tracks[name];
        this.currentTrack.loop = loop;
        await this.fadeIn(this.currentTrack);
      } else {
        await this.fadeIn(this.currentTrack);
      }
    } catch (error) {
      console.error(error);
    }
  }

  stopTrack() {
    try {
      if (this.currentTrack) {
        this.currentTrack.pause();
        this.currentTrack.currentTime = 0;
        this.currentTrack = null;
      }
    } catch (error) {
      console.error(error);
    }
  }

  setVolume(name, volume) {
    if (this.tracks[name]) {
      const validVolume = isNaN(volume) ? 0 : volume / 100;
      this.tracks[name].volume = validVolume;
    } else {
      console.warn(`Track ${name} not found!`);
    }
  }
}

const musicManager = ref(null);

export const useMusicManager = () => {
  if (!musicManager.value) {
    musicManager.value = new MusicManager();
    musicManager.value.loadTrack('home', '/music/home.mp3', 0.3); // Home page music
    musicManager.value.loadTrack('game', '/music/game.mp3', 0.3); // Gameplay music
    musicManager.value.loadTrack('failed', '/music/failed.mp3', 0.3); // Failed modal music
  }

  return musicManager.value;
}
