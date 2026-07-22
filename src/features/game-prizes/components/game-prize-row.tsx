import { useEffect, useRef, useState } from 'react';
import { Check, Dices, Loader2 } from 'lucide-react';

import { useUpsertGamePrize } from '@/features/game-prizes/hooks/use-game-prizes';
import { cn } from '@/shared/lib/cn';

import type { EffectiveGamePrize } from '@/features/game-prizes/types';

type RowStatus = 'idle' | 'saving' | 'saved';

/**
 * Editable pair of multipliers (main + secondary) for one game at one
 * sucursal. Placeholder shows the game default; empty input inherits it.
 * Save-on-blur, Enter to commit, Escape to cancel. Clearing both fields
 * deletes the override.
 */
export function GamePrizeRow({
  salePointId,
  prize,
}: {
  salePointId: string;
  prize: EffectiveGamePrize;
}) {
  const [exactDraft, setExactDraft] = useState<string>(
    prize.overrideExact !== null ? String(prize.overrideExact) : '',
  );
  const [easyDraft, setEasyDraft] = useState<string>(
    prize.overrideEasy !== null ? String(prize.overrideEasy) : '',
  );
  const [status, setStatus] = useState<RowStatus>('idle');
  const savedTimer = useRef<number | null>(null);

  const upsert = useUpsertGamePrize();

  useEffect(() => {
    if (status === 'idle') {
      setExactDraft(
        prize.overrideExact !== null ? String(prize.overrideExact) : '',
      );
      setEasyDraft(
        prize.overrideEasy !== null
          ? String(prize.overrideEasy)
          : '',
      );
    }
  }, [prize.overrideExact, prize.overrideEasy, status]);

  useEffect(() => {
    if (status !== 'saved') return;
    savedTimer.current = window.setTimeout(() => setStatus('idle'), 1500);
    return () => {
      if (savedTimer.current) window.clearTimeout(savedTimer.current);
    };
  }, [status]);

  const parseField = (raw: string): number | null | 'invalid' => {
    const t = raw.trim();
    if (t === '') return null;
    const n = Number(t);
    if (!Number.isInteger(n) || n < 0) return 'invalid';
    return n;
  };

  const persist = async () => {
    const nextExact = parseField(exactDraft);
    const nextEasy = parseField(easyDraft);

    // Invalid → snap back.
    if (nextExact === 'invalid') {
      setExactDraft(
        prize.overrideExact !== null ? String(prize.overrideExact) : '',
      );
      return;
    }
    if (nextEasy === 'invalid') {
      setEasyDraft(
        prize.overrideEasy !== null
          ? String(prize.overrideEasy)
          : '',
      );
      return;
    }

    // No-op.
    if (
      nextExact === prize.overrideExact &&
      nextEasy === prize.overrideEasy
    ) {
      return;
    }

    setStatus('saving');
    try {
      await upsert.mutateAsync({
        salePointId,
        gameId: prize.gameId,
        exactMultiplier: nextExact,
        easyMultiplier: nextEasy,
      });
      setStatus('saved');
    } catch {
      setStatus('idle');
    }
  };

  const exactDirty =
    (prize.overrideExact !== null ? String(prize.overrideExact) : '') !==
    exactDraft.trim();
  const easyDirty =
    (prize.overrideEasy !== null
      ? String(prize.overrideEasy)
      : '') !== easyDraft.trim();
  const anyDirty = exactDirty || easyDirty;

  // Games without a secondary default (Diaria, Fechas, Tica, etc.) don't
  // show the second input — one less field for the operator to look past.
  const showEasy = prize.easyDefault !== null;

  const statusBadge =
    status !== 'idle'
      ? status === 'saving'
        ? <Loader2 className="size-4 animate-spin text-primary" />
        : <Check className="size-4 text-emerald-600" strokeWidth={2.8} />
      : null;

  return (
    <li
      className={cn(
        'grid items-center gap-3 px-4 py-2.5 hover:bg-slate-50/40',
        showEasy
          ? 'grid-cols-[1fr_auto_auto]'
          : 'grid-cols-[1fr_auto]',
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <Dices className="size-3.5" strokeWidth={2.4} />
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-foreground">
            {prize.gameName}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {prize.hasOverride ? (
              <span className="font-semibold text-indigo-700">
                Personalizado
              </span>
            ) : (
              <>Default: {prize.exactDefault ?? '—'}x
                {prize.easyDefault !== null &&
                  ` / ${prize.easyDefault}x`}
              </>
            )}
          </div>
        </div>
      </div>

      <PrizeField
        label="Exacta"
        draft={exactDraft}
        setDraft={setExactDraft}
        placeholder={prize.exactDefault !== null ? String(prize.exactDefault) : '—'}
        dirty={exactDirty}
        overridden={prize.overrideExact !== null}
        onBlur={persist}
        // When there's no secondary field, the status badge lives on the
        // main input so the operator always sees the save confirmation.
        rightBadge={!showEasy ? statusBadge : undefined}
      />
      {showEasy && (
        <PrizeField
          label="Fácil"
          draft={easyDraft}
          setDraft={setEasyDraft}
          placeholder={String(prize.easyDefault)}
          dirty={easyDirty}
          overridden={prize.overrideEasy !== null}
          onBlur={persist}
          rightBadge={statusBadge}
        />
      )}

      {/* Reserved slot for future action (delete override button, tooltip, etc.) */}
      {anyDirty && status === 'idle' && (
        <span
          className={cn(
            '-mt-1.5 pl-11 text-[10px] text-amber-700',
            showEasy ? 'col-span-3' : 'col-span-2',
          )}
        >
          Sin guardar
        </span>
      )}
    </li>
  );
}

function PrizeField({
  label,
  draft,
  setDraft,
  placeholder,
  dirty,
  overridden,
  onBlur,
  rightBadge,
}: {
  label: string;
  draft: string;
  setDraft: (v: string) => void;
  placeholder: string;
  dirty: boolean;
  overridden: boolean;
  onBlur: () => void;
  rightBadge?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="relative w-28">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
            if (e.key === 'Escape') e.currentTarget.blur();
          }}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-md border bg-background pr-8 py-1.5 pl-2 text-right text-sm tabular-nums transition',
            'placeholder:text-muted-foreground/50 placeholder:font-normal placeholder:text-xs',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            overridden
              ? 'border-indigo-200 bg-indigo-50/50 font-semibold text-indigo-900'
              : 'border-border',
            dirty && 'border-amber-300 bg-amber-50/50',
          )}
        />
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground">
          {rightBadge ?? 'x'}
        </span>
      </div>
    </div>
  );
}
