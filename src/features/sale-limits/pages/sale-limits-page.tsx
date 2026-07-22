import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, Dices, Loader2, MapPin, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

import { useGames } from '@/features/games/hooks/use-games';
import { upsertSaleLimit } from '@/features/sale-limits/api/sale-limits.api';
import {
  useDeleteSaleLimit,
  useSaleLimits,
  useUpsertSaleLimit,
} from '@/features/sale-limits/hooks/use-sale-limits';
import { useSalePoints } from '@/features/sale-points/hooks/use-sale-points';
import { cn } from '@/shared/lib/cn';
import { formatCurrency } from '@/shared/lib/format';
import { Select } from '@/shared/ui/select';

import type { SaleLimit } from '@/features/sale-limits/types';

/**
 * Redesigned for 50+ sucursales: instead of a wide grid, the operator
 * picks ONE sucursal and edits its per-game limits in a compact vertical
 * list. A "Copiar de otra sucursal" bulk action replicates config between
 * similar sucursales in one click.
 */
export function SaleLimitsPage() {
  const [salePointId, setSalePointId] = useState('');

  const { data: games } = useGames();
  const { data: salePoints, isLoading: loadingSalePoints } = useSalePoints();
  const { data: limits, isLoading: loadingLimits, error } = useSaleLimits();

  const gamesActive = useMemo(
    () => (games ?? []).filter((g) => g.isActive),
    [games],
  );
  const salePointsActive = useMemo(
    () => (salePoints ?? []).filter((sp) => sp.isActive),
    [salePoints],
  );

  const limitByKey = useMemo(() => {
    const map = new Map<string, SaleLimit>();
    for (const l of limits ?? []) {
      map.set(`${l.gameId}|${l.salePointId}`, l);
    }
    return map;
  }, [limits]);

  const currentSalePoint = salePointsActive.find((sp) => sp.id === salePointId);

  // Show count of configured limits per sucursal in the dropdown so the
  // operator sees which ones already have setup vs. blank slates.
  const configuredCountBySalePoint = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of limits ?? []) {
      counts.set(l.salePointId, (counts.get(l.salePointId) ?? 0) + 1);
    }
    return counts;
  }, [limits]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-5 text-muted-foreground" />
          <h1 className="text-2xl font-black tracking-tight">
            Límites de Venta
          </h1>
        </div>
        <p className="max-w-md text-xs text-muted-foreground">
          Tope en córdobas por número por sorteo. Al alcanzarse, ese número
          queda bloqueado hasta el siguiente sorteo. Se resetea automáticamente.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          No se pudieron cargar los límites: {error.message}
        </div>
      )}

      <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <label className="space-y-1.5">
          <span className="block text-xs font-semibold text-muted-foreground">
            Sucursal
          </span>
          <Select
            value={salePointId}
            onChange={setSalePointId}
            leadingIcon={<MapPin className="size-4" />}
            placeholder={
              loadingSalePoints
                ? 'Cargando…'
                : 'Elegí la sucursal a configurar'
            }
            disabled={loadingSalePoints}
            options={salePointsActive.map((sp) => {
              const count = configuredCountBySalePoint.get(sp.id) ?? 0;
              return {
                value: sp.id,
                label: count > 0 ? `${sp.name}  (${count})` : sp.name,
              };
            })}
          />
          <span className="block text-[11px] text-muted-foreground/70">
            El número entre paréntesis indica cuántos juegos tienen límite
            configurado en esa sucursal.
          </span>
        </label>
      </div>

      {!salePointId ? (
        <EmptyState />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-border px-6 py-3">
            <div>
              <div className="text-sm font-bold text-foreground">
                {currentSalePoint?.name ?? 'Sucursal'}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {gamesActive.length} juegos activos
              </div>
            </div>
            <CopyFromButton
              targetSalePointId={salePointId}
              salePoints={salePointsActive}
              configuredCountBySalePoint={configuredCountBySalePoint}
              limits={limits ?? []}
              activeGameIds={gamesActive.map((g) => g.id)}
            />
          </div>

          {loadingLimits ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              <Loader2 className="mx-auto size-5 animate-spin" />
            </div>
          ) : gamesActive.length === 0 ? (
            <div className="p-14 text-center text-sm text-muted-foreground">
              Aún no hay juegos activos.
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {gamesActive.map((game) => (
                <LimitRow
                  key={game.id}
                  gameId={game.id}
                  gameName={game.name}
                  salePointId={salePointId}
                  existing={limitByKey.get(`${game.id}|${salePointId}`)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-14 text-center">
      <MapPin className="mx-auto size-8 text-muted-foreground/40" />
      <p className="mt-3 text-sm text-muted-foreground">
        Elegí una sucursal arriba para configurar sus límites de venta.
      </p>
    </div>
  );
}

type RowStatus = 'idle' | 'saving' | 'saved';

function LimitRow({
  gameId,
  gameName,
  salePointId,
  existing,
}: {
  gameId: string;
  gameName: string;
  salePointId: string;
  existing: SaleLimit | undefined;
}) {
  const [draft, setDraft] = useState<string>(
    existing ? String(existing.amount) : '',
  );
  const [status, setStatus] = useState<RowStatus>('idle');
  const savedTimer = useRef<number | null>(null);

  const upsert = useUpsertSaleLimit();
  const remove = useDeleteSaleLimit();

  useEffect(() => {
    // Only sync from server when we're not mid-edit, otherwise the input
    // would clobber the user's typing on refetch.
    if (status === 'idle') {
      setDraft(existing ? String(existing.amount) : '');
    }
  }, [existing, status]);

  useEffect(() => {
    if (status !== 'saved') return;
    savedTimer.current = window.setTimeout(() => setStatus('idle'), 1500);
    return () => {
      if (savedTimer.current) window.clearTimeout(savedTimer.current);
    };
  }, [status]);

  const persist = async () => {
    const trimmed = draft.trim();
    const numeric = trimmed === '' ? NaN : Number(trimmed);
    const nextAmount =
      Number.isInteger(numeric) && numeric >= 0 ? numeric : null;

    // Cleared → delete existing row (lift the cap).
    if (trimmed === '') {
      if (!existing) return;
      setStatus('saving');
      try {
        await remove.mutateAsync(existing.id);
        setStatus('saved');
      } catch {
        setStatus('idle');
      }
      return;
    }

    // Invalid → snap back to previous value.
    if (nextAmount === null) {
      setDraft(existing ? String(existing.amount) : '');
      return;
    }

    // No-op.
    if (existing && nextAmount === existing.amount) return;

    setStatus('saving');
    try {
      await upsert.mutateAsync({ gameId, salePointId, amount: nextAmount });
      setStatus('saved');
    } catch {
      setStatus('idle');
    }
  };

  const isDirty =
    (existing ? String(existing.amount) : '') !== draft.trim();

  return (
    <li className="flex items-center justify-between gap-4 px-6 py-3 hover:bg-slate-50/40">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <Dices className="size-4" strokeWidth={2.4} />
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-foreground">
            {gameName}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {existing
              ? `Actual: ${formatCurrency(existing.amount)}`
              : 'Sin límite'}
          </div>
        </div>
      </div>

      <div className="relative w-44 shrink-0">
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
          C$
        </span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={persist}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            } else if (e.key === 'Escape') {
              setDraft(existing ? String(existing.amount) : '');
              e.currentTarget.blur();
            }
          }}
          placeholder="Sin límite"
          className={cn(
            'w-full rounded-md border bg-background pl-9 pr-8 py-2 text-right text-sm tabular-nums transition',
            'placeholder:text-muted-foreground/50 placeholder:font-normal placeholder:text-xs',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            existing
              ? 'border-indigo-200 bg-indigo-50/50 font-semibold text-indigo-900'
              : 'border-border',
            isDirty && status === 'idle' && 'border-amber-300 bg-amber-50/50',
          )}
        />
        {status !== 'idle' && (
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            {status === 'saving' ? (
              <Loader2 className="size-4 animate-spin text-primary" />
            ) : (
              <Check className="size-4 text-emerald-600" strokeWidth={2.8} />
            )}
          </span>
        )}
      </div>
    </li>
  );
}

function CopyFromButton({
  targetSalePointId,
  salePoints,
  configuredCountBySalePoint,
  limits,
  activeGameIds,
}: {
  targetSalePointId: string;
  salePoints: { id: string; name: string }[];
  configuredCountBySalePoint: Map<string, number>;
  limits: SaleLimit[];
  activeGameIds: string[];
}) {
  const [open, setOpen] = useState(false);
  const [sourceId, setSourceId] = useState('');
  const [copying, setCopying] = useState(false);

  // Only offer sucursales that have at least one limit configured AND
  // aren't the target itself.
  const eligible = useMemo(
    () =>
      salePoints.filter(
        (sp) =>
          sp.id !== targetSalePointId &&
          (configuredCountBySalePoint.get(sp.id) ?? 0) > 0,
      ),
    [salePoints, configuredCountBySalePoint, targetSalePointId],
  );

  useEffect(() => {
    if (!open) setSourceId('');
  }, [open]);

  const handleCopy = async () => {
    if (!sourceId || copying) return;
    // Filter to active games only — ignore stale limits from disabled games.
    const applicable = limits
      .filter((l) => l.salePointId === sourceId)
      .filter((l) => activeGameIds.includes(l.gameId));
    if (applicable.length === 0) {
      toast.info('La sucursal origen no tiene límites en juegos activos.');
      return;
    }
    setCopying(true);
    try {
      // PUT is idempotent per (game, sucursal), so order doesn't matter.
      // Use allSettled so one bad row doesn't sink the batch.
      const results = await Promise.allSettled(
        applicable.map((l) =>
          upsertSaleLimit({
            gameId: l.gameId,
            salePointId: targetSalePointId,
            amount: l.amount,
          }),
        ),
      );
      const failed = results.filter((r) => r.status === 'rejected').length;
      if (failed === 0) {
        toast.success(
          `Copiados ${applicable.length} límite(s) desde la sucursal origen.`,
        );
      } else {
        toast.warning(
          `${applicable.length - failed} copiados, ${failed} fallaron.`,
        );
      }
      setOpen(false);
    } finally {
      setCopying(false);
    }
  };

  if (eligible.length === 0) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
      >
        <Copy className="size-3.5" strokeWidth={2.4} />
        Copiar de otra sucursal
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-full z-40 mt-2 w-80 rounded-xl border border-border bg-card p-3 shadow-lg">
            <div className="mb-2 text-xs font-semibold text-foreground">
              Copiar límites desde:
            </div>
            <Select
              value={sourceId}
              onChange={setSourceId}
              leadingIcon={<MapPin className="size-4" />}
              placeholder="Elegí la sucursal origen"
              options={eligible.map((sp) => {
                const count = configuredCountBySalePoint.get(sp.id) ?? 0;
                return { value: sp.id, label: `${sp.name}  (${count})` };
              })}
            />
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!sourceId || copying}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground',
                  (!sourceId || copying) && 'cursor-not-allowed opacity-60',
                )}
              >
                {copying ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Copy className="size-3.5" strokeWidth={2.4} />
                )}
                Copiar
              </button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground/70">
              Solo se copian juegos activos. Los valores existentes en esta
              sucursal serán reemplazados si el juego coincide.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
