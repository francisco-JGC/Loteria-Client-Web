import axios from 'axios';

import { env } from '@/shared/constants/env';
import { APP_ROUTES } from '@/shared/constants/routes';
import { forceLogout, getAuthToken } from '@/features/auth/store/auth.store';

/**
 * Single axios instance shared across the app.
 *
 * - Request interceptor attaches the JWT from the auth store.
 * - Response interceptor clears the session on 401 and redirects to /login.
 *
 * Direct usage stays inside each feature's api folder. Components and
 * hooks call the api functions there, never this client.
 */
export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
});

http.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      forceLogout();
      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== APP_ROUTES.login
      ) {
        window.location.assign(APP_ROUTES.login);
      }
    }
    return Promise.reject(error);
  },
);
