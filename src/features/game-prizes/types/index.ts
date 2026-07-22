export interface EffectiveGamePrize {
  gameId: string;
  gameName: string;
  mainDefault: number | null;
  secondaryDefault: number | null;
  /** Effective value: override if present, otherwise game default. */
  mainMultiplier: number | null;
  secondaryMultiplier: number | null;
  overrideId: string | null;
  overrideMain: number | null;
  overrideSecondary: number | null;
  hasOverride: boolean;
}

export interface ListEffectiveGamePrizesResponse {
  items: EffectiveGamePrize[];
}

export interface UpsertGamePrizePayload {
  salePointId: string;
  gameId: string;
  mainMultiplier: number | null;
  secondaryMultiplier: number | null;
}
