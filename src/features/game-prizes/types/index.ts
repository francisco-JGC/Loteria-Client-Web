export interface EffectiveGamePrize {
  gameId: string;
  gameName: string;
  exactDefault: number | null;
  easyDefault: number | null;
  /** Effective value: override if present, otherwise game default. */
  exactMultiplier: number | null;
  easyMultiplier: number | null;
  overrideId: string | null;
  overrideExact: number | null;
  overrideEasy: number | null;
  hasOverride: boolean;
}

export interface ListEffectiveGamePrizesResponse {
  items: EffectiveGamePrize[];
}

export interface UpsertGamePrizePayload {
  salePointId: string;
  gameId: string;
  exactMultiplier: number | null;
  easyMultiplier: number | null;
}
