export interface MonthlySeriesPoint {
  monthStart: string;
  label: string;
  billed: number;
  paid: number;
}

export interface GameBreakdownItem {
  gameId: string;
  gameName: string;
  billed: number;
  paid: number;
}

export type DrawStatus =
  | 'settled'
  | 'result_pending'
  | 'in_progress'
  | 'upcoming';

export interface TodayDrawItem {
  gameId: string;
  gameName: string;
  /** Wall-clock time from draw_schedules (e.g., "11:00"). Timezone-free. */
  drawTime: string;
  status: DrawStatus;
  winningNumber: string | null;
  cutoffMinutes: number;
}

export interface PendingPayouts {
  count: number;
  totalAmount: number;
}

export interface RankingItem {
  id: string;
  name: string;
  amount: number;
  ticketCount: number;
}

export interface DashboardSummary {
  billedToday: number;
  paidToday: number;
  profitToday: number;
  ticketsToday: number;
  averageTicketToday: number;

  billedYesterday: number;
  paidYesterday: number;
  profitYesterday: number;
  ticketsYesterday: number;

  weeklyBilled: number;
  weeklyBilledPrev: number;

  totalUsers: number;

  monthlySeries: MonthlySeriesPoint[];
  byGame: GameBreakdownItem[];
  todayDraws: TodayDrawItem[];
  pendingPayouts: PendingPayouts;
  topSellers: RankingItem[];
  topSalePoints: RankingItem[];
}
