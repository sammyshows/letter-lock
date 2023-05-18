export interface Tile {
  id: number;
  isPartOfWord: boolean;
  letter: string;
}

export interface LevelData {
  gridSize: number,
  maxMoves: number,
  par: number,
  tiles: Tile[],
  validWords: string[]
}

export interface IndexedLevelData {
  [index: number]: LevelData;
}

export interface LevelHistoryData {
  bestMoves: number
}

export interface IndexedLevelHistoryData {
  [index: number]: LevelHistoryData;
}