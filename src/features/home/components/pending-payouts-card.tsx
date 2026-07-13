import { AlertCircle, Trophy } from 'lucide-react';

import { formatCurrency } from '@/shared/lib/format';
import { APP_ROUTES } from '@/shared/constants/routes';
import { Link } from 'react-router-dom';

import type { PendingPayouts } from '@/features/home/types';

interface Props {
  data: PendingPayouts;
}

export function PendingPayoutsCard({ data }: Props) {
  const hasPending = data.count > 0;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
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

      {hasPending && (
        <Link
          to={APP_ROUTES.winners}
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-800"
        >
          Ver detalle
          <span aria-hidden>→</span>
        </Link>
      )}

      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-amber-500/10 opacity-40 blur-3xl" />
    </section>
  );
}
