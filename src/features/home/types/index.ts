export interface MonthlySeriesPoint {
  monthStart: string;
  label: string;
  billed: number;
  paid: number;
}

export interface DashboardSummary {
  billedToday: number;
  paidToday: number;
  weeklyBilled: number;
  totalUsers: number;
  monthlySeries: MonthlySeriesPoint[];
}
