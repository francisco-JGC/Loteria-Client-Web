import { http } from '@/shared/api/http';

import type { DrawSchedule, Game } from '@/features/games/types';

export async function listGames(onlyActive = false): Promise<Game[]> {
  const { data } = await http.get<Game[]>('/games', {
    params: { onlyActive: onlyActive || undefined },
  });
  return data;
}

export async function toggleGame(
  id: string,
  active: boolean,
): Promise<Game> {
  const { data } = await http.patch<Game>(`/games/${id}/toggle`, { active });
  return data;
}

export async function listSchedulesByGame(
  gameId: string,
): Promise<DrawSchedule[]> {
  const { data } = await http.get<DrawSchedule[]>(
    `/games/${gameId}/schedules`,
  );
  return data;
}
