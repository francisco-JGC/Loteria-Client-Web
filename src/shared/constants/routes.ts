/**
 * Central route registry. Every navigation goes through here so we avoid
 * magic strings scattered across pages and hooks.
 */
export const APP_ROUTES = {
  root: '/',
  login: '/login',
  dashboard: '/dashboard',
  games: {
    list: '/games',
    detail: (id: string) => `/games/${id}`,
  },
  schedules: '/schedules',
  drawResults: '/draw-results',
  salePoints: '/sale-points',
  users: '/users',
  tickets: {
    list: '/tickets',
    detail: (id: string) => `/tickets/${id}`,
  },
} as const;
