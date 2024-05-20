// class MusicManager {
//   constructor() {
//     this.tracks = {};
//     this.currentTrack = null;
//     this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     console.log('MusicManager initialized');
//   }

//   loadTrack(name, src, volume = 1, playbackRate = 1) {
//     console.log(`Loading track: ${name}, src: ${src}, volume: ${volume}, playbackRate: ${playbackRate}`);
//     return fetch(src)
//       .then(response => response.arrayBuffer())
//       .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
//       .then(audioBuffer => {
//         const track = {
//           audioBuffer,
//           volume,
//           playbackRate,
//           source: null,
//           gainNode: this.audioContext.createGain(),
//           isPlaying: false,
//         };
//         track.gainNode.gain.value = volume;

//         this.tracks[name] = track;
//         console.log(`${name} loaded successfully`);
//       })
//       .catch(error => {
//         console.error(`Error loading track ${name}:`, error);
//       });
//   }

//   createSource(track) {
//     if (!track.audioBuffer) {
//       throw new Error('Audio buffer is not available');
//     }
//     const source = this.audioContext.createBufferSource();
//     source.buffer = track.audioBuffer;
//     source.playbackRate.value = track.playbackRate;
//     source.loop = false;
//     source.connect(track.gainNode).connect(this.audioContext.destination);
//     return source;
//   }

//   fadeOutTrack(track, duration = 500) {
//     console.log(`Fading out track over ${duration}ms`);
//     return new Promise((resolve) => {
//       if (!track) {
//         console.log('No track to fade out');
//         return resolve();
//       }

//       const startVolume = track.gainNode.gain.value;

//       track.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration / 1000);
//       setTimeout(() => {
//         if (track.source) {
//           track.source.stop();
//           track.source.disconnect();
//           track.source = null;
//         }
//         track.gainNode.gain.value = startVolume;
//         track.isPlaying = false;
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

//       const targetVolume = track.volume;
//       console.log('Initial track volume:', track.gainNode.gain.value);
//       track.gainNode.gain.value = 0;
//       track.source = this.createSource(track);
//       track.source.start();
//       track.isPlaying = true;
//       track.gainNode.gain.linearRampToValueAtTime(targetVolume, this.audioContext.currentTime + duration / 1000);
//       console.log('Finished fading in track to ' + targetVolume);
//       setTimeout(resolve, duration);
//     });
//   }

//   async playTrack(name, loop = true) {
//     console.log(`Playing track: ${name}, loop: ${loop}`);
//     try {
//       if (!this.tracks[name]) {
//         throw new Error(`Track ${name} not found`);
//       }

//       if (this.tracks[name] !== this.currentTrack) {
//         console.log('Switching to a different track');
//         if (this.currentTrack) {
//           console.log('Fading out current track');
//           await this.fadeOutTrack(this.currentTrack);
//         }

//         this.currentTrack = this.tracks[name];
//         this.currentTrack.source = this.createSource(this.currentTrack);
//         this.currentTrack.source.loop = loop;
//         console.log('Fading in new track');
//         await this.fadeInTrack(this.currentTrack);
//         console.log('New track playing');
//       } else {
//         console.log('Resuming the same track');
//         if (!this.currentTrack.isPlaying) {
//           this.currentTrack.source = this.createSource(this.currentTrack);
//           this.currentTrack.source.loop = loop;
//           this.currentTrack.source.start();
//           this.currentTrack.isPlaying = true;
//         }
//       }
//     } catch (error) {
//       console.error('Error playing track:', error);
//     }
//   }

//   pauseTrack() {
//     console.log('Pausing current track');
//     try {
//       if (this.currentTrack && this.currentTrack.isPlaying) {
//         this.currentTrack.source.stop();
//         this.currentTrack.source.disconnect();
//         this.currentTrack.source = null;
//         this.currentTrack.isPlaying = false;
//         console.log('Current track paused');
//       }
//     } catch (error) {
//       console.error('Error pausing track:', error);
//     }
//   }

//   setVolume(name, volume) {
//     console.log(`Setting volume for track ${name} to ${volume}`);
//     if (this.tracks[name]) {
//       const validVolume = isNaN(volume) ? 0 : volume;
//       this.tracks[name].volume = validVolume;
//       this.tracks[name].gainNode.gain.value = validVolume;
//       console.log(`Volume for ${name} set to ${validVolume}`);
//     } else {
//       console.warn(`Track ${name} not found!`);
//     }
//   }
// }

// const musicManager = ref(null);

// export const useMusicManager = async () => {
//   // const audio = new Audio('/sounds/silent.mp3');
//   // audio.loop = true; // Enable looping
//   // audio.play();

  
  
//   if (!musicManager.value) {
//     musicManager.value = new MusicManager();
//     // musicManager.value.audioContext.onstatechange = () => console.log('audioContext.state:', musicManager.value.audioContext.state);
//     // await musicManager.value.audioContext.resume();
//     // await musicManager.value.audioContext.suspend();
//     // await musicManager.value.audioContext.resume();    await musicManager.value.audioContext.suspend();
//     // await musicManager.value.audioContext.resume();    await musicManager.value.audioContext.suspend();
//     // await musicManager.value.audioContext.resume();    await musicManager.value.audioContext.suspend();
//     // await musicManager.value.audioContext.resume();    await musicManager.value.audioContext.suspend();
//     // await musicManager.value.audioContext.resume();    await musicManager.value.audioContext.suspend();
//     // await musicManager.value.audioContext.resume();    await musicManager.value.audioContext.suspend();
//     // await musicManager.value.audioContext.resume();    await musicManager.value.audioContext.suspend();
//     // await musicManager.value.audioContext.suspend();await musicManager.value.audioContext.suspend();await musicManager.value.audioContext.suspend();await musicManager.value.audioContext.suspend();await musicManager.value.audioContext.suspend();await musicManager.value.audioContext.suspend();
//     // await musicManager.value.audioContext.resume();
//     // await musicManager.value.audioContext.resume();
//     // await musicManager.value.audioContext.resume();
//     // await musicManager.value.audioContext.resume();
//     // await musicManager.value.audioContext.resume();
//     // await musicManager.value.audioContext.resume();
//     musicManager.value.audioContext.createGain();
//     return Promise.all([
//       musicManager.value.loadTrack('home', '/music/home.mp3', 0.1), // Home page music
//       musicManager.value.loadTrack('game', '/music/game.mp3', 0.1), // Gameplay music
//       musicManager.value.loadTrack('failed', '/music/failed.mp3', 0.1), // Failed modal music
//     ]).then(() => {
//       console.log('All tracks loaded');
//       return musicManager.value;
//     });
//   }

//   return Promise.resolve(musicManager.value);
// }
