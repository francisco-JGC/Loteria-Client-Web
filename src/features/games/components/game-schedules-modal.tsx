import { CalendarClock, Loader2 } from 'lucide-react';

import { useGameSchedules } from '@/features/games/hooks/use-games';
import { cn } from '@/shared/lib/cn';
import { Modal } from '@/shared/ui/modal';

import type { DrawSchedule, Game } from '@/features/games/types';

interface Props {
  game: Game | null;
  onClose: () => void;
}

/** ISO-index labels aligned with PG EXTRACT(DOW) — Sunday = 0. */
const DAYS_OF_WEEK = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

export function GameSchedulesModal({ game, onClose }: Props) {
  const { data, isLoading, error } = useGameSchedules(game?.id ?? null);

  if (!game) return null;

  return (
    <Modal
      open={game !== null}
      onClose={onClose}
      title={`Horarios · ${game.name}`}
      description="Sorteos programados para este juego."
      size="max-w-2xl"
    >
      {isLoading && (
        <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Cargando horarios…
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {!isLoading && !error && (
        <SchedulesTable schedules={data ?? []} />
      )}
    </Modal>
  );
}

function SchedulesTable({ schedules }: { schedules: DrawSchedule[] }) {
  if (schedules.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
        <CalendarClock className="size-8 text-muted-foreground/40" />
        Este juego no tiene horarios configurados aún.
      </div>
    );
  }

  const sorted = [...schedules].sort((a, b) => {
    // Daily (null) primero, luego por día de semana, luego por hora
    const da = a.dayOfWeek ?? -1;
    const db = b.dayOfWeek ?? -1;
    if (da !== db) return da - db;
    return a.drawTime.localeCompare(b.drawTime);
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50/70 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5">Día</th>
            <th className="px-4 py-2.5">Hora</th>
            <th className="px-4 py-2.5 text-right">Cutoff</th>
            <th className="px-4 py-2.5">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {sorted.map((s) => (
            <tr key={s.id}>
              <td className="px-4 py-2.5">
                {s.dayOfWeek === null ? (
                  <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-500/20">
                    Todos los días
                  </span>
                ) : (
                  DAYS_OF_WEEK[s.dayOfWeek] ?? `Día ${s.dayOfWeek}`
                )}
              </td>
              <td className="px-4 py-2.5 font-mono text-foreground">
                {formatWallClock(s.drawTime)}
              </td>
              <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                {s.cutoffMinutes} min
              </td>
              <td className="px-4 py-2.5">
                <span
                  className={cn(
                    'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset',
                    s.isActive
                      ? 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20'
                      : 'bg-slate-100 text-slate-600 ring-slate-200',
                  )}
                >
                  {s.isActive ? 'Activo' : 'Pausado'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatWallClock(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const suffix = h >= 12 ? 'p. m.' : 'a. m.';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')} ${suffix}`;
}
