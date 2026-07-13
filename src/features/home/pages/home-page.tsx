import { Calendar, CircleDollarSign, HandCoins, Users } from 'lucide-react';

import { KpiCard } from '@/features/home/components/kpi-card';
import { MonthlyChart } from '@/features/home/components/monthly-chart';
import { useDashboardSummary } from '@/features/home/hooks/use-dashboard-summary';
import { useSession } from '@/features/auth/hooks/use-session';
import { formatCurrency } from '@/shared/lib/format';

export function HomePage() {
  const { data, isLoading, error } = useDashboardSummary();
  const session = useSession();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader name={session?.user.name ?? ''} />

      {isLoading && <HomeSkeleton />}
      {error && <HomeError message={error.message} />}
      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Facturado hoy"
              value={formatCurrency(data.billedToday)}
              icon={CircleDollarSign}
              tone="emerald"
              hint="Ventas del día"
              trend="up"
            />
            <KpiCard
              label="Pagado hoy"
              value={formatCurrency(data.paidToday)}
              icon={HandCoins}
              tone="rose"
              hint="Premios entregados"
              trend="down"
            />
            <KpiCard
              label="Venta semanal"
              value={formatCurrency(data.weeklyBilled)}
              icon={Calendar}
              tone="amber"
              hint="Últimos 7 días"
              trend="up"
            />
            <KpiCard
              label="Total usuarios"
              value={data.totalUsers.toString()}
              icon={Users}
              tone="indigo"
              hint="Cuentas registradas"
            />
          </div>

          <MonthlyChart data={data.monthlySeries} />
        </>
      )}
    </div>
  );
}

function PageHeader({ name }: { name: string }) {
  const today = new Intl.DateTimeFormat('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
  const first = name.split(' ')[0];
  const capitalized = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-black tracking-tight">
          Hola{first ? `, ${first}` : ''} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{capitalized}</p>
      </div>
    </header>
  );
}

function HomeSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-border/70 bg-card"
          />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-2xl border border-border/70 bg-card" />
    </div>
  );
}

function HomeError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
      No se pudieron cargar los datos del dashboard: {message}
    </div>
  );
}
