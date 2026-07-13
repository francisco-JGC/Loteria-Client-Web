export type GameType =
  | 'regular'
  | 'date'
  | 'three_digit'
  | 'four_digit'
  | 'multi_sorteo';

export interface Game {
  id: string;
  slug: string;
  name: string;
  type: GameType;
  mainMultiplier: number | null;
  secondaryMultiplier: number | null;
  imagePath: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DrawSchedule {
  id: string;
  gameId: string;
  /** 0 = Sunday .. 6 = Saturday, or `null` for daily. */
  dayOfWeek: number | null;
  /** "HH:MM" wall clock in `America/Managua`. */
  drawTime: string;
  cutoffMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
