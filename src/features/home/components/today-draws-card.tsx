import { CalendarClock } from 'lucide-react';

import { cn } from '@/shared/lib/cn';

import type { DrawStatus, TodayDrawItem } from '@/features/home/types';

const STATUS_STYLE: Record<
  DrawStatus,
  { label: string; dot: string; chip: string }
> = {
  settled: {
    label: 'Registrado',
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20',
  },
  result_pending: {
    label: 'Falta resultado',
    dot: 'bg-amber-500',
    chip: 'bg-amber-500/10 text-amber-700 ring-amber-500/20',
  },
  in_progress: {
    label: 'En sorteo',
    dot: 'bg-indigo-500 animate-pulse',
    chip: 'bg-indigo-500/10 text-indigo-700 ring-indigo-500/20',
  },
  upcoming: {
    label: 'Próximo',
    dot: 'bg-slate-400',
    chip: 'bg-slate-100 text-slate-700 ring-slate-200',
  },
};

interface Props {
  items: TodayDrawItem[];
}

export function TodayDrawsCard({ items }: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <header className="flex items-center justify-between border-b border-border/70 px-6 py-4">
        <div className="flex items-center gap-2">
          <CalendarClock className="size-4 text-muted-foreground" />
          <h3 className="text-lg font-bold tracking-tight">Sorteos de hoy</h3>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {items.length} {items.length === 1 ? 'sorteo' : 'sorteos'}
        </span>
      </header>

      {items.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-muted-foreground">
          Hoy no hay sorteos programados.
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {items.map((item, idx) => (
            <DrawRow key={`${item.gameId}-${item.drawTime}-${idx}`} item={item} />
          ))}
        </ul>
      )}
    </section>
  );
}

function formatWallClock(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const suffix = h >= 12 ? 'p. m.' : 'a. m.';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${suffix}`;
}

function DrawRow({ item }: { item: TodayDrawItem }) {
  const style = STATUS_STYLE[item.status];
  const time = formatWallClock(item.drawTime);

  return (
    <li className="flex items-center justify-between gap-4 px-6 py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden
          className={cn('size-2 shrink-0 rounded-full', style.dot)}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {item.gameName}
          </p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {item.winningNumber && (
          <span className="rounded-md bg-slate-900 px-2 py-1 font-mono text-xs font-bold text-white">
            {item.winningNumber}
          </span>
        )}
        <span
          className={cn(
            'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset',
            style.chip,
          )}
        >
          {style.label}
        </span>
      </div>
    </li>
  );
}
