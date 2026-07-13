import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { cn } from '@/shared/lib/cn';

type Tone = 'emerald' | 'rose' | 'amber' | 'indigo';

interface Props {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: Tone;
  hint?: string;
  trend?: 'up' | 'down' | 'flat';
}

const TONE: Record<
  Tone,
  { chip: string; iconWrap: string; icon: string; ring: string }
> = {
  emerald: {
    chip: 'bg-emerald-500/10',
    iconWrap: 'bg-emerald-500/12',
    icon: 'text-emerald-600',
    ring: 'ring-emerald-500/20',
  },
  rose: {
    chip: 'bg-rose-500/10',
    iconWrap: 'bg-rose-500/12',
    icon: 'text-rose-600',
    ring: 'ring-rose-500/20',
  },
  amber: {
    chip: 'bg-amber-500/10',
    iconWrap: 'bg-amber-500/15',
    icon: 'text-amber-600',
    ring: 'ring-amber-500/20',
  },
  indigo: {
    chip: 'bg-indigo-500/10',
    iconWrap: 'bg-indigo-500/12',
    icon: 'text-indigo-600',
    ring: 'ring-indigo-500/20',
  },
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  tone,
  hint,
  trend,
}: Props) {
  const t = TONE[tone];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:shadow-[0_12px_28px_-16px_rgba(15,23,42,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-black leading-none tracking-tight">
            {value}
          </p>
          {hint && (
            <div className="mt-3 flex items-center gap-1.5 text-xs">
              <TrendIcon trend={trend} tone={tone} />
              <span className="text-muted-foreground">{hint}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset',
            t.iconWrap,
            t.ring,
          )}
        >
          <Icon className={cn('size-5', t.icon)} strokeWidth={2.4} />
        </div>
      </div>
      <div
        className={cn(
          'pointer-events-none absolute -right-8 -top-8 size-32 rounded-full opacity-40 blur-3xl',
          t.chip,
        )}
      />
    </div>
  );
}

function TrendIcon({ trend, tone }: { trend?: Props['trend']; tone: Tone }) {
  if (trend === 'up') {
    return (
      <ArrowUpRight
        className={cn('size-3.5', TONE[tone].icon)}
        strokeWidth={2.4}
      />
    );
  }
  if (trend === 'down') {
    return (
      <ArrowDownRight
        className={cn('size-3.5', TONE[tone].icon)}
        strokeWidth={2.4}
      />
    );
  }
  return null;
}
