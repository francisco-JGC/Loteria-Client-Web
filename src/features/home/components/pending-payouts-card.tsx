import { AlertCircle, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/shared/constants/routes';
import { formatCurrency } from '@/shared/lib/format';

import type {
  PendingPayoutPreview,
  PendingPayouts,
} from '@/features/home/types';

interface Props {
  data: PendingPayouts;
}

export function PendingPayoutsCard({ data }: Props) {
  const hasPending = data.count > 0;

  return (
    <section className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Trophy className="size-4" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em]">
              Ganadores pendientes
            </p>
          </div>
          <p className="mt-3 text-3xl font-black leading-none tracking-tight">
            {formatCurrency(data.totalAmount)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {hasPending ? (
              <>
                <span className="font-semibold text-foreground">
                  {data.count}
                </span>{' '}
                {data.count === 1 ? 'boleto' : 'boletos'} sin cobrar
              </>
            ) : (
              'Todos los premios están al día'
            )}
          </p>
        </div>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/12 ring-1 ring-inset ring-amber-500/20">
          <AlertCircle className="size-5 text-amber-600" strokeWidth={2.4} />
        </div>
      </div>

      {hasPending && data.items.length > 0 && (
        <ul className="relative z-10 mt-5 space-y-1.5">
          {data.items.map((item) => (
            <PendingRow key={item.ticketId} item={item} />
          ))}
        </ul>
      )}

      {hasPending && (
        <Link
          to={APP_ROUTES.winners}
          className="relative z-10 mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold text-amber-700 hover:text-amber-800"
        >
          Ver detalle
          <span aria-hidden>→</span>
        </Link>
      )}

      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-amber-500/10 opacity-40 blur-3xl" />
    </section>
  );
}

function PendingRow({ item }: { item: PendingPayoutPreview }) {
  const time = new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(item.drawAt));

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/15 bg-amber-500/5 px-3 py-2">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-mono font-bold text-foreground">
            #{item.folio}
          </span>
          <span className="text-muted-foreground/50">·</span>
          <span className="truncate font-semibold text-foreground">
            {item.gameName}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {time}
          {item.client && (
            <>
              <span className="mx-1 text-muted-foreground/40">·</span>
              {item.client}
            </>
          )}
        </p>
      </div>
      <span className="shrink-0 text-sm font-black tabular-nums text-amber-800">
        {formatCurrency(item.totalPrize)}
      </span>
    </li>
  );
}
