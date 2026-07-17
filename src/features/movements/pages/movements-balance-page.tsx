import { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  Calendar,
  Handshake,
  MapPin,
  Minus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import { useMovementsBalance } from '@/features/movements/hooks/use-movements-balance';
import { useSalePoints } from '@/features/sale-points/hooks/use-sale-points';
import { cn } from '@/shared/lib/cn';
import { formatCurrency } from '@/shared/lib/format';
import { Select } from '@/shared/ui/select';
import { TableLoadingOverlay } from '@/shared/ui/table-loading-overlay';

import type { MovementsBalanceRow } from '@/features/movements/types';

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function MovementsBalancePage() {
  const [salePointId, setSalePointId] = useState('');
  const [from, setFrom] = useState(isoDate(new Date()));
  const [to, setTo] = useState(isoDate(new Date()));

  const params = useMemo(
    () => ({
      salePointId: salePointId || undefined,
      from: from ? `${from}T00:00:00-06:00` : undefined,
      to: to ? `${to}T23:59:59-06:00` : undefined,
    }),
    [salePointId, from, to],
  );

  const { data, isLoading, isFetching, error } = useMovementsBalance(params);
  const items = data?.items ?? [];

  const { data: salePoints } = useSalePoints();

  const totals = useMemo(() => {
    let billed = 0;
    let paidPrize = 0;
    let deposits = 0;
    let withdrawals = 0;
    let expenses = 0;
    let net = 0;
    for (const r of items) {
      billed += r.billed;
      paidPrize += r.paidPrize;
      deposits += r.deposits;
      withdrawals += r.withdrawals;
      expenses += r.expenses;
      net += r.net;
    }
    return { billed, paidPrize, deposits, withdrawals, expenses, net };
  }, [items]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calculator className="size-5 text-muted-foreground" />
          <h1 className="text-2xl font-black tracking-tight">
            Cálculo de Movimientos
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Neto = <span className="font-semibold text-emerald-700">facturado</span> −{' '}
          <span className="font-semibold text-rose-700">premios</span> +{' '}
          <span className="font-semibold text-emerald-700">depósitos</span> −{' '}
          <span className="font-semibold text-rose-700">retiros</span> −{' '}
          <span className="font-semibold text-rose-700">gastos</span>
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          tone="emerald"
          icon={<ArrowUpRight className="size-4" />}
          label="Ingresos brutos"
          value={totals.billed + totals.deposits}
          hint={`Facturado ${formatCurrency(totals.billed)} + depósitos ${formatCurrency(totals.deposits)}`}
        />
        <StatCard
          tone="rose"
          icon={<ArrowDownRight className="size-4" />}
          label="Egresos"
          value={totals.paidPrize + totals.withdrawals + totals.expenses}
          hint={`Premios ${formatCurrency(totals.paidPrize)} · retiros ${formatCurrency(totals.withdrawals)} · gastos ${formatCurrency(totals.expenses)}`}
        />
        <StatCard
          tone={totals.net >= 0 ? 'indigo' : 'rose'}
          icon={
            totals.net >= 0 ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )
          }
          label="Balance neto"
          value={totals.net}
          hint={items.length > 0 ? `${items.length} sucursal(es)` : 'Sin data'}
        />
      </div>

      <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Sucursal">
            <Select
              value={salePointId}
              onChange={setSalePointId}
              leadingIcon={<MapPin className="size-4" />}
              placeholder="Todas"
              options={[
                { value: '', label: 'Todas las sucursales' },
                ...(salePoints?.map((sp) => ({
                  value: sp.id,
                  label: sp.name,
                })) ?? []),
              ]}
            />
          </Field>
          <Field label="Desde">
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="date"
                value={from}
                max={to}
                onChange={(e) => setFrom(e.target.value)}
                className={cn(inputClass, 'pl-9')}
              />
            </div>
          </Field>
          <Field label="Hasta">
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="date"
                value={to}
                min={from}
                onChange={(e) => setTo(e.target.value)}
                className={cn(inputClass, 'pl-9')}
              />
            </div>
          </Field>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          No se pudo cargar el reporte: {error.message}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="relative overflow-x-auto">
          <table
            className={cn(
              'min-w-full text-sm transition-opacity',
              isFetching && items.length > 0 && 'opacity-50',
            )}
          >
            <thead className="bg-slate-50/70 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Sucursal</th>
                <th className="px-6 py-3">Socio</th>
                <th className="px-6 py-3 text-right">Facturado</th>
                <th className="px-6 py-3 text-right">Premios</th>
                <th className="px-6 py-3 text-right">Depósitos</th>
                <th className="px-6 py-3 text-right">Retiros</th>
                <th className="px-6 py-3 text-right">Gastos</th>
                <th className="px-6 py-3 text-right">Neto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading && items.length === 0 ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-14 text-center text-sm text-muted-foreground"
                  >
                    Sin movimientos ni ventas en este rango.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <BalanceRow key={row.salePointId} row={row} />
                ))
              )}
            </tbody>
            {items.length > 0 && (
              <tfoot className="bg-slate-50/60 text-sm font-bold">
                <tr>
                  <td className="px-6 py-3.5 text-foreground" colSpan={2}>
                    Totales
                  </td>
                  <td className="px-6 py-3.5 text-right tabular-nums text-emerald-700">
                    {formatCurrency(totals.billed)}
                  </td>
                  <td className="px-6 py-3.5 text-right tabular-nums text-rose-700">
                    {formatCurrency(totals.paidPrize)}
                  </td>
                  <td className="px-6 py-3.5 text-right tabular-nums text-emerald-700">
                    {formatCurrency(totals.deposits)}
                  </td>
                  <td className="px-6 py-3.5 text-right tabular-nums text-rose-700">
                    {formatCurrency(totals.withdrawals)}
                  </td>
                  <td className="px-6 py-3.5 text-right tabular-nums text-rose-700">
                    {formatCurrency(totals.expenses)}
                  </td>
                  <td
                    className={cn(
                      'px-6 py-3.5 text-right tabular-nums text-base',
                      totals.net >= 0 ? 'text-indigo-700' : 'text-rose-700',
                    )}
                  >
                    {formatCurrency(totals.net)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>

          <TableLoadingOverlay show={isFetching && items.length > 0} />
        </div>
      </div>
    </div>
  );
}

function BalanceRow({ row }: { row: MovementsBalanceRow }) {
  return (
    <tr className="hover:bg-slate-50/60">
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
            <MapPin className="size-4" strokeWidth={2.4} />
          </span>
          <span className="font-semibold text-foreground">
            {row.salePointName}
          </span>
        </div>
      </td>
      <td className="px-6 py-3.5">
        {row.ownerPartnerName ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
            <Handshake className="size-3.5 text-indigo-600" />
            {row.ownerPartnerName}
          </span>
        ) : (
          <Empty />
        )}
      </td>
      <td className="px-6 py-3.5 text-right tabular-nums text-emerald-700">
        {row.billed > 0 ? formatCurrency(row.billed) : <Empty />}
      </td>
      <td className="px-6 py-3.5 text-right tabular-nums text-rose-700">
        {row.paidPrize > 0 ? formatCurrency(row.paidPrize) : <Empty />}
      </td>
      <td className="px-6 py-3.5 text-right tabular-nums text-emerald-700">
        {row.deposits > 0 ? formatCurrency(row.deposits) : <Empty />}
      </td>
      <td className="px-6 py-3.5 text-right tabular-nums text-rose-700">
        {row.withdrawals > 0 ? formatCurrency(row.withdrawals) : <Empty />}
      </td>
      <td className="px-6 py-3.5 text-right tabular-nums text-rose-700">
        {row.expenses > 0 ? formatCurrency(row.expenses) : <Empty />}
      </td>
      <td
        className={cn(
          'px-6 py-3.5 text-right tabular-nums font-bold',
          row.net >= 0 ? 'text-indigo-700' : 'text-rose-700',
        )}
      >
        {formatCurrency(row.net)}
      </td>
    </tr>
  );
}

function StatCard({
  tone,
  icon,
  label,
  value,
  hint,
}: {
  tone: 'emerald' | 'rose' | 'indigo';
  icon: React.ReactNode;
  label: string;
  value: number;
  hint: string;
}) {
  const toneClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-700 ring-rose-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-700 ring-indigo-500/20',
  }[tone];
  const valueClass = {
    emerald: 'text-emerald-800',
    rose: 'text-rose-800',
    indigo: 'text-indigo-800',
  }[tone];
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'inline-flex size-8 items-center justify-center rounded-lg ring-1 ring-inset',
            toneClasses,
          )}
        >
          {icon}
        </span>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className={cn('mt-2 text-2xl font-black tabular-nums', valueClass)}>
        {formatCurrency(value)}
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground/80">{hint}</div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        </td>
      ))}
    </tr>
  );
}

function Empty() {
  return (
    <span className="inline-flex items-center text-muted-foreground/40">
      <Minus className="size-3" />
    </span>
  );
}

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60';

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1.5">
      <span className="block text-xs font-semibold text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
