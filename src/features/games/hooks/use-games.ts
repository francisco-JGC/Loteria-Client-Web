import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  listGames,
  listSchedulesByGame,
  toggleGame,
} from '@/features/games/api/games.api';
import { toApiError } from '@/shared/api/error-mapper';

import type { DrawSchedule, Game } from '@/features/games/types';
import type { ApiError } from '@/shared/types/api';

export const gamesQueryKeys = {
  all: ['games'] as const,
  list: (onlyActive: boolean) =>
    [...gamesQueryKeys.all, 'list', { onlyActive }] as const,
  schedules: (gameId: string) =>
    [...gamesQueryKeys.all, 'schedules', gameId] as const,
};

export function useGames(onlyActive = false) {
  return useQuery<Game[], ApiError>({
    queryKey: gamesQueryKeys.list(onlyActive),
    queryFn: async () => {
      try {
        return await listGames(onlyActive);
      } catch (error) {
        throw toApiError(error);
      }
    },
    // Games catalog cambia rara vez; con 5 min alcanza y evita flicker al
    // volver a la página.
    staleTime: 5 * 60 * 1000,
  });
}

export function useToggleGame() {
  const qc = useQueryClient();
  return useMutation<Game, ApiError, { id: string; active: boolean }>({
    mutationFn: async ({ id, active }) => {
      try {
        return await toggleGame(id, active);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: (game) => {
      toast.success(
        game.isActive
          ? `Juego "${game.name}" activado`
          : `Juego "${game.name}" desactivado`,
      );
      qc.invalidateQueries({ queryKey: gamesQueryKeys.all });
    },
    onError: (error) => {
      toast.error('No se pudo actualizar el juego', {
        description: error.message,
      });
    },
  });
}

export function useGameSchedules(gameId: string | null) {
  return useQuery<DrawSchedule[], ApiError>({
    queryKey: gamesQueryKeys.schedules(gameId ?? ''),
    enabled: gameId !== null,
    queryFn: async () => {
      try {
        return await listSchedulesByGame(gameId!);
      } catch (error) {
        throw toApiError(error);
      }
    },
  });
}
