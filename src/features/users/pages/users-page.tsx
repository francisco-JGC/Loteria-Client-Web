import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Search, Users } from 'lucide-react';

import { useSalePoints } from '@/features/sale-points/hooks/use-sale-points';
import { CreateUserModal } from '@/features/users/components/create-user-modal';
import { useUsers } from '@/features/users/hooks/use-users';
import { cn } from '@/shared/lib/cn';
import {
  SegmentedControl,
  type SegmentTab,
} from '@/shared/ui/segmented-control';

import type { SalePoint } from '@/features/sale-points/types';
import type { User, UserRole } from '@/features/users/types';

type RoleFilter = 'all' | UserRole;

const ROLE_TABS: readonly SegmentTab<RoleFilter>[] = [
  { key: 'all', label: 'Todos' },
  { key: 'seller', label: 'Vendedores', tone: 'emerald' },
  { key: 'admin', label: 'Administradores', tone: 'amber' },
] as const;

const PAGE_SIZE = 20;

export function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const params = useMemo(
    () => ({
      role: roleFilter === 'all' ? undefined : roleFilter,
      search: search.trim() || undefined,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    }),
    [roleFilter, search, page],
  );

  const { data, isLoading, error, isFetching } = useUsers(params);
  const { data: salePoints } = useSalePoints();
  const total = data?.total ?? 0;
  const items = data?.items ?? [];

  // O(1) lookup so each row doesn't scan the whole array.
  const salePointById = useMemo(() => {
    const map = new Map<string, SalePoint>();
    for (const sp of salePoints ?? []) map.set(sp.id, sp);
    return map;
  }, [salePoints]);
  const rangeStart = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const rangeEnd = Math.min(total, (page + 1) * PAGE_SIZE);
  const hasPrev = page > 0;
  const hasNext = rangeEnd < total;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-muted-foreground" />
          <h1 className="text-2xl font-black tracking-tight">
            Lista de usuarios
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" strokeWidth={2.8} />
          Nuevo usuario
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl
          ariaLabel="Filtrar por rol"
          tabs={ROLE_TABS}
          value={roleFilter}
          onChange={(next) => {
            setRoleFilter(next);
            setPage(0);
          }}
        />
        <div className="relative min-w-64 flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Buscar por nombre o usuario"
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          No se pudo cargar la lista: {error.message}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50/70 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Usuario</th>
                <th className="px-6 py-3">Sucursal</th>
                <th className="px-6 py-3">Cédula</th>
                <th className="px-6 py-3">Dirección</th>
                <th className="px-6 py-3 text-right">% Pago</th>
                <th className="px-6 py-3">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading && items.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-14 text-center text-sm text-muted-foreground"
                  >
                    {search || roleFilter !== 'all'
                      ? 'No hay usuarios que coincidan con tu búsqueda.'
                      : 'Aún no hay usuarios registrados.'}
                  </td>
                </tr>
              ) : (
                items.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    salePointName={
                      user.salePointId
                        ? salePointById.get(user.salePointId)?.name ?? null
                        : null
                    }
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-3 text-xs text-muted-foreground">
          <span>
            {isFetching ? (
              <span className="text-muted-foreground/70">Cargando…</span>
            ) : total === 0 ? (
              'Sin resultados'
            ) : (
              <>
                {rangeStart}–{rangeEnd} de{' '}
                <span className="font-semibold text-foreground">{total}</span>
              </>
            )}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={!hasPrev}
              className={cn(
                'flex size-8 items-center justify-center rounded-md',
                hasPrev
                  ? 'text-foreground hover:bg-secondary'
                  : 'cursor-not-allowed text-muted-foreground/40',
              )}
              aria-label="Página anterior"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext}
              className={cn(
                'flex size-8 items-center justify-center rounded-md',
                hasNext
                  ? 'text-foreground hover:bg-secondary'
                  : 'cursor-not-allowed text-muted-foreground/40',
              )}
              aria-label="Página siguiente"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </footer>
      </div>

      <CreateUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

function UserRow({
  user,
  salePointName,
}: {
  user: User;
  salePointName: string | null;
}) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-xs font-bold text-white">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <span className="font-semibold text-foreground">{user.name}</span>
        </div>
      </td>
      <td className="px-6 py-3.5 text-muted-foreground">@{user.username}</td>
      <td className="px-6 py-3.5 text-foreground">
        {salePointName ?? <Empty />}
      </td>
      <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">
        {user.nationalId ?? <Empty />}
      </td>
      <td className="max-w-xs truncate px-6 py-3.5 text-muted-foreground">
        {user.address ?? <Empty />}
      </td>
      <td className="px-6 py-3.5 text-right tabular-nums">
        {user.paymentPercentage !== null ? (
          <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-500/20">
            {user.paymentPercentage}%
          </span>
        ) : (
          <Empty />
        )}
      </td>
      <td className="px-6 py-3.5">
        <RoleBadge role={user.role} />
      </td>
    </tr>
  );
}

function Empty() {
  return <span className="text-muted-foreground/50">—</span>;
}

function RoleBadge({ role }: { role: UserRole }) {
  const style =
    role === 'admin'
      ? 'bg-amber-500/10 text-amber-700 ring-amber-500/20'
      : 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20';
  const label = role === 'admin' ? 'Administrador' : 'Vendedor';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset',
        style,
      )}
    >
      {label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        </td>
      ))}
    </tr>
  );
}
