export const playTrack = async (track) => {
  const musicManager = await useMusicManager()
  musicManager.playTrack(track);
}

export const pauseTrack = async (resetTrack) => {
  const musicManager = await useMusicManager()
  musicManager.pauseTrack(resetTrack);
}