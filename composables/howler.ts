// import { Howl, Howler } from 'howler';

// class MusicManager {
//   constructor() {
//     this.tracks = {};
//     this.currentTrack = null;
//     console.log('MusicManager initialized');
//   }

//   loadTrack(name, src, volume = 1, playbackRate = 1) {
//     console.log(`Loading track: ${name}, src: ${src}, volume: ${volume}, playbackRate: ${playbackRate}`);
//     this.tracks[name] = new Howl({
//       src: [src],
//       volume: volume,
//       rate: playbackRate,
//       loop: false,
//       html5: false,
//       onload: () => console.log(`${name} loaded successfully`),
//       onplay: () => console.log(`${name} started playing`),
//       onend: () => console.log(`${name} finished playing`),
//       onstop: () => console.log(`${name} stopped`),
//       onpause: () => console.log(`${name} paused`),
//       onfade: () => console.log(`${name} fading`),
//       onloaderror: (id, err) => console.error(`Error loading ${name}:`, err),
//       onplayerror: (id, err) => console.error(`Error playing ${name}:`, err),
//     });
//   }

//   fadeOutTrack(track, duration = 500) {
//     console.log(`Fading out track over ${duration}ms`);
//     return new Promise((resolve) => {
//       if (!track) {
//         console.log('No track to fade out');
//         return resolve();
//       }

//       const startVolume = track.volume();

//       track.fade(track.volume(), 0, duration);
//       setTimeout(() => {
//         track.pause();
//         track.volume(startVolume);
//         track.seek(0);
//         console.log('Track faded out and stopped');
//         resolve();
//       }, duration);
//     });
//   }

//   fadeInTrack(track, duration = 500) {
//     console.log('Fading in track');
//     return new Promise((resolve) => {
//       if (!track) {
//         console.log('No track to fade in');
//         return resolve();
//       }

//       const targetVolume = track.volume();
//       console.log('Initial track volume:', track.volume());
//       track.volume(0);
//       track.play();
//       track.fade(0, targetVolume, duration);
//       console.log('Finished fading in track to ' + targetVolume);
//       setTimeout(resolve, duration);
//     });
//   }

//   async playTrack(name, loop = true) {
//     console.log(`Playing track: ${name}, loop: ${loop}`);
//     try {
//       if (this.tracks[name] !== this.currentTrack) {
//         console.log('Switching to a different track');
//         if (this.currentTrack) {
//           console.log('Fading out current track');
//           await this.fadeOutTrack(this.currentTrack);
//         }

//         this.currentTrack = this.tracks[name];
//         this.currentTrack.loop(loop);
//         console.log('Fading in new track');
//         await this.fadeInTrack(this.currentTrack);
//         console.log('New track playing');
//       } else {
//         console.log('Resuming the same track');
//         this.currentTrack.play(); // Ensure it is playing if it's the same track
//       }
//     } catch (error) {
//       console.error('Error playing track:', error);
//     }
//   }

//   pauseTrack() {
//     console.log('Pausing current track');
//     try {
//       if (this.currentTrack) {
//         this.currentTrack.pause();
//         console.log('Current track paused');
//       }
//     } catch (error) {
//       console.error('Error pausing track:', error);
//     }
//   }

//   setVolume(name, volume) {
//     console.log(`Setting volume for track ${name} to ${volume}`);
//     if (this.tracks[name]) {
//       const validVolume = isNaN(volume) ? 0 : volume / 100;
//       this.tracks[name].volume(validVolume);
//       console.log(`Volume for ${name} set to ${validVolume}`);
//     } else {
//       console.warn(`Track ${name} not found!`);
//     }
//   }
// }

// const musicManager = ref(null);

// export const useMusicManager = () => {
//   if (!musicManager.value) {
//     musicManager.value = new MusicManager();
//     musicManager.value.loadTrack('home', '/music/home.mp3', 0.1); // Home page music
//     musicManager.value.loadTrack('game', '/music/game.mp3', 0.1); // Gameplay music
//     musicManager.value.loadTrack('failed', '/music/failed.mp3', 0.1); // Failed modal music
//   }

//   return musicManager.value;
// }
