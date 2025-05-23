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
  bestRemainingMoves: number,
  attemptTally: number,
  successTally: number,
  replayTally: number,
  extraMovesUsed: boolean
}

export interface IndexedLevelHistoryData {
  [index: number]: LevelHistoryData;
}



// ===========================================
// ================== ADS ====================
// ===========================================

export interface Reward {
  type: string,
  quantity: number
}

export interface SearchAdsAttributionPlugin {
  checkAdAttribution(): Promise<{
    campaignId: string;
    attribution: boolean;
    adGroupId: string;
    adGroupName: string;
    keyword: string;
  }>;
}

export interface FirebaseAnalyticsPlugin {
  setUserId(options: { userId: string }): Promise<void>;
  setUserProperty(options: { name: string; value: string }): Promise<void>;
  logEvent(options: { name: string; params: { [key: string]: any } }): Promise<void>;
}

